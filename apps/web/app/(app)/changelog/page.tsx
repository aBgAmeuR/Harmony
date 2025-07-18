
import Link from "next/link";
import { MDXRemote } from 'next-mdx-remote-client/rsc'

import { Badge } from "@repo/ui/badge";
import { Separator } from "@repo/ui/separator";

import { getAllChangelogEntries, getVersionBadgeVariant } from "~/lib/changelog";
import { getMDXComponents, } from "~/mdx-components";
import { config } from "~/lib/config";

export default function ChangelogPage() {
    const changelog = getAllChangelogEntries();

    return (
        <div className="container mx-auto max-w-2xl px-6 py-12">
            <div className="mb-12">
                <h1 className="mb-2 font-medium text-2xl">Changelog</h1>
                <p className="text-muted-foreground">
                    Product updates and improvements
                </p>
            </div>

            <div className="space-y-16">
                {changelog.map((entry, index) => (
                    <article key={entry.version}>
                        <header className="mb-6">
                            <div className="mb-3 flex items-center gap-4">
                                <Badge
                                    variant={getVersionBadgeVariant(entry.type)}
                                    className="font-mono text-xs"
                                >
                                    {entry.version}
                                </Badge>
                                <time
                                    dateTime={entry.date}
                                    className="font-mono text-muted-foreground text-sm"
                                >
                                    {new Date(entry.date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric"
                                    })}
                                </time>
                            </div>

                        </header>

                        <div className="prose-base prose-sm max-w-none prose-li:list-disc">
                            <MDXRemote source={entry.content} components={getMDXComponents({})} />
                        </div>

                        {index < changelog.length - 1 && (
                            <Separator className="mt-12" />
                        )}
                    </article>
                ))}
            </div>

            <div className="mt-16 border-t pt-8 text-center">
                <p className="text-muted-foreground text-sm">
                    Questions or feedback?{" "}
                    <Link href={config.githubRepo} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
                        Get in touch
                    </Link>
                </p>
            </div>
        </div>
    );
} 