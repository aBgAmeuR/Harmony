import type { SpotifyConfig } from "../../types/SpotifyConfig";
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
	RatelimitError,
	UnauthorizedError,
	WhitelistError,
} from "../errors";
import type { Logger } from "../Logger";
import { AuthManager } from "./AuthManager";

export class HttpClient {
	private baseURL = "https://api.spotify.com/v1";
	private auth: AuthManager;

	constructor(
		protected config: SpotifyConfig,
		private logger: Logger,
	) {
		this.auth = new AuthManager(config, logger);
	}

	/**
	 * Builds the full URL with query parameters
	 */
	private getURL(path: string, query?: Record<string, string>): string {
		const url = new URL(path, this.baseURL);

		if (query) {
			Object.entries(query).forEach(([key, value]) => {
				url.searchParams.append(key, value);
			});
		}

		return url.toString();
	}

	/**
	 * Main request method with error handling and retries
	 */
	private async request<T>(
		path: string,
		options: RequestInit,
		query?: Record<string, string>,
	): Promise<T> {
		const url = this.getURL(path, query);
		const accessToken = await this.auth.getToken();

		const headers = new Headers({
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		});

		try {
			this.logger.log(
				`Making request to: ${url.length > 100 ? `${url.substring(0, 100)}...` : url}`,
			);

			const response = await fetch(url, {
				...options,
				headers,
				next: { revalidate: 3600 },
				cache: "force-cache",
			});

			if (response.ok) {
				return response.json();
			}

			// Handle rate limiting
			if (response.status === 429) {
				const retryAfter = Number(response.headers.get("retry-after")) || 1;

				this.logger.log(`Rate limited, retrying in ${retryAfter}s`);

				await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
				return this.request(path, options, query);
			}

			throw await this.handleError(response, url);
		} catch (error) {
			if (this.config.debug) {
				console.error("Request failed:", error);
			}
			throw error;
		}
	}

	/**
	 * Error handler that creates specific error instances
	 */
	private async handleError(response: Response, url: string): Promise<Error> {
		const data = await response.json().catch(() => null);

		switch (response.status) {
			case 400:
				return new BadRequestError(url, { data });
			case 401:
				return new UnauthorizedError(url, { data });
			case 403:
				if (data) {
					return new ForbiddenError(url, { data });
				}
				return new WhitelistError(url);
			case 404:
				return new NotFoundError(url);
			case 429:
				return new RatelimitError(
					`Rate limited, retry after ${response.headers.get("retry-after")}s`,
					url,
					{ data },
				);
			default:
				return new Error(`Request failed with status ${response.status}`);
		}
	}

	/**
	 * GET request
	 */
	async get<T>(path: string, query?: Record<string, string>): Promise<T> {
		return this.request<T>(path, { method: "GET" }, query);
	}

	/**
	 * POST request
	 */
	async post<T>(
		path: string,
		body: unknown,
		query?: Record<string, string>,
	): Promise<T> {
		return this.request<T>(
			path,
			{
				method: "POST",
				body: JSON.stringify(body),
			},
			query,
		);
	}

	/**
	 * PUT request
	 */
	async put<T>(
		path: string,
		body: unknown,
		query?: Record<string, string>,
	): Promise<T> {
		return this.request<T>(
			path,
			{
				method: "PUT",
				body: JSON.stringify(body),
			},
			query,
		);
	}

	/**
	 * DELETE request
	 */
	async delete<T>(path: string, query?: Record<string, string>): Promise<T> {
		return this.request<T>(path, { method: "DELETE" }, query);
	}

	async refreshToken(): Promise<void> {
		const token = await this.auth.getToken();
		await this.auth.refreshToken(token);
	}
}
