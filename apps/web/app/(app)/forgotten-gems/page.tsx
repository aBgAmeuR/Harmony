import { QueryClient } from "@tanstack/react-query";

import { getUser } from "@repo/auth";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { getAvailableYears, getForgottenGems } from "~/features/forgotten-gems/data/forgotten-gems-service";

import { ForgottenGemsClient } from "./client";

export const metadata = {
    title: "Forgotten Gems",
    description: "Rediscover your favorite tracks that you haven't played in a while",
};


export default async function ForgottenGemsPage() {
    const { userId } = await getUser();
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({ queryKey: ['available-years', userId], queryFn: () => getAvailableYears(userId) })
    await queryClient.prefetchQuery({ queryKey: ['forgotten-gems', userId, undefined, undefined], queryFn: () => getForgottenGems(userId, {}) })

    return (
        <Layout>
            <LayoutHeader items={["Advanced", "Forgotten Gems"]} />
            <LayoutContent className="mx-auto w-full max-w-screen-2xl pt-2">
                <ForgottenGemsClient userId={userId} />
            </LayoutContent>
        </Layout>

    );
} 