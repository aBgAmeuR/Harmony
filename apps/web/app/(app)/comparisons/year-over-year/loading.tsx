import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { ComparisonContentSkeleton } from "~/features/comparisons/year-over-year/components/comparison-content";
import { YearSelectorSkeleton } from "~/features/comparisons/year-over-year/components/year-selector";

import { metadata } from "./page";

export { metadata };

export default async function Loading() {
    return (
        <Layout>
            <LayoutHeader items={["Advanced", "Comparisons", "Year-over-Year"]} demo={false} metadata={metadata}>
                <YearSelectorSkeleton />
            </LayoutHeader>
            <LayoutContent>
                <ComparisonContentSkeleton />
            </LayoutContent>
        </Layout>
    );
}
