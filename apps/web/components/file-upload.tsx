"use client";

import { signOut } from "@repo/auth/actions";
import { Button } from "@repo/ui/button";
import { toast } from "@repo/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import { FileArchive, LoaderCircle, Upload, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

import { filesProcessing } from "~/services/file-processing";

export const FileUpload = () => {
	const [file, setFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [processingTime, setProcessingTime] = useState(0);
	const [inTransition, startTransition] = useTransition();
	const queryClient = useQueryClient();

	useEffect(() => {
		// eslint-disable-next-line no-undef
		let interval: NodeJS.Timeout | null = null;
		if (inTransition) {
			interval = setInterval(() => {
				setProcessingTime((prevTime) => prevTime + 1);
			}, 1000);
		} else {
			setProcessingTime(0);
			interval = null;
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [inTransition]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setFile(event.target.files[0]);
		}
	};

	const handleFileRemove = () => {
		setFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

  const handleUpload = async () => {
    if (file) {
      startTransition(async () => {
        // const res = await filesProcessing(file);
        // if (res.message === "error") {
        //   toast.error(res.error);
        //   return;
        // }
        queryClient.clear();
        // TODO: Update user session but next-auth has not yet implemented the solution
        await signOut({ redirect: true, redirectTo: "/settings/package" });
      });
    }
  };

	return (
		<>
			<div>
				<input
					ref={fileInputRef}
					type="file"
					id="file-upload"
					className="sr-only"
					onChange={handleFileChange}
					accept=".zip"
				/>
				<label
					htmlFor="file-upload"
					className="flex cursor-pointer justify-center rounded-md border-2 border-gray-300 border-dashed px-6 pt-5 pb-6"
				>
					<div className="space-y-1 text-center">
						<Upload className="mx-auto size-12 text-gray-400" />
						<div className="flex text-gray-600 text-sm dark:text-gray-400">
							<span className="relative font-medium text-primary hover:text-primary-dark">
								Upload a file
							</span>
							<p className="pl-1">or drag and drop</p>
						</div>
						<p className="text-gray-500 text-xs dark:text-gray-400">
							ZIP file up to 100MB
						</p>
					</div>
				</label>
			</div>
			{file && (
				<div className="mt-4 flex items-center justify-between">
					<div className="flex">
						<FileArchive className="mr-2 size-5 text-primary" />
						<p>
							<span>{file.name}</span>
							<span className="ml-2 text-gray-500 text-xs">
								{(file.size / 1024 / 1024).toFixed(2)}MB
							</span>
						</p>
					</div>
					<Button
						variant="destructive"
						size="icon"
						onClick={handleFileRemove}
						className="size-8"
					>
						<X />
					</Button>
				</div>
			)}

			<Button
				onClick={handleUpload}
				disabled={!file || inTransition}
				className="mt-4 w-full"
			>
				{inTransition ? (
					<>
						<LoaderCircle className="mr-2 size-4 animate-spin" />
						Processing... ({processingTime}s)
					</>
				) : (
					"Process Data"
				)}
			</Button>
		</>
	);
};
