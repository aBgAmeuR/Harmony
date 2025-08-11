import { Suspense } from "react";
import { Share2Icon } from "lucide-react";

import { LinkButton } from "@repo/ui/components/link-button";

import { CreateShareableLink } from "~/features/shareable-links/components/create-shareable-link";
import { ShareableLinksTable, ShareableLinksTableSkeleton } from "~/features/shareable-links/components/shareable-links-table";

import { SettingsTabContent, SettingsTabHeader, SettingsTabLayout } from "./settings-tab-layout";

export default function SharingTabSettings() {
    return (
        <SettingsTabLayout>
            <SettingsTabHeader title="Sharing & Links" description="Create and manage shareable links to your profile" />
            <SettingsTabContent className="gap-4">
                <div className="flex items-center justify-between space-x-4 rounded-lg border border-input p-4">
                    <div className="flex items-start gap-3">
                        <div className="rounded-md bg-primary/10 p-2">
                            <Share2Icon className="size-4 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-sm">Shareable Profile Links</h3>
                            <p className="mt-1 text-muted-foreground text-xs">
                                Generate secure links to share your music profile with friends and family
                            </p>
                        </div>
                    </div>
                    <CreateShareableLink />
                </div>

                <div className="space-y-4">
                    <h4 className="font-medium text-sm">Active Links</h4>
                    <Suspense fallback={<ShareableLinksTableSkeleton />}>
                        <ShareableLinksTable />
                    </Suspense>
                </div>

                <div className="rounded-lg border border-muted-foreground/25 border-dashed p-4">
                    <h4 className="mb-2 font-medium text-sm">Documentation</h4>
                    <p className="mb-3 text-muted-foreground text-xs">
                        Read the documentation to learn how to create links with custom expiration dates,
                        usage limits, and detailed analytics.
                    </p>
                    <LinkButton
                        href="/docs/share-links"
                        size="sm"
                        variant="outline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View Docs
                    </LinkButton>
                </div>
            </SettingsTabContent>
        </SettingsTabLayout>
    );
}