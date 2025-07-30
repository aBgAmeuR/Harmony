import { Suspense } from "react";
import type { Metadata } from "next";

import { getUser } from "@repo/auth";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { ComparisonContent } from "~/features/comparisons/year-over-year/components/comparison-content";
import { YearSelector } from "~/features/comparisons/year-over-year/components/year-selector";

export const metadata: Metadata = {
	title: "Year-over-Year Comparisons",
	description: "Compare your listening habits across years",
};

export default async function ComparisonsYearOverYearPage() {
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
					<ComparisonContent />
				</Suspense>
			</LayoutContent>
		</Layout>
	);
}
