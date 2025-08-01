import { PackageIcon, UploadIcon } from "lucide-react";

import { getUser } from "@repo/auth";
import { LinkButton } from "@repo/ui/components/link-button";

import { SettingsTabContent, SettingsTabHeader, SettingsTabLayout } from "./settings-tab-layout";

export default async function DataPackageTabSettings() {
    const { hasPackage, isDemo } = await getUser();

    return (
        <SettingsTabLayout>
            <SettingsTabHeader title="Spotify Data Package" description="Manage your Spotify data package to generate detailed listening statistics" />
            <SettingsTabContent className="gap-4">
                <div className="flex items-center justify-between space-x-4 rounded-lg border border-input p-4">
                    <div className="flex items-start gap-3">
                        <div className="rounded-md bg-primary/10 p-2">
                            <PackageIcon className="size-4 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-sm">Package Status</h3>
                            <p className="mt-1 text-muted-foreground text-xs">
                                {hasPackage
                                    ? "Your Spotify data package has been uploaded and processed successfully"
                                    : "No data package uploaded yet"
                                }
                            </p>
                            {hasPackage && (
                                <div className="mt-2">
                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 font-medium text-green-700 text-xs ring-1 ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/20">
                                        ✓ Active
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <LinkButton
                            href="/settings/package"
                            variant={hasPackage ? "outline" : "default"}
                            size="sm"
                        >
                            <UploadIcon className="size-4" />
                            {hasPackage ? "Re-upload" : "Upload Package"}
                        </LinkButton>
                    </div>
                </div>

                {!hasPackage && !isDemo && (
                    <div className="rounded-lg border border-muted-foreground/25 border-dashed p-4">
                        <h4 className="mb-2 font-medium text-sm">Get Started</h4>
                        <p className="mb-3 text-muted-foreground text-xs">
                            To unlock all features and get detailed insights into your listening habits,
                            you'll need to upload your Spotify data package.
                        </p>
                        <LinkButton href="/settings/package" size="sm" variant="outline">
                            Learn How to Get Your Data
                        </LinkButton>
                    </div>
                )}

                {isDemo && (
                    <div className="rounded-lg border border-amber-200 border-dashed bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                        <h4 className="mb-2 font-medium text-amber-800 text-sm dark:text-amber-200">Demo Mode</h4>
                        <p className="text-amber-700 text-xs dark:text-amber-300">
                            You're currently using demo data. To use your own Spotify data,
                            sign in with your Spotify account and upload your data package.
                        </p>
                    </div>
                )}
            </SettingsTabContent>
        </SettingsTabLayout>
    );
}