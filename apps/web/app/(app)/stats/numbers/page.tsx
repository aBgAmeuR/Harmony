import React, { Suspense } from "react";

import { AppHeader } from "~/components/app-header";
import { SelectMonthRange } from "~/components/select-month-range";

import { NumbersStatsCards, NumbersStatsSkeleton } from "./numbers-stats-cards";
import {
	NumbersStatsSessionCard,
	NumbersStatsSessionSkeleton,
} from "./numbers-stats-sessions-card";

export default function StatsNumbersPage() {
	return (
		<>
			<AppHeader items={["Package", "Stats", "Numbers"]}>
				<SelectMonthRange />
			</AppHeader>
			<div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4">
				<Suspense fallback={<NumbersStatsSessionSkeleton />}>
					<NumbersStatsSessionCard />
				</Suspense>
				<Suspense fallback={<NumbersStatsSkeleton />}>
					<NumbersStatsCards />
				</Suspense>
			</div>
		</>
	);
}
