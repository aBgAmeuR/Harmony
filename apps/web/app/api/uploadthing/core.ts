import { auth } from "@repo/auth";
import { db, packages } from "@repo/database";
import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UTApi, UploadThingError } from "uploadthing/server";

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

			const session = await auth();
			if (!session?.user?.id) throw new UploadThingError("Unauthorized");

			return { userId: session.user.id };
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
