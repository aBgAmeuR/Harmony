import { Suspense } from "react";
import type { Metadata } from "next";
import { createLoader, parseAsInteger } from 'nuqs/server';

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { ComparisonContent } from "~/features/comparisons/year-over-year/components/comparison-content";
import { YearSelector } from "~/features/comparisons/year-over-year/components/year-selector";

export const metadata: Metadata = {
	title: "Year-over-Year Comparisons",
	description: "Compare your listening habits across years",
};

export const yearSearchParams = {
	year1: parseAsInteger,
	year2: parseAsInteger
}

export const loadSearchParams = createLoader(yearSearchParams)

export default async function ComparisonsYearOverYearPage({ searchParams }: { searchParams: Promise<{ year1?: string; year2?: string }> }) {
	const { year1, year2 } = await loadSearchParams(searchParams);

	// if (availableYears.length < 2) {
	// 	return (
	// 		<Layout>
	// 			<LayoutHeader items={["Advanced", "Comparisons", "Year-over-Year"]} metadata={metadata} />
	// 			<LayoutContent className="flex flex-col items-center justify-center">
	// 				<p className="max-w-md text-center text-muted-foreground">
	// 					You need at least 2 years of data to use this feature. Please import more data from Spotify.
	// 				</p>
	// 			</LayoutContent>
	// 		</Layout>
	// 	);
	// }

	return (
		<Layout>
			<LayoutHeader items={["Advanced", "Comparisons", "Year-over-Year"]} metadata={metadata}>
				<YearSelector />
			</LayoutHeader>
			<LayoutContent>
				<Suspense fallback={<div>Loading comparison...</div>}>
					<ComparisonContent year1={year1} year2={year2} />
				</Suspense>
			</LayoutContent>
		</Layout>
	);
}
