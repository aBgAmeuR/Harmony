"server-only";

import { NextResponse } from "next/server";

import { getUserOrNull } from "@repo/auth";
import { db } from "@repo/database";

export class ApiError extends Error {
	constructor(
		message: string,
		public statusCode: number,
	) {
		super(message);
	}
}

export async function isAuthenticatedOrThrow() {
	const user = await getUserOrNull();

	if (!user || user.isDemo) {
		throw new ApiError("Not authenticated", 401);
	}

	return user;
}

export async function isRateLimitedOrThrow(userId: string, time: number) {
	const lastPackage = await db.query.packages.findFirst({
		where: (packages, { eq }) => eq(packages.userId, userId),
		orderBy: (packages, { desc }) => desc(packages.createdAt),
		columns: { createdAt: true },
	});

	if (!lastPackage) {
		return false;
	}

	const lastPackageTime = lastPackage.createdAt?.getTime() ?? 0;
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
