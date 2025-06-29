"server-only";

import { prisma } from "@repo/database";

/**
 * Fetches package data from the database
 */
export async function getPackage(userId: string, packageId: string) {
	return await prisma.package.findFirst({
		where: {
			id: packageId,
			userId,
		},
	});
}

/**
 * Updates the status of a package
 */
export async function setPackageStatus(packageId: string, status: string) {
	return await prisma.package.update({
		where: { id: packageId },
		data: {
			uploadStatus: status,
			tempFileLink: status === "processed" ? null : undefined,
		},
	});
}
