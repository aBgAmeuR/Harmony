import { getUser } from "@repo/auth";
import { Skeleton } from "@repo/ui/skeleton";

import { getTimeRangeData } from "../data/time-range";
import { TimeRangeSelectClient } from "./time-range-select-client";

export const TimeRangeSelect = async () => {
	const { userId, isDemo } = await getUser();

	const timeRange = await getTimeRangeData(userId, isDemo);

	return <TimeRangeSelectClient timeRange={timeRange} isDemo={isDemo} />;
};

export const TimeRangeSelectSkeleton = () => {
	return <Skeleton className="h-8 w-[150px] rounded-md" />;
};
