import {
	generateUploadButton,
	generateUploadDropzone,
	generateUploader,
} from "@uploadthing/react";

import type { OurFileRouter } from "~/app/api/uploadthing/core";

export const UploadButton: ReturnType<
	typeof generateUploadButton<OurFileRouter>
> = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const useUploader = generateUploader<OurFileRouter>();
