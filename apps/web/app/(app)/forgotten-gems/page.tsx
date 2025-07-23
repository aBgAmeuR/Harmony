

import { getUser } from "@repo/auth";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";

import { ForgottenGemsClient } from "./client";

export const metadata = {
    title: "Forgotten Gems",
    description: "Rediscover your favorite tracks that you haven't played in a while",
};


export default async function ForgottenGemsPage() {
    const { userId } = await getUser();

    return (
        <Layout>
            <LayoutHeader items={["Advanced", "Forgotten Gems"]} />
            <LayoutContent className="mx-auto w-full max-w-screen-2xl pt-2">
                <ForgottenGemsClient userId={userId} />
            </LayoutContent>
        </Layout>

    );
} 