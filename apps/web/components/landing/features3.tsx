import { Card } from "@repo/ui/card";
import { Target, CalendarCheck, Sparkles } from "lucide-react";

export const Features3Section = () => {
    return (
        <section className="pt-16 md:pt-32">
            <div className="mx-auto w-full max-w-5xl px-6">
                <h2 className="text-foreground max-w-2xl text-balance text-4xl font-semibold">Powerful Music Analytics</h2>
                <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="group overflow-hidden px-6 pt-6 pb-0">
                        <h3 className="text-foreground mb-2 text-lg font-semibold">
                            Rankings
                        </h3>
                        <p className="text-muted-foreground mb-5 text-balance">See your top artists, tracks, and albums with custom time ranges.</p>

                        <div className="mask-b-from-50 -mx-2 -mt-2 px-2 pt-2">
                            <RankingsPreview />
                        </div>
                    </Card>

                    <Card className="group overflow-hidden px-6 pt-6">
                        <h3 className="text-foreground mb-2 text-lg font-semibold">
                            Advanced Statistics
                        </h3>
                        <p className="text-muted-foreground mb-5 text-balance">Dive into listening patterns, streaks, and percentile benchmarks.</p>

                        <div className="-mx-2 -mt-2 px-2 pt-2">
                            <AdvancedStatisticsPreview />
                        </div>
                    </Card>
                    <Card className="group overflow-hidden px-6 pt-6 pb-0">
                        <h3 className="text-foreground mb-2 text-lg font-semibold">
                            Comparisons
                        </h3>
                        <p className="text-muted-foreground mb-5 text-balance">Compare artists or years and discover how your music taste has transformed over time.</p>

                        <div className="mask-b-from-50 -mx-2 -mt-2 px-2 pt-2 h-full">
                            <AdvancedComparisons />
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}

const AdvancedComparisons = () => {
    return (
        <div className="rounded-t-lg border-t border-border/50 bg-background/80 p-4 shadow-lg h-full">
            <div className="space-y-2 font-mono text-xs">
                <div className="text-muted-foreground/60 mb-2">
                    {`compare(artist1, artist2)`}
                </div>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between rounded border border-green-500/20 bg-green-500/5 px-2 py-1">
                        <span className="text-green-400 text-[10px]">+</span>
                        <span className="text-muted-foreground flex-1 mx-2 truncate">The Weeknd</span>
                        <span className="text-green-400 text-[10px]">432h</span>
                    </div>
                    <div className="flex items-center justify-between rounded border border-red-500/20 bg-red-500/5 px-2 py-1">
                        <span className="text-red-400 text-[10px]">-</span>
                        <span className="text-muted-foreground flex-1 mx-2 truncate">Drake</span>
                        <span className="text-red-400 text-[10px]">387h</span>
                    </div>
                </div>
                <div className="mt-3 text-primary/80 text-[10px]">
                    {`> +45h difference`}
                </div>
            </div>
        </div>
    );
}

const RankingsPreview = () => {
    return (
        <div className="rounded-t-lg border-t border-border/50 bg-background/80 p-4 shadow-lg">
            <div className="space-y-2 font-mono text-xs">
                <div className="text-muted-foreground/60 mb-2">
                    {`rank(top, timeframe="6 months")`}
                </div>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between rounded border border-primary/20 bg-primary/5 px-2 py-1">
                        <span className="text-muted-foreground text-[10px]">#1</span>
                        <span className="text-muted-foreground flex-1 mx-2 truncate">Playboi Carti</span>
                        <span className="text-primary text-[10px]">518h</span>
                    </div>
                    <div className="flex items-center justify-between rounded border border-border/50 bg-background/60 px-2 py-1">
                        <span className="text-muted-foreground text-[10px]">#2</span>
                        <span className="text-muted-foreground flex-1 mx-2 truncate">Drake</span>
                        <span className="text-muted-foreground text-[10px]">472h</span>
                    </div>
                    <div className="flex items-center justify-between rounded border border-border/50 bg-background/60 px-2 py-1">
                        <span className="text-muted-foreground text-[10px]">#2</span>
                        <span className="text-muted-foreground flex-1 mx-2 truncate">Travis Scott</span>
                        <span className="text-muted-foreground text-[10px]">412h</span>
                    </div>
                </div>
                <div className="mt-3 text-primary/80 text-[10px]">
                    {`> 46h difference between #1 and #2`}
                </div>
            </div>
        </div>
    );
}

const AdvancedStatisticsPreview = () => {
    return (
        <div className="rounded-lg border-t border-border/50 bg-background/80 p-4 shadow-lg">
            <div className="space-y-2 font-mono text-xs">
                <div className="text-muted-foreground/60 mb-2">
                    {`stats(user)`}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                    <div className="rounded border border-border/50 bg-background/60 px-2 py-1 text-center">
                        <div className="text-muted-foreground text-[10px]">avg_session</div>
                        <div className="text-foreground text-[11px]">42m</div>
                    </div>
                    <div className="rounded border border-border/50 bg-background/60 px-2 py-1 text-center">
                        <div className="text-muted-foreground text-[10px]">days_active</div>
                        <div className="text-foreground text-[11px]">287</div>
                    </div>
                    <div className="rounded border border-border/50 bg-background/60 px-2 py-1 text-center">
                        <div className="text-muted-foreground text-[10px]">streak</div>
                        <div className="text-foreground text-[11px]">31d</div>
                    </div>
                </div>
                <div className="mt-3 text-primary/80 text-[10px]">
                    {`> 94th percentile listening habits`}
                </div>
            </div>
        </div>
    );
}