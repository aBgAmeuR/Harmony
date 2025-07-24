import { Suspense } from "react";
import type { Metadata } from "next";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { ForgottenGems, ForgottenGemsSkeleton } from "~/features/forgotten-gems/components/forgotten-gems";

export const metadata: Metadata = {
    title: "Forgotten Gems",
    description: "Rediscover tracks you loved but haven't played recently",
};

export default async function ForgottenGemsPage() {
    return (
        <Layout>
            <LayoutHeader items={["Advanced", "Forgotten Gems"]} />
            <LayoutContent className="pt-2">
                <Suspense fallback={<ForgottenGemsSkeleton />}>
                    <ForgottenGems />
                </Suspense>
            </LayoutContent>
        </Layout>

    );
} 