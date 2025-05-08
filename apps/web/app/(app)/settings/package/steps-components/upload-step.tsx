import { CardContent } from "@repo/ui/card";
import { toast } from "@repo/ui/sonner";
import { CloudUpload, Files, Package } from "lucide-react";
import React from "react";
import { UploadButton } from "~/lib/uploadthing";
import { verifPackage } from "~/services/packages/verif-package";

type UploadStepProps = {
	onClientUploadComplete: (packageId: string) => void;
};

export const UploadStep = ({
	onClientUploadComplete: callBackFunction,
}: UploadStepProps) => {
	const onClientUploadComplete = async (
		res: Array<{ serverData: { packageId: string } }>,
	) => {
		if (res && res.length <= 0) return;
		callBackFunction(res[0].serverData.packageId);
	};

	return (
		<CardContent className="group/upload mx-6 rounded-xl border-2 border-border border-dashed p-8 text-center transition-transform duration-500 hover:border-muted-foreground hover:duration-200">
			<div className="isolate flex justify-center">
				<>
					<div className="-rotate-6 group-hover/upload:-translate-x-5 group-hover/upload:-rotate-12 group-hover/upload:-translate-y-0.5 relative top-1.5 left-2.5 grid size-12 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover/upload:duration-200">
						<Files className="size-6 text-muted-foreground" />
					</div>
					<div className="group-hover/upload:-translate-y-0.5 relative z-10 grid size-12 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover/upload:duration-200">
						<Package className="size-6 text-muted-foreground" />
					</div>
					<div className="group-hover/upload:-translate-y-0.5 relative top-1.5 right-2.5 grid size-12 rotate-6 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover/upload:translate-x-5 group-hover/upload:rotate-12 group-hover/upload:duration-200">
						<CloudUpload className="size-6 text-muted-foreground" />
					</div>
				</>
			</div>
			<h2 className="mt-6 font-medium text-foreground">
				Upload Your Spotify Data Package
			</h2>
			<p className="mt-1 whitespace-pre-line text-muted-foreground text-sm">
				Please upload your Spotify data package to generate your listening
				stats.
			</p>
			<div className="mt-4 flex items-center justify-center gap-2">
				<UploadButton
					appearance={{
						button: "custom-button",
						allowedContent: { display: "none" },
					}}
					endpoint="spotifyPackageUploader"
					onBeforeUploadBegin={async (files) =>
						(await verifPackage(files)) ? files : []
					}
					onUploadError={(error: Error) => {
						toast.error(`Error uploading package: ${error.message}`);
					}}
					onClientUploadComplete={onClientUploadComplete}
				/>
			</div>
		</CardContent>
	);
};
