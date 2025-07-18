import { Skeleton } from "@repo/ui/skeleton";

import { getUserInfos } from "~/lib/utils-server";

import { getDateRange, getMinMaxDateRange } from "./date-range";
import { DateRangeSelectorClient } from "./date-range-selector-client";

export const DateRangeSelector = async () => {
	const { userId, isDemo } = await getUserInfos();

	const [dateRange, minMaxDateRange] = await Promise.all([
		getDateRange(userId, isDemo),
		getMinMaxDateRange(userId),
	]);

	return (
		<DateRangeSelectorClient
			dateRange={dateRange}
			minMaxDateRange={minMaxDateRange ?? undefined}
			isDemo={isDemo}
		/>
	);
};

export const DateRangeSelectorSkeleton = () => {
	return <Skeleton className="h-8 w-[180px] rounded-md sm:w-[220px]" />;
};
