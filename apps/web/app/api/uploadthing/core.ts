import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

import { getUserOrNull } from "@repo/auth";
import { db, packages } from "@repo/database";

const f = createUploadthing();

export const ourFileRouter: FileRouter = {
	spotifyPackageUploader: f({
		"application/zip": {
			maxFileSize: "32MB",
			maxFileCount: 1,
		},
		// @ts-expect-error - this is a bug in the type definition
		"application/x-zip-compressed": {
			maxFileSize: "32MB",
			maxFileCount: 1,
		},
		"application/octet-stream": {
			maxFileSize: "32MB",
			maxFileCount: 1,
		},
	})
		.middleware(async ({ files }) => {
			if (!files.length) throw new UploadThingError("File invalid");

			const user = await getUserOrNull();
			if (!user) throw new UploadThingError("Unauthorized");

			return { userId: user.userId };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			const newPackage = await db
				.insert(packages)
				.values({
					userId: metadata.userId,
					tempFileLink: file.ufsUrl,
					fileSize: `${(file.size / 1024).toFixed(2)} MB`,
					fileName: file.name,
				})
				.returning({ id: packages.id });

			return {
				packageId: newPackage[0].id,
			};
		}),
};

export type OurFileRouter = typeof ourFileRouter;

export const utapi = new UTApi({});
