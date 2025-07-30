'use client'

import { EyeIcon, EyeOffIcon, ShieldIcon } from "lucide-react";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Label } from "@repo/ui/label";
import { Switch } from "@repo/ui/switch";

import { useUserPreferences } from "~/lib/store";

export default function PrivacyTabSettings() {
    const { showEmail, setShowEmail } = useUserPreferences();

    return (
        <div className="flex flex-col gap-4">
            <CardHeader>
                <CardTitle className="text-xl">Privacy Settings</CardTitle>
                <CardDescription>
                    Control what information is visible to others
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-4 rounded-lg border border-input p-4">
                    <div className="flex items-start gap-3">
                        <div className="rounded-md bg-primary/10 p-2">
                            {showEmail ? (
                                <EyeIcon className="size-4 text-primary" />
                            ) : (
                                <EyeOffIcon className="size-4 text-primary" />
                            )}
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="show-email" className="font-medium text-sm">
                                Show Email Address
                            </Label>
                            <p className="mt-1 text-muted-foreground text-xs">
                                Display your email address in your profile and shareable links
                            </p>
                        </div>
                    </div>
                    <Switch
                        id="show-email"
                        checked={showEmail}
                        onCheckedChange={setShowEmail}
                    />
                </div>

                <div className="rounded-lg border border-muted-foreground/25 border-dashed p-4">
                    <div className="mb-2 flex items-center gap-2">
                        <ShieldIcon className="size-4 text-muted-foreground" />
                        <span className="font-medium text-muted-foreground text-sm">Privacy Note</span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                        Your listening data is always private and secure. These settings only affect what information
                        is shown when you share your profile with others through shareable links.
                    </p>
                </div>
            </CardContent>
        </div>
    );
}