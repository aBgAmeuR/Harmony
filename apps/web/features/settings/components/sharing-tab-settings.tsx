import { Suspense } from "react";
import { Share2Icon } from "lucide-react";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { LinkButton } from "@repo/ui/components/link-button";


import { CreateShareableLink } from "~/features/shareable-links/components/create-shareable-link";
import { ShareableLinksTable, ShareableLinksTableSkeleton } from "~/features/shareable-links/components/shareable-links-table";

export default function SharingTabSettings() {
    return (
        <div className="flex flex-col gap-4">
            <CardHeader>
                <CardTitle className="text-xl">Sharing & Links</CardTitle>
                <CardDescription>
                    Create and manage shareable links to your profile
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                    <h4 className="mb-2 font-medium text-sm">Need More Control?</h4>
                    <p className="mb-3 text-muted-foreground text-xs">
                        Visit the full sharing page to create links with custom expiration dates,
                        usage limits, and detailed analytics.
                    </p>
                    <LinkButton href="/social/shareable-links" size="sm" variant="outline">
                        Manage All Links
                    </LinkButton>
                </div>
            </CardContent>
        </div>
    );
}