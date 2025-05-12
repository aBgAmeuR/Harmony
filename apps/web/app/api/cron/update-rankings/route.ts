import { prisma } from "@repo/database";
import { type NextRequest, NextResponse } from "next/server";
import { updateHistoricalRankings } from "~/services/historical-rankings";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return new Response("Unauthorized", {
			status: 401,
		});
	}

	try {
		const users = await prisma.user.findMany();

		await Promise.all(users.map((user) => updateHistoricalRankings(user.id)));

		return new NextResponse("Rankings updated successfully", { status: 200 });
	} catch (error) {
		console.error("Error updating rankings:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
