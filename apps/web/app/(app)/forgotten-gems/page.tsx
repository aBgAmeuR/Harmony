import { Suspense } from "react";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { ForgottenGems } from "~/features/forgotten-gems/components/forgotten-gems";

export default async function ForgottenGemsPage() {
    return (
        <Layout>
            <LayoutHeader items={["Advanced", "Forgotten Gems"]} />
            <LayoutContent className="mx-auto w-full max-w-screen-2xl pt-2">
                <Suspense fallback={null}>
                    <ForgottenGems />
                </Suspense>
            </LayoutContent>
        </Layout>

    );
} 