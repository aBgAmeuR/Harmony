import { Button } from "@repo/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@repo/ui/dialog";
import {
	Clock,
	Download,
	FileText,
	HelpCircle,
	Mail,
	Settings,
} from "lucide-react";

export const DocsModal = () => {
	return (
		<Dialog>
			<DialogTrigger asChild={true}>
				<Button variant="ghost" size="sm">
					<HelpCircle className="size-4" />
					How to get my package
				</Button>
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(580px,80vh)] sm:max-w-lg [&>button:last-child]:top-4">
				<div className="overflow-y-auto">
					<DialogHeader className="contents space-y-0 text-left">
						<DialogTitle className="p-4">
							How to get your Spotify data package
						</DialogTitle>
						<DialogDescription asChild={true}>
							<div className="p-4">
								<div className="space-y-4 [&_strong]:font-semibold [&_strong]:text-foreground">
									<div className="flex gap-4">
										<Settings className="size-5 shrink-0 text-muted-foreground" />
										<div className="space-y-1">
											<p>
												<strong>1. Access Privacy Settings</strong>
											</p>
											<p className="text-muted-foreground">
												Go to your Spotify account page and navigate to Privacy
												Settings.
											</p>
										</div>
									</div>
									<div className="flex gap-4">
										<FileText className="size-5 shrink-0 text-muted-foreground" />
										<div className="space-y-1">
											<p>
												<strong>2. Request Data</strong>
											</p>
											<p className="text-muted-foreground">
												In the "Download your data" section, click "Request"
												next to "Extended streaming history".
											</p>
										</div>
									</div>
									<div className="flex gap-4">
										<Clock className="size-5 shrink-0 text-muted-foreground" />
										<div className="space-y-1">
											<p>
												<strong>3. Wait for Processing</strong>
											</p>
											<p className="text-muted-foreground">
												Spotify will prepare your data. This may take a few days
												to complete.
											</p>
										</div>
									</div>
									<div className="flex gap-4">
										<Mail className="size-5 shrink-0 text-muted-foreground" />
										<div className="space-y-1">
											<p>
												<strong>4. Check Your Email</strong>
											</p>
											<p className="text-muted-foreground">
												Once ready, you'll receive an email with a download link
												for your data package.
											</p>
										</div>
									</div>
									<div className="flex gap-4">
										<Download className="size-5 shrink-0 text-muted-foreground" />
										<div className="space-y-1">
											<p>
												<strong>5. Download Package</strong>
											</p>
											<p className="text-muted-foreground">
												Click the link in the email to download your data as a
												ZIP file.
											</p>
										</div>
									</div>
									<div className="rounded-lg bg-muted/50 p-4">
										<p className="text-muted-foreground text-sm">
											<strong className="text-foreground">Note:</strong> Your
											package will contain JSON files with your listening
											history.
										</p>
									</div>
								</div>
							</div>
						</DialogDescription>
					</DialogHeader>
				</div>
				<DialogFooter className="border-t p-2">
					<DialogClose asChild={true}>
						<Button type="button" size="sm">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
