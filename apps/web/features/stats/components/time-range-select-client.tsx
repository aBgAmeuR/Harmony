"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTopLoader } from "nextjs-toploader";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/select";
import { toast } from "@repo/ui/sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/tooltip";

import { setTimeRangeAction } from "../actions/time-range-action";
import type { TimeRange } from "../types/time-range";

const SELECT_OPTIONS = [
	{ label: "Short Term", value: "short_term" },
	{ label: "Medium Term", value: "medium_term" },
	{ label: "Long Term", value: "long_term" },
] as const;

type TimeRangeSelectClientProps = {
	timeRange: TimeRange;
	isDemo: boolean;
};

export const TimeRangeSelectClient = ({
	timeRange,
	isDemo,
}: TimeRangeSelectClientProps) => {
	const loader = useTopLoader();
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: async (newTimeRange: TimeRange) =>
			await setTimeRangeAction(newTimeRange),
		onError: () =>
			toast.error("Failed to update time range, please try again later"),
		onMutate: () => loader.start(),
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["historical-rankings"] });
			loader.done();
		},
	});

	if (isDemo) return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild={true}>
					<span tabIndex={0}>
						<Select disabled={true}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select time range" />
							</SelectTrigger>
							<SelectContent>
								{SELECT_OPTIONS.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</span>
				</TooltipTrigger>
				<TooltipContent>
					<p>This feature is not available in demo mode</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);

	return (
		<Select value={timeRange} onValueChange={mutate} disabled={isPending}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select time range" />
			</SelectTrigger>
			<SelectContent>
				{SELECT_OPTIONS.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
