import { ArrowRightIcon, LayoutDashboard, TriangleAlert } from "lucide-react";
import Link from "next/link";

import { cn } from "@repo/ui/lib/utils";
import { Separator } from "@repo/ui/separator";

type AnnouncementProps = {
	className?: string;
};

export function Announcement({ className }: AnnouncementProps) {
	const isMaintenance = process.env.APP_MAINTENANCE === "true";

	if (isMaintenance) {
		return (
			<div
				className={cn(
					"inline-flex gap-2 rounded-lg bg-muted px-3 py-1 font-medium text-sm",
					className,
				)}
			>
				<TriangleAlert
					className="mt-0.5 shrink-0 text-red-400 opacity-60 dark:text-red-600"
					size={16}
					strokeWidth={2}
					aria-hidden="true"
				/>
				<span>Maintenance in progress. Please check back later.</span>
			</div>
		);
	}

	return (
		<Link
			href="/detail/artist/699OTQXzgjhIYAHMy9RyPD"
			className={cn(
				"inline-flex items-center rounded-lg bg-muted px-3 py-1 font-medium text-sm",
				className,
			)}
		>
			<LayoutDashboard className="size-4" />{" "}
			<Separator
				className="mx-2 h-3 bg-muted-foreground"
				orientation="vertical"
			/>{" "}
			<span>Introducing Artist Details Page</span>
			<ArrowRightIcon className="ml-1 size-4" />
		</Link>
	);
}
