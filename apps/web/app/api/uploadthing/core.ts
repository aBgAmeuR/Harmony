import { auth } from "@repo/auth";
import { prisma } from "@repo/database";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
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
      const newPackage = await prisma.package.create({
        data: {
          userId: metadata.userId,
          tempFileLink: file.ufsUrl,
          fileSize: `${(file.size / 1024).toFixed(2)} MB`,
          fileName: file.name,
        },
      });

      return {
        packageId: newPackage.id,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const utapi = new UTApi({});
