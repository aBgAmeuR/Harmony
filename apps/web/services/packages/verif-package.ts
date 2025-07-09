import { extractZipAndGetFiles } from "~/lib/zip";

export async function verifPackage(files: File[]) {
	try {
		const buffer = await files[0].arrayBuffer();
		const filesRegexPattern =
			/Spotify Extended Streaming History\/Streaming_History_Audio_(\d{4}(-\d{4})?)_(\d+)\.json/;

		const filesResult = await extractZipAndGetFiles(buffer, filesRegexPattern);

		return Array.isArray(filesResult) && filesResult.length > 0;
	} catch (_error) {
		return false;
	}
}
