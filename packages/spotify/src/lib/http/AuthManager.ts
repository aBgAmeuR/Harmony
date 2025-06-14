import { auth } from "@repo/auth";
import { accounts, db, eq } from "@repo/database";
import type { SpotifyConfig } from "../../types/SpotifyConfig";
import type { Logger } from "../Logger";
import { AuthError } from "../errors";

interface SpotifyTokenResponse {
	access_token: string;
	expires_in: number;
	refresh_token?: string;
}

export class AuthManager {
	private baseUrl = "https://accounts.spotify.com/api";
	private refreshPromise: Promise<string> | null = null;

	constructor(
		private config: SpotifyConfig,
		private logger: Logger,
	) {}

	/**
	 * Get the Basic auth header for Spotify API
	 */
	private getBasicAuthHeader(): string {
		return `Basic ${Buffer.from(
			`${this.config.clientId}:${this.config.clientSecret}`,
		).toString("base64")}`;
	}

	/**
	 * Check if the token is expired or about to expire
	 */
	private isTokenExpired(expiresAt: number): boolean {
		const now = Math.floor(Date.now() / 1000);
		const difference = Math.floor((expiresAt - now) / 60);
		return difference <= 10;
	}

	/**
	 * Refresh the token using the refresh_token
	 */
	public async refreshToken(
		refreshToken: string,
	): Promise<SpotifyTokenResponse | null> {
		if (!this.config.clientId || !this.config.clientSecret) {
			throw new AuthError(
				"Missing client credentials (client ID or client secret)",
			);
		}

		const response = await fetch(`${this.baseUrl}/token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: this.getBasicAuthHeader(),
			},
			body: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: refreshToken,
				client_id: this.config.clientId,
			}),
			cache: "no-cache",
		});

		if (!response.ok) {
			// Lire le corps de la réponse une seule fois
			const responseText = await response.text();

			if (
				!responseText.includes("invalid_grant") &&
				!responseText.includes("Refresh token revoked")
			) {
				return null;
			}

			throw new AuthError("Failed to refresh access token", {
				stack: responseText,
				data: { status: response.status, statusText: response.statusText },
			});
		}

		this.logger.log("TOKEN REFRESHED");

		return await response.json();
	}

	/**
	 * Get a valid access token for the user, refreshing if necessary
	 */
	async getToken(): Promise<string> {
		// If there's already a refresh in progress, wait for it to complete
		if (this.refreshPromise) {
			this.logger.log("TOKEN REFRESH IN PROGRESS, WAITING...");
			return this.refreshPromise;
		}

		const session = this.config.userId
			? { user: { id: this.config.userId } }
			: await auth();

		if (!session?.user?.id) {
			throw new AuthError("No user session found");
		}

		const account = await db.query.accounts.findFirst({
			where: eq(accounts.userId, session.user.id),
		});

		if (!account?.refreshToken) {
			throw new AuthError("No Spotify account linked");
		}

		// Return existing token if it's still valid
		if (
			account.accessToken &&
			account.expiresAt &&
			!this.isTokenExpired(Number(account.expiresAt))
		) {
			return account.accessToken;
		}

		// Create a refresh promise that other calls can wait for
		try {
			this.refreshPromise = this.refreshTokenAndUpdate(account);
			return await this.refreshPromise;
		} finally {
			// Clear the promise when done, regardless of success or failure
			this.refreshPromise = null;
		}
	}

	/**
	 * Refresh the token and update in database
	 */
	private async refreshTokenAndUpdate(
		account: typeof accounts.$inferSelect,
	): Promise<string> {
		this.logger.log("REFRESHING TOKEN");

		// Refresh the token
		const data = await this.refreshToken(account.refreshToken!);
		if (!data) {
			return this.getToken();
		}
		const timestamp = Math.floor((Date.now() + data.expires_in * 1000) / 1000);

		// Update the database with new token information
		await db
			.update(accounts)
			.set({
				accessToken: data.access_token,
				expiresAt: timestamp,
				refreshToken: data.refresh_token || account.refreshToken, // Only update if new refresh token is provided
			})
			.where(
				eq(accounts.provider, "spotify") &&
					eq(accounts.providerAccountId, account.providerAccountId),
			);

		return data.access_token;
	}
}
