import { Button } from "@repo/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AlbumNotFound() {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center">
			<AlertTriangle className="mb-4 h-16 w-16 text-yellow-500" />
			<h1 className="mb-2 font-bold text-3xl">Album Not Found</h1>
			<p className="mb-6 text-center text-muted-foreground">
				The album you're looking for doesn't exist or has been removed.
			</p>
			<div className="flex gap-4">
				<Button asChild={true}>
					<Link href="/rankings/albums">Browse Albums</Link>
				</Button>
				<Button variant="outline" asChild={true}>
					<Link href="/">Go Home</Link>
				</Button>
			</div>
		</div>
	);
}
