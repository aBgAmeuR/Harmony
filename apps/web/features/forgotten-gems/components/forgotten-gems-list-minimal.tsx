"use client";

import { Badge } from "@repo/ui/components/ui/badge";

import { MusicItemCard } from "~/components/cards/music-item-card";

import type { ForgottenGem } from "../types";

interface ForgottenGemsListMinimalProps {
    gems: ForgottenGem[];
    isLoading: boolean;
}

const REASON_LABELS = {
    high_completion: "Deep Cut",
    repeat_behavior: "On Repeat",
    peak_period: "Peak Era",
    long_sessions: "Long Listen",
} as const;

const REASON_VARIANTS = {
    high_completion: "default" as const,
    repeat_behavior: "secondary" as const,
    peak_period: "outline" as const,
    long_sessions: "secondary" as const,
};

function formatLastPlayed(daysSinceLastPlayed: number): string {
    if (daysSinceLastPlayed > 365) {
        const years = Math.floor(daysSinceLastPlayed / 365);
        const months = Math.floor((daysSinceLastPlayed % 365) / 30);
        return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''} ago`;
    }
    if (daysSinceLastPlayed > 30) {
        const months = Math.floor(daysSinceLastPlayed / 30);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    return `${daysSinceLastPlayed} day${daysSinceLastPlayed > 1 ? 's' : ''} ago`;
}

function gemToMusicItem(gem: ForgottenGem, _index: number) {
    return {
        id: gem.spotifyId,
        name: gem.name,
        href: gem.spotifyUrl,
        image: gem.image,
        artists: gem.artists.join(", "),
        stat1: `${gem.totalPlays} plays`,
        stat2: formatLastPlayed(gem.daysSinceLastPlayed),
        description: (
            <Badge variant={REASON_VARIANTS[gem.reason]} className="ml-2 text-xs">
                {REASON_LABELS[gem.reason]}
            </Badge>
        ),
    };
}

export function ForgottenGemsListMinimal({ gems, isLoading }: ForgottenGemsListMinimalProps) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                        <div className="w-8 text-center text-muted-foreground text-sm">
                            {String(i + 1).padStart(2, '0')}
                        </div>
                        <div className="h-12 w-12 animate-pulse rounded bg-muted" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                        </div>
                        <div className="space-y-1 text-right">
                            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                        </div>
                        <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                    </div>
                ))}
            </div>
        );
    }

    if (gems.length === 0) {
        return (
            <div className="py-12 text-center">
                <div className="text-muted-foreground">
                    No forgotten gems found for this period.
                    <br />
                    Try selecting a different year or time range.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {gems.map((gem, index) => (
                <MusicItemCard
                    key={gem.spotifyId}
                    item={gemToMusicItem(gem, index)}
                    rank={index + 1}
                    showAction={true}
                    actionHref={gem.spotifyUrl}
                    layout="list"
                />
            ))}
        </div>
    );
} 