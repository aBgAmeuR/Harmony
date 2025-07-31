import { Suspense } from "react";
import type { Metadata } from "next";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { ComparisonContent, ComparisonContentSkeleton } from "~/features/comparisons/year-over-year/components/comparison-content";
import { YearSelector } from "~/features/comparisons/year-over-year/components/year-selector";

export const metadata: Metadata = {
	title: "Year-over-Year Comparisons",
	description: "Compare your listening habits across years",
};

export default async function ComparisonsYearOverYearPage() {
	return (
		<Layout>
			<LayoutHeader items={["Advanced", "Comparisons", "Year-over-Year"]} metadata={metadata}>
				<YearSelector />
			</LayoutHeader>
			<LayoutContent>
				<Suspense fallback={<ComparisonContentSkeleton />}>
					<ComparisonContent />
				</Suspense>
			</LayoutContent>
		</Layout>
	);
}
