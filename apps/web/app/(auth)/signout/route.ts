import { signOut } from "@repo/auth";

export async function GET(req: Request) {
	const searchParams = new URL(req.url).searchParams;

	return signOut(searchParams.get("callbackUrl") ?? undefined);
}
