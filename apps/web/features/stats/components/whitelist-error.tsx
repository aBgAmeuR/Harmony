

import { AlertCircle, Github } from "lucide-react";

import { LinkButton } from "@repo/ui/components/link-button";
import { Separator } from "@repo/ui/separator";

export const WhitelistError = () => {
    return (
        <div className="flex flex-1 items-center justify-center p-4">
            <div className="w-full max-w-lg space-y-4 text-center">
                <div className="flex justify-center">
                    <div className="flex size-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
                        <AlertCircle className="size-8 text-red-500 dark:text-red-400" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="font-semibold text-2xl text-foreground">Access Restricted</h1>
                    <p className="text-muted-foreground leading-relaxed">
                        You need to be added to our Spotify development whitelist to use this application.
                    </p>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4 text-left">
                    <h2 className="font-medium text-foreground text-lg">How to get access:</h2>

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <span className="flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-sm">
                                1
                            </span>
                            <p className="text-foreground">Create a GitHub issue using the button below</p>
                        </div>

                        <div className="flex gap-4">
                            <span className="flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-sm">
                                2
                            </span>
                            <p className="text-foreground">Include your Spotify account email address</p>
                        </div>

                        <div className="flex gap-4">
                            <span className="flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-sm">
                                3
                            </span>
                            <p className="text-foreground">Wait 24-48 hours for approval, then try signing in again</p>
                        </div>
                    </div>
                </div>

                <Separator className="my-6" />

                <LinkButton
                    href="https://github.com/aBgAmeuR/Harmony/issues/new?template=whitelist-request.md&title=Spotify%20Whitelist%20Request&body=Please%20add%20me%20to%20the%20Spotify%20developer%20whitelist.%20My%20Spotify%20username/email%20is:%20&labels=whitelist"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Github className="size-4" />
                    Request Access on GitHub
                </LinkButton>

                <p className="text-muted-foreground text-sm leading-relaxed">
                    This restriction only applies during development. Once published, all Spotify users will have access.
                </p>
            </div>
        </div>
    );
}; 