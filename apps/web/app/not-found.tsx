import { CircleHelp } from "lucide-react";
import Link from "next/link";

import { Button } from "@repo/ui/button";

import { Icons } from "~/components/icons";
import { ThemeToggle } from "~/components/theme-toggle";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col justify-between p-4">
			<div className="flex grow items-center justify-center">
				<div className="w-full max-w-md space-y-4 text-center">
					<CircleHelp className="mx-auto size-12" />
					<h1 className="font-bold text-2xl">404 Not Found</h1>
					<p className="text-lg">
						Oops! The page you're looking for doesn't exist. It might have been
						moved or deleted.
					</p>
					<p className="font-mono text-muted-foreground text-sm">
						Error Code: <span>Not Found</span>
					</p>
					<Button asChild={true}>
						<Link href="/">Take me Home</Link>
					</Button>
				</div>
			</div>
			<footer className="mt-8 flex items-center justify-center gap-2">
				<Icons.logo className="size-8" />
				<h1 className="font-bold text-xl">Harmony</h1>
				<ThemeToggle />
			</footer>
		</div>
	);
}
