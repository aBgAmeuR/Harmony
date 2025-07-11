"use client";

import { AlignJustify, Grid2x2 } from "lucide-react";

import { Label } from "@repo/ui/label";
import { Switch } from "@repo/ui/switch";

import { useListLayout } from "~/lib/store";

export const SelectListLayout = () => {
	const listLayout = useListLayout((state) => state.list_layout);
	const setListLayout = useListLayout((state) => state.setListLayout);

	return (
		<>
			{/* <div>
			<div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center font-medium text-sm">
				<Switch
					id="switch-12"
					checked={listLayout === "grid"}
					onCheckedChange={(checked) =>
						setListLayout(checked ? "grid" : "list")
					}
					className="peer rtl:data-[state=checked]:[&_span]:-translate-x-full absolute inset-0 h-[inherit] w-auto rounded-md *:rounded-md data-[state=checked]:bg-input/50 data-[state=unchecked]:bg-input/50 [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full"
				/>
				<span className="pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center peer-data-[state=checked]:text-muted-foreground/70 peer-data-[state=unchecked]:text-muted-foreground/70">
					<AlignJustify size={16} strokeWidth={2} aria-hidden="true" />
				</span>
				<span className="pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center peer-data-[state=unchecked]:text-muted-foreground/70">
					<Grid2x2 size={16} strokeWidth={2} aria-hidden="true" />
				</span>
			</div>
			<Label htmlFor="switch-12" className="sr-only">
				Labeled switch
			</Label>
		</div> */}

			<div>
				<div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center font-medium text-sm">
					<Switch
						id="switch-13"
						checked={listLayout === "grid"}
						onCheckedChange={(checked) =>
							setListLayout(checked ? "grid" : "list")
						}
						className="peer [&_span]:data-[state=checked]:rtl:-translate-x-full absolute inset-0 h-[inherit] w-auto data-[slot=switch-thumb]:bg-primary data-[state=checked]:bg-input/50 data-[state=unchecked]:bg-primary [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full"
					/>
					<span className="pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center peer-data-[state=checked]:text-muted-foreground/70">
						<AlignJustify size={16} aria-hidden="true" />
					</span>
					<span className="pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center peer-data-[state=unchecked]:text-muted-foreground/70">
						<Grid2x2 size={16} aria-hidden="true" />
					</span>
				</div>
				<Label htmlFor="switch-13" className="sr-only">
					Labeled switch
				</Label>
			</div>

			<Switch
				checked={listLayout === "grid"}
				onCheckedChange={(checked) => setListLayout(checked ? "grid" : "list")}
				className="dark:data-[slot=switch-thumb]:bg-primary-foreground!"
			/>
		</>
	);
};
