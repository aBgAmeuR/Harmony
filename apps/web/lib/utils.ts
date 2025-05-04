import { Session, auth } from "@repo/auth";
import { cache } from "react";

export const getMsPlayedInMinutes = (msPlayed: number | string) =>
	(Number(msPlayed) / (1000 * 60)).toFixed(2);

export const getMsPlayedInHours = (
	msPlayed: number | string | (string | number)[],
	showDecimals = true,
) => {
	const hours = Number(msPlayed) / (1000 * 60 * 60);

	if (showDecimals) {
		return hours.toFixed(2);
	}

	return Math.floor(hours).toString();
};

export const getUserInfos = cache(async () => {
	const session = await auth();
	const userId = session?.user?.id;
	const isDemo = session?.user?.name === "Demo";

	return {
		userId,
		isDemo,
	};
});

/**
 * Reads a ReadableStream line by line and processes each JSON line
 *
 * @param response Fetch response containing a ReadableStream
 * @param onProgress Callback called for each processed JSON line
 * @param onError Optional callback called in case of an error
 * @param onComplete Optional callback called when the stream is complete
 * @returns A function to cancel the stream reading
 */
export async function readStreamResponse<T>({
	response,
	onProgress,
	onError,
	onComplete,
}: {
	response: Response;
	onProgress: (data: T) => void;
	onError?: (error: Error) => void;
	onComplete?: () => void;
}): Promise<() => Promise<void>> {
	if (!response.body) {
		const error = new Error("No response body");
		if (onError) onError(error);
		throw error;
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";
	let cancelled = false;

	const processStream = async (): Promise<void> => {
		try {
			while (!cancelled) {
				const { value, done } = await reader.read();

				if (done) {
					if (onComplete) onComplete();
					break;
				}

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n");
				buffer = lines.pop() || "";

				for (const line of lines) {
					if (!line.trim()) continue;

					try {
						const data = JSON.parse(line) as T;
						onProgress(data);
					} catch (e) {}
				}
			}
		} catch (error) {
			if (!cancelled && onError) {
				onError(error instanceof Error ? error : new Error(String(error)));
			}
		}
	};

	processStream();

	return async () => {
		cancelled = true;
		await reader.cancel();
	};
}
