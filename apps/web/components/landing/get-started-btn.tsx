import type { PropsWithChildren } from "react";
import { TriangleAlert } from "lucide-react";

import { Button, type buttonVariants } from "@repo/ui/button";
import { LinkButton } from "@repo/ui/components/link-button";
import { cn, type VariantProps } from "@repo/ui/lib/utils";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@repo/ui/tooltip";

import { Icons } from "../icons";

type GetStartedBtnProps = PropsWithChildren<{
	className?: string;
}> &
	VariantProps<typeof buttonVariants>;

export const GetStartedBtn = ({ ...props }: GetStartedBtnProps) => {
	const isMaintenance = process.env.APP_MAINTENANCE === "true";

	if (isMaintenance) {
		return (
			<TooltipProvider delayDuration={0}>
				<Tooltip>
					<TooltipTrigger className="cursor-not-allowed" asChild={true}>
						<span tabIndex={0}>
							<Button
								aria-label="Get Started"
								data-testid="get-started-btn"
								disabled={true}
								{...props}
							>
								<Icons.spotify />
								{props.children}
							</Button>
						</span>
					</TooltipTrigger>
					<TooltipContent className="py-3">
						<div className="flex gap-3">
							<TriangleAlert
								className="mt-0.5 shrink-0 text-red-400 opacity-60 dark:text-red-600"
								size={16}
								strokeWidth={2}
								aria-hidden="true"
							/>
							<div className="space-y-1">
								<p className="font-medium text-[13px]">
									Application is under maintenance
								</p>
								<p className="text-muted-foreground text-xs">
									Please try again later.
								</p>
							</div>
						</div>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return (
		<LinkButton
			href="/overview"
			prefetch={false}
			className={cn(
				"bg-foreground text-secondary hover:bg-foreground/90",
				props.className,
			)}
			aria-label="Get Started"
			data-testid="get-started-btn"
			{...props}
		>
			<Icons.spotify />
			{props.children}
		</LinkButton>
	);
};
