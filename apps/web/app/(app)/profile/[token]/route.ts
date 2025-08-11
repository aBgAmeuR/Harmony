import { redirect } from "next/navigation";
import { after } from "next/server";

import { signInWithShareableLink } from "@repo/auth";

import {
	getShareableLinkByToken,
	incrementShareableLinkUsage,
} from "~/features/shareable-links/data/shareable-links";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ token: string }> },
) {
	const { token } = await params;

	const link = await getShareableLinkByToken(token);

	if (!link || link.revoked) redirect("/error?error=LinkNotFound");
	if (link.expiresAt && new Date(link.expiresAt) < new Date())
		redirect("/error?error=LinkExpired");
	if (link.usageLimit !== 0 && link.usageCount >= link.usageLimit)
		redirect("/error?error=LinkMaxUsage");

	after(async () => await incrementShareableLinkUsage(token));

	await signInWithShareableLink(token);
}
