import { Suspense } from "react";
import type { Metadata } from "next";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";

import type { ComparisonConfig } from "../types";
import { ComparisonContentSkeleton } from "./comparison-content";

interface ComparisonLayoutProps {
    metadata: Metadata;
    config: ComparisonConfig;
    selector: React.ReactNode;
    children: React.ReactNode;
    topItemsComponent?: React.ReactNode;
}

export function ComparisonLayout({
    metadata,
    config,
    selector,
    children,
    topItemsComponent
}: ComparisonLayoutProps) {
    const breadcrumbItems = [
        "Advanced",
        "Comparisons",
        config.type === 'year-over-year' ? "Year-over-Year" : "Artist vs Artist"
    ];

    return (
        <Layout>
            <LayoutHeader items={breadcrumbItems} metadata={metadata}>
                {selector}
            </LayoutHeader>
            <LayoutContent>
                <Suspense fallback={<ComparisonContentSkeleton config={config} topItemsComponent={topItemsComponent} />}>
                    {children}
                </Suspense>
            </LayoutContent>
        </Layout>
    );
}