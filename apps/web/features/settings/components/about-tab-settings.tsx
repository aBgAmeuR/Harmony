import { BookTextIcon, Github, InfoIcon } from "lucide-react";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { LinkButton } from "@repo/ui/components/link-button";

import { Icons } from "~/components/icons";
import { config } from "~/lib/config";

export default function AboutTabSettings() {
    return (
        <div className="flex flex-col gap-4">
            <CardHeader>
                <CardTitle className="text-xl">About Harmony</CardTitle>
                <CardDescription>
                    Learn more about the app and stay updated with the latest changes
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-4 rounded-lg border border-input p-4">
                    <div className="flex items-start gap-3">
                        <div className="rounded-md bg-primary/10 p-2">
                            <InfoIcon className="size-4 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-sm">App Information</h3>
                            <p className="mt-1 text-muted-foreground text-xs">
                                Learn about Harmony, its features, and privacy policy
                            </p>
                        </div>
                    </div>
                    <LinkButton href="/settings/about" size="sm" variant="outline">
                        Learn More
                    </LinkButton>
                </div>

                <div className="flex items-center justify-between space-x-4 rounded-lg border border-input p-4">
                    <div className="flex items-start gap-3">
                        <div className="rounded-md bg-primary/10 p-2">
                            <BookTextIcon className="size-4 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-sm">Changelog</h3>
                            <p className="mt-1 text-muted-foreground text-xs">
                                See what's new and what's been improved in recent updates
                            </p>
                        </div>
                    </div>
                    <LinkButton href="/changelog" size="sm" variant="outline">
                        View Changes
                    </LinkButton>
                </div>

                <div className="rounded-lg border border-muted-foreground/25 border-dashed p-4">
                    <div className="mb-3 flex items-center gap-3">
                        <Icons.logo className="size-8" />
                        <div>
                            <h4 className="font-medium text-sm">{config.appName}</h4>
                            <p className="text-muted-foreground text-xs">
                                Open-source Spotify analytics
                            </p>
                        </div>
                    </div>
                    <p className="mb-3 text-muted-foreground text-xs">
                        Transform your Spotify listening data into meaningful insights about
                        your music preferences and habits.
                    </p>
                    <div className="flex gap-2">
                        <LinkButton
                            href={config.githubRepo}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                            variant="outline"
                        >
                            <Github className="size-4" />
                            GitHub
                        </LinkButton>
                        <LinkButton
                            href="https://spotify.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                            variant="outline"
                        >
                            <Icons.spotify className="size-4" />
                            Spotify
                        </LinkButton>
                    </div>
                </div>
            </CardContent>
        </div>
    );
}