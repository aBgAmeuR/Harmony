import { Suspense } from "react";
import type { Metadata } from "next";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { CreateShareableLink } from "~/features/shareable-links/components/create-shareable-link";
import { ShareableLinksTable, ShareableLinksTableSkeleton } from "~/features/shareable-links/components/shareable-links-table";

export const metadata: Metadata = {
    title: "Shareable Links",
    description: "Share your profile with your friends",
};

export default async function ShareableLinksPage() {
    return (
        <Layout>
            <LayoutHeader items={["Social", "Shareable Links"]} metadata={metadata}>
                <CreateShareableLink />
            </LayoutHeader>
            <LayoutContent>
                <Suspense fallback={<ShareableLinksTableSkeleton />}>
                    <ShareableLinksTable />
                </Suspense>
            </LayoutContent>
        </Layout>
    );
}
