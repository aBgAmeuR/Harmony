import { InfoIcon, PackageIcon, PaletteIcon, Share2Icon, UserIcon } from "lucide-react";
import type { Metadata } from "next";

import { getUser } from "@repo/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import AboutTabSettings from "~/features/settings/components/about-tab-settings";
import AccountTabSettings from "~/features/settings/components/account-tab-settings";
import AppearanceTabSettings from "~/features/settings/components/appearance-tab-settings";
import DataPackageTabSettings from "~/features/settings/components/data-package-tab-settings";
import SharingTabSettings from "~/features/settings/components/sharing-tab-settings";

export const metadata: Metadata = {
    title: "Settings",
    description: "Customize your Harmony experience and manage your preferences",
};

const tabs = [
    // {
    //     label: "Computation",
    //     value: "computation",
    //     icon: <SettingsIcon className="size-4" />,
    //     content: <ComputationTabSettings />
    // },
    {
        label: "Data Package",
        value: "data-package",
        icon: <PackageIcon className="size-4" />,
        content: <DataPackageTabSettings />,
        showDemo: true
    },
    {
        label: "Appearance",
        value: "appearance",
        icon: <PaletteIcon className="size-4" />,
        content: <AppearanceTabSettings />,
        showDemo: true
    },
    {
        label: "Sharing",
        value: "sharing",
        icon: <Share2Icon className="size-4" />,
        content: <SharingTabSettings />,
        showDemo: false
    },
    {
        label: "Account",
        value: "account",
        icon: <UserIcon className="size-4" />,
        content: <AccountTabSettings />,
        showDemo: true
    },
    {
        label: "About",
        value: "about",
        icon: <InfoIcon className="size-4" />,
        content: <AboutTabSettings />,
        showDemo: true
    },
] as const;

export default async function SettingsPage() {
    const { isDemo } = await getUser();

    const filteredTabs = tabs.filter((tab) => isDemo ? tab.showDemo : true);

    return (
        <Layout>
            <LayoutHeader items={["Settings"]} metadata={metadata} className="max-w-screen-xl" />
            <LayoutContent className="max-w-screen-xl">
                <Tabs
                    defaultValue={filteredTabs[0].value}
                    orientation="vertical"
                    className="w-full flex-col gap-6 md:flex-row md:gap-0"
                >
                    {/* Mobile: Horizontal scrollable tabs */}
                    <TabsList className="flex w-full flex-row justify-start gap-1 overflow-x-auto bg-transparent py-0 md:hidden">
                        {filteredTabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="flex-shrink-0 justify-center gap-2 px-3 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none"
                            >
                                {tab.icon}
                                <span className="hidden sm:inline">{tab.label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Desktop: Vertical sidebar */}
                    <TabsList className="hidden w-40 flex-col justify-start gap-1 bg-transparent py-0 md:flex">
                        {filteredTabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="w-full justify-start gap-2 data-[state=active]:bg-muted data-[state=active]:shadow-none"
                            >
                                {tab.icon}
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="min-w-0 flex-1 text-start">
                        {filteredTabs.map((tab) => (
                            <TabsContent key={tab.value} value={tab.value} className="mt-0">
                                {tab.content}
                            </TabsContent>
                        ))}
                    </div>
                </Tabs>
            </LayoutContent>
        </Layout>
    );
}
