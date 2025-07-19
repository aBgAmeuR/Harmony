"server-only";

import { db, eq, packages } from "@repo/database";

/**
 * Fetches package data from the database
 */
export async function getPackage(userId: string, packageId: string) {
	return await db.query.packages.findFirst({
		where: (packages, { eq, and }) =>
			and(eq(packages.id, packageId), eq(packages.userId, userId)),
	});
}

/**
 * Updates the status of a package
 */
export async function setPackageStatus(packageId: string, status: string) {
	return await db
		.update(packages)
		.set({
			uploadStatus: status,
			tempFileLink: status === "processed" ? null : undefined,
		})
		.where(eq(packages.id, packageId));
}
