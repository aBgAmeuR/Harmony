import { EyeIcon, LogOutIcon, UserIcon } from "lucide-react";

import { getUser } from "@repo/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { LinkButton } from "@repo/ui/components/link-button";
import { Separator } from "@repo/ui/separator";

import { Icons } from "~/components/icons";

import { PrivacySettingsClient } from "./privacy-settings-client";
import { SettingsTabContent, SettingsTabHeader, SettingsTabLayout } from "./settings-tab-layout";

export default async function AccountTabSettings() {
    const { username, email, image, isDemo } = await getUser();

    return (
        <SettingsTabLayout>
            <SettingsTabHeader title="Account & Privacy" description="Manage your account information, privacy settings, and preferences" />
            <SettingsTabContent className="gap-4">
                <div className="flex items-center gap-2">
                    <UserIcon className="size-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Profile Information</h3>
                </div>
                <div className="flex items-center space-x-4 rounded-lg border border-input p-4">
                    <Avatar className="size-12">
                        <AvatarImage src={image || ""} alt={username || ""} />
                        <AvatarFallback>
                            {isDemo ? (
                                <Icons.logo className="size-6" />
                            ) : (
                                <UserIcon className="size-6" />
                            )}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h4 className="font-medium text-sm">
                            {username || "Anonymous User"}
                        </h4>
                        <p className="text-muted-foreground text-xs">
                            {email || "No email provided"}
                        </p>
                        {isDemo && (
                            <span className="mt-1 inline-flex items-center rounded-md bg-amber-50 px-2 py-1 font-medium text-amber-700 text-xs ring-1 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20">
                                Demo Account
                            </span>
                        )}
                    </div>
                </div>

                {isDemo && (
                    <div className="rounded-lg border border-amber-200 border-dashed bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                        <h4 className="mb-2 font-medium text-amber-800 text-sm dark:text-amber-200">
                            Switch to Your Account
                        </h4>
                        <p className="mb-3 text-amber-700 text-xs dark:text-amber-300">
                            You're currently using a demo account. Sign in with your Spotify account
                            to access your personal listening data and unlock all features.
                        </p>
                        <LinkButton href="/signin" size="sm">
                            Sign In with Spotify
                        </LinkButton>
                    </div>
                )}
            </SettingsTabContent>

            <Separator />

            <SettingsTabContent className="gap-4">
                <div className="flex items-center gap-2">
                    <EyeIcon className="size-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Privacy Settings</h3>
                </div>
                <PrivacySettingsClient />
            </SettingsTabContent>

            {!isDemo && (
                <>
                    <Separator />

                    <SettingsTabContent className="gap-4">
                        <div className="flex items-center gap-2">
                            <LogOutIcon className="size-4 text-muted-foreground" />
                            <h3 className="font-semibold text-sm">Account Actions</h3>
                        </div>
                        <div className="rounded-lg border border-muted-foreground/25 border-dashed p-4">
                            <h4 className="mb-2 font-medium text-sm">Manage Account</h4>
                            <p className="mb-3 text-muted-foreground text-xs">
                                Control your account settings and session.
                            </p>
                            <div className="flex gap-2">
                                <LinkButton href="/signout" size="sm" variant="outline">
                                    <LogOutIcon className="size-4" />
                                    Sign Out
                                </LinkButton>
                            </div>
                        </div>

                        <div className="rounded-lg border border-red-200 border-dashed bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                            <h4 className="mb-2 font-medium text-red-800 text-sm dark:text-red-200">
                                Data & Privacy Information
                            </h4>
                            <p className="text-red-700 text-xs dark:text-red-300">
                                Your data is stored securely and is only used to generate your personal
                                music insights. We never share your data with third parties.
                            </p>
                        </div>
                    </SettingsTabContent>
                </>
            )}
        </SettingsTabLayout >
    );
}