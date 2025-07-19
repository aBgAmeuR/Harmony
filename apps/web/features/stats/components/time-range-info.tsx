
import { Info } from "lucide-react";

import { Button } from "@repo/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@repo/ui/tooltip";

export const TimeRangeInfo = () => {
	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip>
				<TooltipTrigger asChild={true}>
					<Button variant="ghost" size="icon" className="size-8">
						<Info />
					</Button>
				</TooltipTrigger>
				<TooltipContent className="py-3">
					<div className="space-y-1">
						<p className="font-medium text-[13px]">Time Range Definitions</p>
						<ul className="text-muted-foreground text-xs">
							<li>
								<span className="font-mono">Long Term</span> : ~1 year of data
							</li>
							<li>
								<span className="font-mono">Medium Term</span> : last 6 months
							</li>
							<li>
								<span className="font-mono">Short Term</span> : last 4 weeks
							</li>
						</ul>
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
