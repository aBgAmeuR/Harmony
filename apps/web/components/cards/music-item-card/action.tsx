import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@repo/ui/lib/utils";

type MusicItemCardActionProps = {
	href?: string;
	className?: string;
	layout?: "grid" | "list";
};

export const MusicItemCardAction = ({ href, className, layout = "list" }: MusicItemCardActionProps) => (
	<Link
		href={href || "#"}
		passHref={true}
		className={cn(
			"flex cursor-pointer items-center duration-100 hover:translate-x-0.5",
			layout === "grid" && "rounded-full bg-background/80 p-1 shadow ring-1 ring-border hover:bg-accent hover:shadow-md",
			className
		)}
	>
		<ChevronRight size={layout === "grid" ? 16 : 20} />
	</Link>
);
