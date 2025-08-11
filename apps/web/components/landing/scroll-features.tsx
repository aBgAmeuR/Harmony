"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { BarChart3, Calendar, Clock, type LucideIcon, Search, Share2, Star, TrendingUp } from "lucide-react";
import { useScroll, useSpring } from "motion/react";

import { Card } from "@repo/ui/card";
import { cn } from "@repo/ui/lib/utils";

import { ThemeImage } from "../theme-image";

type FeatureItem = {
    id: string;
    title: string;
    description: string;
    details: string;
    icon: LucideIcon;
    badge?: string;
    preview: ReactNode;
};

const FEATURES: FeatureItem[] = [
    {
        id: "insights",
        icon: BarChart3,
        title: "Music Insights",
        description: "Most‑played tracks, artists, and albums with clean visuals",
        details:
            "Get comprehensive analytics on your listening habits with beautiful charts and detailed breakdowns of your favorite music.",
        badge: "Core",
        preview: (
            <ThemeImage
                darkSrc="/images/ranking-dark.png"
                lightSrc="/images/ranking-light.png"
                alt="Top songs, artists, albums"
                height={160 * 2}
                width={313 * 2}
                className="h-80 w-full rounded-xl object-cover"
            />
        ),
    },
    {
        id: "history",
        icon: Clock,
        title: "Listening History",
        description: "Timeline and trends of your listening habits over any period",
        details:
            "Explore your musical journey through time with detailed timelines showing how your taste evolves and changes.",
        badge: "Timeline",
        preview: (
            <ThemeImage
                darkSrc="/images/activity-dark.png"
                lightSrc="/images/activity-light.png"
                alt="Listening History"
                height={160 * 2}
                width={227 * 2}
                className="h-80 w-full rounded-xl object-cover"
            />
        ),
    },
    {
        id: "statistics",
        icon: TrendingUp,
        title: "Advanced Statistics",
        description: "Deep‑dive charts and breakdowns (time‑of‑day, streaks, more)",
        details:
            "Discover patterns in your listening with advanced metrics like peak listening hours, longest streaks, and seasonal trends.",
        badge: "Analytics",
        preview: (
            <ThemeImage
                darkSrc="/images/listening-habits-dark.png"
                lightSrc="/images/listening-habits-light.png"
                alt="Listening Habits"
                height={160 * 2}
                width={269 * 2}
                className="h-80 w-full rounded-xl object-cover"
            />
        ),
    },
    {
        id: "rankings",
        icon: Star,
        title: "Rankings",
        description:
            "Detailed rankings for tracks, albums, and artists with multiple sort modes",
        details:
            "Compare your favorites with ranking systems based on play count, time listened, or Spotify's ML algorithms.",
        badge: "Rankings",
        preview: (
            <ThemeImage
                darkSrc="/images/ranking-dark.png"
                lightSrc="/images/ranking-light.png"
                alt="Rankings"
                height={160 * 2}
                width={313 * 2}
                className="h-80 w-full rounded-xl object-cover"
            />
        ),
    },
    {
        id: "recent",
        icon: Calendar,
        title: "Recently Played",
        description: "A real‑time view of what's been on repeat",
        details:
            "Stay up‑to‑date with your latest listening activity and see what's currently dominating your playlists.",
        badge: "Real‑time",
        preview: (
            <ThemeImage
                darkSrc="/images/home.png"
                lightSrc="/images/home.png"
                alt="Recently Played"
                height={1064}
                width={1908}
                className="h-80 w-full rounded-xl object-cover"
            />
        ),
    },
    {
        id: "gems",
        icon: Search,
        title: "Forgotten Gems",
        description: "Resurface favorites you haven't played in a while",
        details:
            "Rediscover old favorites that have been buried in your library and bring back the nostalgia of past musical phases.",
        badge: "Discovery",
        preview: (
            <ThemeImage
                darkSrc="/images/listening-habits-dark.png"
                lightSrc="/images/listening-habits-light.png"
                alt="Forgotten Gems"
                height={160 * 2}
                width={269 * 2}
                className="h-80 w-full rounded-xl object-cover"
            />
        ),
    },
    {
        id: "sharing",
        icon: Share2,
        title: "Share Links",
        description: "Create secure, time‑limited, read‑only links to your profile",
        details:
            "Share your musical taste with friends through secure, customizable links that respect your privacy preferences.",
        badge: "Social",
        preview: (
            <ThemeImage
                darkSrc="/images/home.png"
                lightSrc="/images/home.png"
                alt="Secure sharing"
                height={1064}
                width={1908}
                className="h-80 w-full rounded-xl object-cover"
            />
        ),
    },
];

const getSelectedIndex = (scrollYProgress: number) => {
    const index = Math.round(scrollYProgress * (FEATURES.length - 1));
    return Math.max(0, Math.min(index, FEATURES.length - 1));
}

export function ScrollFeatures() {
    const [activeIndex, setActiveIndex] = useState(0);
    const listContainerRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({ target: listContainerRef, offset: ["0.5 0.8", "0.5 0.2"] });
    const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 50 });

    useEffect(() => progress.onChange((v: number) => setActiveIndex(getSelectedIndex(v))), [progress]);

    return (
        <section className="px-4 py-20">
            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-start gap-8 md:grid-cols-2">

                <div className="md:sticky md:top-20">
                    <Card className="p-6 sm:p-8">
                        <div className="mb-6">
                            <div className="mb-4 flex items-center gap-4">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                                    {(() => {
                                        const ActiveIcon = FEATURES[activeIndex]?.icon;
                                        return ActiveIcon ? <ActiveIcon className="size-5 text-foreground" /> : null;
                                    })()}
                                </div>
                                <h3 className="font-medium text-xl leading-tight">
                                    {FEATURES[activeIndex]?.title}
                                </h3>
                            </div>

                            <div>
                                <div className="rounded-lg border border-foreground/10 bg-background">
                                    {FEATURES[activeIndex]?.preview}
                                </div>
                            </div>
                        </div>

                        <p className="text-foreground/90 text-sm leading-relaxed">
                            {FEATURES[activeIndex]?.details}
                        </p>
                    </Card>
                </div>

                <div className="relative" ref={listContainerRef}>
                    <div className="space-y-4 pb-32">
                        {FEATURES.map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <div key={feature.id} className={cn("transition-colors duration-200", activeIndex === i ? "opacity-100" : "opacity-70")}>
                                    <Card
                                        className={cn(
                                            "border p-0 transition-colors duration-200",
                                            activeIndex === i ? "border-foreground/20 bg-muted/40" : "border-foreground/10 bg-background hover:bg-muted/20",
                                        )}
                                    >
                                        <div className="flex items-center gap-3 p-5">
                                            <div
                                                className={cn(
                                                    "flex size-10 items-center justify-center rounded-lg transition-colors",
                                                    activeIndex === i ? "bg-emerald-600 text-white" : "bg-muted text-foreground",
                                                )}
                                            >
                                                <Icon className="size-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-base md:text-lg">{feature.title}</h3>
                                                <p className="text-muted-foreground text-sm">{feature.description}</p>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}


