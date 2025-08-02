'use client'

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Label } from "@repo/ui/label";
import { Switch } from "@repo/ui/switch";

import { useUserPreferences } from "~/lib/store";

export function PrivacySettingsClient() {
    const { showEmail, setShowEmail } = useUserPreferences();

    return (
        <div className="rounded-lg border border-input p-4">
            <div className="flex items-center justify-between space-x-4">
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
                            Display your email address in your profile
                        </p>
                    </div>
                </div>
                <Switch
                    id="show-email"
                    checked={showEmail}
                    onCheckedChange={setShowEmail}
                />
            </div>
        </div>
    );
}