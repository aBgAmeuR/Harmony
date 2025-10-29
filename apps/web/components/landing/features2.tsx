import { Cpu, Lock, Sparkles, Zap } from "lucide-react";
import Image from "next/image";

export const Features2 = () => {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-12 px-6">
                <div className="relative z-10 grid items-center gap-4 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl font-semibold md:max-w-md">Dive deep into your music details</h2>
                    <p className="max-w-sm md:ml-auto">Explore comprehensive insights about your albums, artists, and listening patterns with rich visualizations and detailed analytics.</p>
                </div>
                <div className="lg:-mx-8">
                    <div className="aspect-88/36 mask-b-from-75% mask-b-to-95% relative">
                        <div className="overflow-hidden rounded-2xl border-border border">
                            <Image
                                src="/images/album-details-dark.png"
                                className="hidden dark:block"
                                alt="Album details dark"
                                width={1294}
                                height={670}
                            />
                        </div>
                    </div>
                </div>
                <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4" />
                            <h3 className="text-sm font-medium">Instant Insights</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Get immediate access to detailed album and artist information with lightning-fast data retrieval.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4" />
                            <h3 className="text-sm font-medium">Comprehensive Data</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Access complete metadata including release dates, and track listings.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Lock className="size-4" />
                            <h3 className="text-sm font-medium">Privacy First</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Your listening data stays secure while providing deep insights into your music preferences.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4" />
                            <h3 className="text-sm font-medium">Smart Analytics</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Advanced algorithms help you discover new music based on your listening habits.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};