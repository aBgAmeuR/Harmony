import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@repo/auth";
import { UploadThingError } from "uploadthing/server";

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
    .middleware(async ({ req, files }) => {
      if (!files.length) throw new UploadThingError("File invalid");

      // Run auth or other middleware checks
      const session = await auth();
      if (!session?.user) throw new UploadThingError("Unauthorized");
      
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Handle the completed upload - file.url contains the URL to the uploaded file
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      return { 
        uploadedBy: metadata.userId,
        fileUrl: file.url,
        fileKey: file.key
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;