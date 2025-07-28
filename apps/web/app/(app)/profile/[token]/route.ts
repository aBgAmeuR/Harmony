import { notFound } from "next/navigation";
import { after } from "next/server";

import { signInWithShareableLink } from "@repo/auth";

import {
	getShareableLinkByToken,
	incrementShareableLinkUsage,
} from "~/features/shareable-links/data/shareable-links";

export default async function GET(
	_request: Request,
	{ params }: { params: Promise<{ token: string }> },
) {
	const { token } = await params;
	const link = await getShareableLinkByToken(token);

	if (!link || link.revoked) return notFound();
	if (link.expiresAt && new Date(link.expiresAt) < new Date())
		return notFound();
	if (link.usageLimit !== null && link.usageCount >= link.usageLimit)
		return notFound();

	after(async () => await incrementShareableLinkUsage(token));

	await signInWithShareableLink(token);
}
