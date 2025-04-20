import { Button, type buttonVariants } from "@repo/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@repo/ui/tooltip";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import type { PropsWithChildren } from "react";

import type { VariantProps } from "@repo/ui/lib/utils";
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
								className={props.className}
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
		<Button
			className={props.className}
			aria-label="Get Started"
			data-testid="get-started-btn"
			asChild={true}
			{...props}
		>
			<Link href="/overview">
				<Icons.spotify />
				{props.children}
			</Link>
		</Button>
	);
};

/*
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            W/ icon
          </Button>
        </TooltipTrigger>
        <TooltipContent className="dark py-3">
          <div className="flex gap-3">
            <Globe
              className="mt-0.5 shrink-0 opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            <div className="space-y-1">
              <p className="text-[13px] font-medium">Tooltip with title and icon</p>
              <p className="text-xs text-muted-foreground">
                Tooltips are made to be highly customizable, with features like dynamic placement,
                rich content, and a robust API.
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
*/
