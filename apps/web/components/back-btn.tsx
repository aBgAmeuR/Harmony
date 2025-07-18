"use client";

import type { ButtonHTMLAttributes } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/tooltip";

interface BackBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string;
	label?: string;
}

export const BackBtn = ({ className, label = "Back", ...props }: BackBtnProps) => {
	const router = useRouter();
	const path = useSearchParams().get("back");
	if (!path) return null;
	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => router.push(path)}
						aria-label={label}
						className={cn(
							"group flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-accent/60 hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2",
							className
						)}
						{...props}
					>
						<ArrowLeftIcon
							className="-ms-1 group-hover:-translate-x-px opacity-60 transition-transform duration-150 group-hover:opacity-80"
							size={16}
							aria-hidden="true"
						/>
						<span className="ml-0.5 font-medium text-sm">{label}</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom" className="text-xs">
					Back to previous page
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
