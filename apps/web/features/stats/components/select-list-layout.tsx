"use client";

import { AlignJustify, Grid2x2 } from "lucide-react";

import { Label } from "@repo/ui/label";
import { cn } from "@repo/ui/lib/utils";
import { Skeleton } from "@repo/ui/skeleton";
import { Switch } from "@repo/ui/switch";

import { useListLayout } from "~/lib/store";

export const SelectListLayout = () => {
	const listLayout = useListLayout((state) => state.list_layout);
	const setListLayout = useListLayout((state) => state.setListLayout);

	return (
		<div>
			<div className="relative inline-grid h-8 shrink-0 grid-cols-[1fr_1fr] items-center justify-center overflow-hidden whitespace-nowrap rounded-md border border-input bg-transparent p-px font-medium text-secondary-foreground text-sm shadow-xs outline-none transition-all hover:bg-secondary/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:hover:bg-input/50">
				<Switch
					id="list-layout-switch"
					checked={listLayout === "grid"}
					onCheckedChange={(checked) =>
						setListLayout(checked ? "grid" : "list")
					}
					className={cn("peer [&_span]:data-[state=checked]:rtl:-translate-x-full absolute inset-0 h-[inherit] w-auto rounded-md data-[state=checked]:bg-transparent data-[state=unchecked]:bg-transparent dark:data-[state=unchecked]:bg-transparent [&_span]:h-7 [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full",
						"data-[slot=switch-thumb]:bg-primary data-[state=checked]:[&_[data-slot=switch-thumb]]:bg-primary data-[state=unchecked]:[&_[data-slot=switch-thumb]]:bg-primary dark:data-[state=checked]:[&_[data-slot=switch-thumb]]:bg-primary dark:data-[state=unchecked]:[&_[data-slot=switch-thumb]]:bg-primary [&_span]:mb-0.5 [&_span]:rounded-sm")}
				/>
				<span className="pointer-events-none relative flex min-w-8 items-center justify-center text-center peer-data-[state=checked]:text-muted-foreground/70">
					<AlignJustify size={16} aria-hidden="true" />
				</span>
				<span className="pointer-events-none relative flex min-w-8 items-center justify-center text-center peer-data-[state=unchecked]:text-muted-foreground/70">
					<Grid2x2 size={16} aria-hidden="true" />
				</span>
			</div>
			<Label htmlFor="list-layout-switch" className="sr-only">
				Labeled switch
			</Label>
		</div>
	);
};

export const SelectListLayoutSkeleton = () => {
	return (
		<Skeleton className="h-8 w-[66px] rounded-md" />
	);
};
