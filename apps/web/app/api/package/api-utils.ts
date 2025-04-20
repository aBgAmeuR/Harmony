"server-only";

import { type User, auth } from "@repo/auth";
import { prisma } from "@repo/database";
import { NextResponse } from "next/server";

import { isDemo } from "~/lib/utils-server";

export class ApiError extends Error {
	constructor(
		message: string,
		public statusCode: number,
	) {
		super(message);
	}
}

export async function isAuthenticatedOrThrow(): Promise<User & { id: string }> {
	const session = await auth();

	if (!session?.user?.id || isDemo(session)) {
		throw new ApiError("Not authenticated", 401);
	}

	return session.user as User & { id: string };
}

export async function isRateLimitedOrThrow(userId: string, time: number) {
	const lastPackage = await prisma.package.findFirst({
		where: { userId },
		orderBy: { createdAt: "desc" },
		select: { createdAt: true },
	});

	if (!lastPackage) {
		return false;
	}

	const lastPackageTime = lastPackage.createdAt.getTime();
	const timeSinceLastUpload = Date.now() - lastPackageTime;
	const timeLeft = time - timeSinceLastUpload;

	if (timeLeft > 0) {
		throw new ApiError(
			`You can only upload a package once every ${time / 1000 / 60 / 60} hours`,
			429,
		);
	}
}

export function createJsonResponse(
	message: string,
	status = 200,
	data?: unknown,
): NextResponse {
	return NextResponse.json(
		{ message, ...(data ? { data } : undefined) },
		{ status },
	);
}

/**
 * Splits an array into batches of specified size
 */
export function batchArray<T>(array: T[], batchSize: number): T[][] {
	const batches: T[][] = [];
	for (let i = 0; i < array.length; i += batchSize) {
		batches.push(array.slice(i, i + batchSize));
	}
	return batches;
}
