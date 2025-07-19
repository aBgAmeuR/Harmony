"use client";


import { MusicItemCard } from "~/components/cards/music-item-card";

import type { ForgottenGem } from "../types";

interface ForgottenGemsListMinimalProps {
    gems: ForgottenGem[];
}

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
    };
}

export function ForgottenGemsListMinimal({ gems }: ForgottenGemsListMinimalProps) {
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
                    actionHref="rankingAlbum"
                    layout="list"
                />
            ))}
        </div>
    );
} 