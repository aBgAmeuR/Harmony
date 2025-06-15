import { auth } from "@repo/auth";
import { format, localeFormat } from "light-date";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getMsPlayedInMinutes = (msPlayed: number | string) =>
	(Number(msPlayed) / (1000 * 60)).toFixed(2);

export const formatMonth = (date: Date) =>
	`${localeFormat(date, "{MMMM}")} ${format(date, "{yyyy}")}`;

export const msToHours = (ms: number) => ms / 1000 / 60 / 60;

export const getUserInfos = cache(async () => {
	const session = await auth();
	const userId = session?.user?.id;
	const isDemo = session?.user?.name === "Demo";
	const hasPackage = session?.user?.hasPackage;

	if (!userId) {
		redirect("/login");
	}

	return {
		userId,
		isDemo,
		hasPackage,
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
}: {
	response: Response;
	onProgress: (data: T) => void;
	onError?: (error: Error) => void;
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
				const { value } = await reader.read();

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
