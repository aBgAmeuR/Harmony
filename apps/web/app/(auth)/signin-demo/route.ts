import { signInDemo } from "@repo/auth";

export async function GET() {
	return await signInDemo("/settings/about");
}
