"use client";

import { CircleAlert } from "lucide-react";

import { Button } from "@repo/ui/button";

export const MusicListError = () => {
	return (
		<div className="rounded-lg border border-border bg-background p-4 shadow-black/5 shadow-lg">
			<div className="flex gap-2">
				<div className="flex grow gap-3">
					<CircleAlert
						className="mt-0.5 shrink-0 text-red-500"
						size={16}
						strokeWidth={2}
						aria-hidden="true"
					/>
					<div className="flex grow flex-col gap-3">
						<div className="space-y-1">
							<p className="font-medium text-sm">
								We couldn&lsquo;t complete your request!
							</p>
							<p className="text-muted-foreground text-sm">
								It indicates that an issue has prevented the processing of the
								request.
							</p>
						</div>
						<div className="flex gap-2">
							<Button
								size="sm"
								onClick={() => {
									if (typeof window !== "undefined") {
										window.location.reload();
									}
								}}
							>
								Retry
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
