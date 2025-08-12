import { signInDemo } from "@repo/auth";
import { after } from "next/server";
import { preloadUserData } from "~/features/common/preload";

export async function GET() {
	after(async () => {
		await preloadUserData(process.env.DEMO_ID!);
	});

	return await signInDemo("/settings/about");
}
