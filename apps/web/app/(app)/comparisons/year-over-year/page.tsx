import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";

import { getUser } from "@repo/auth";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { getYearMetricsAction } from "~/features/comparisons/year-over-year/actions/year-metrics-action";
import { ComparisonYearOverYearContent, } from "~/features/comparisons/year-over-year/components/comparison-content";
import { YearSelector } from "~/features/comparisons/year-over-year/components/year-selector";
import { getAvailableYears } from "~/features/comparisons/year-over-year/data/available-years";
import { getQueryClient } from "~/lib/get-query-client";

export const metadata: Metadata = {
	title: "Year-over-Year Comparisons",
	description: "Compare your listening habits across years",
};

export default async function ComparisonsYearOverYearPage() {
	const { userId } = await getUser();
	const queryClient = getQueryClient();

	const availableYears = await getAvailableYears(userId);

	queryClient.prefetchQuery({
		queryKey: ["yearMetrics", new Date().getFullYear()],
		queryFn: () => getYearMetricsAction(new Date().getFullYear()),
	});
	queryClient.prefetchQuery({
		queryKey: ["yearMetrics", new Date().getFullYear() - 1],
		queryFn: () => getYearMetricsAction(new Date().getFullYear() - 1),
	});

	return (
		<Layout>
			<LayoutHeader items={["Advanced", "Comparisons", "Year-over-Year"]} metadata={metadata}>
				<YearSelector availableYears={availableYears} />
			</LayoutHeader>
			<LayoutContent>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<ComparisonYearOverYearContent />
				</HydrationBoundary>
			</LayoutContent>
		</Layout>
	);
}
