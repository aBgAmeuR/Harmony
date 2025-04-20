import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/card";
import React from "react";

type PackageDocumentationProps = {
	className?: string;
};

export const PackageDocumentation = ({
	className,
}: PackageDocumentationProps) => {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>Get Your Spotify Data Package</CardTitle>
				<CardDescription>
					Follow these simple steps to obtain your Spotify data package and
					start exploring your listening history with Harmony.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<ol className="list-inside list-decimal space-y-3">
						<li>
							Navigate to your{" "}
							<a
								href="https://www.spotify.com/account/privacy/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-chart-1 hover:underline"
							>
								Spotify Account Privacy Settings
							</a>
							.
						</li>
						<li>
							Scroll down to the <strong>"Download your data"</strong> section.
						</li>
						<li>
							Click on <strong>"Request"</strong> next to{" "}
							<em>"Extended streaming history"</em>.
						</li>
						<li>
							Wait for an email from Spotify containing the download link.
							<small className="block text-muted-foreground text-sm">
								(It may take up to 30 days, but usually arrives within a few
								days.)
							</small>
						</li>
						<li>Download the ZIP file using the provided link in the email.</li>
					</ol>
				</div>
			</CardContent>
		</Card>
	);
};
