"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Switch } from "@repo/ui/switch";

import type { MusicItemCardProps } from "~/components/cards/music-item-card/type";
import { MusicList } from "~/components/lists/music-list";
import { MusicListSkeleton } from "~/components/lists/music-list/skeleton";

import type { YearMetrics } from "../data/year-metrics";

type TopItemsCardsProps = {
    metrics1: YearMetrics;
    metrics2: YearMetrics;
};

type RankChange = "up" | "down" | "new";

function calculateRankChanges<T extends { id: string }>(
    currentList: T[],
    previousList: T[]
): Map<string, { rankChange: RankChange; previousRank?: number }> {
    const previousRanks = new Map(previousList.map((item, index) => [item.id, index + 1]));
    const rankChanges = new Map<string, { rankChange: RankChange; previousRank?: number }>();

    currentList.forEach((item, currentIndex) => {
        const currentRank = currentIndex + 1;
        const previousRank = previousRanks.get(item.id);

        if (previousRank === undefined) {
            rankChanges.set(item.id, { rankChange: "new" });
        } else {
            const change = previousRank > currentRank ? "up" :
                previousRank < currentRank ? "down" :
                    undefined;
            rankChanges.set(item.id, {
                rankChange: change as RankChange,
                previousRank
            });
        }
    });

    return rankChanges;
}

function transformArtistsToMusicItems(
    artists: YearMetrics['topArtists'],
    rankChanges?: Map<string, { rankChange: RankChange; previousRank?: number }>
): MusicItemCardProps['item'][] {
    return artists.map((artist) => {
        const rankChangeInfo = rankChanges?.get(artist.id);
        return {
            id: artist.id,
            name: artist.name,
            href: `https://open.spotify.com/artist/${artist.id}`,
            image: artist.image,
            stat1: `${artist.plays} plays`,
            stat2: `${(artist.msPlayed / 1000 / 60).toFixed(2)} min`,
            rankChange: rankChangeInfo?.rankChange,
        };
    });
}

function transformTracksToMusicItems(
    tracks: YearMetrics['topTracks'],
    rankChanges?: Map<string, { rankChange: RankChange; previousRank?: number }>
): MusicItemCardProps['item'][] {
    return tracks.map((track) => {
        const rankChangeInfo = rankChanges?.get(track.id);
        return {
            id: track.id,
            name: track.name,
            href: `https://open.spotify.com/track/${track.id}`,
            image: track.image,
            artists: track.artists.join(", "),
            stat1: `${track.plays} plays`,
            stat2: `${(track.msPlayed / 1000 / 60).toFixed(2)} min`,
            rankChange: rankChangeInfo?.rankChange,
        };
    });
}

export function TopItemsCards({ metrics1, metrics2 }: TopItemsCardsProps) {
    const [showYear1Artists, setShowYear1Artists] = useState(true);
    const [showYear1Tracks, setShowYear1Tracks] = useState(true);

    const artistsRankChanges1 = calculateRankChanges(metrics1.topArtists, metrics2.topArtists);
    const artistsRankChanges2 = calculateRankChanges(metrics2.topArtists, metrics1.topArtists);
    const tracksRankChanges1 = calculateRankChanges(metrics1.topTracks, metrics2.topTracks);
    const tracksRankChanges2 = calculateRankChanges(metrics2.topTracks, metrics1.topTracks);

    const artists1 = transformArtistsToMusicItems(metrics1.topArtists, artistsRankChanges1);
    const artists2 = transformArtistsToMusicItems(metrics2.topArtists, artistsRankChanges2);
    const tracks1 = transformTracksToMusicItems(metrics1.topTracks, tracksRankChanges1);
    const tracks2 = transformTracksToMusicItems(metrics2.topTracks, tracksRankChanges2);

    const currentArtistsData = showYear1Artists ? artists1 : artists2;
    const currentTracksData = showYear1Tracks ? tracks1 : tracks2;

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>Top Artists</CardTitle>
                    <div className="flex items-center gap-3">
                        <span className={`font-medium text-sm ${showYear1Artists ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {metrics1.year}
                        </span>
                        <Switch
                            checked={!showYear1Artists}
                            onCheckedChange={(checked) => setShowYear1Artists(!checked)}
                        />
                        <span className={`font-medium text-sm ${!showYear1Artists ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {metrics2.year}
                        </span>
                    </div>
                </CardHeader>
                <CardContent>
                    <MusicList
                        data={currentArtistsData}
                        config={{
                            label: "artists",
                            showRank: true,
                            layout: "list"
                        }}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>Top Tracks</CardTitle>
                    <div className="flex items-center gap-3">
                        <span className={`font-medium text-sm ${showYear1Tracks ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {metrics1.year}
                        </span>
                        <Switch
                            checked={!showYear1Tracks}
                            onCheckedChange={(checked) => setShowYear1Tracks(!checked)}
                        />
                        <span className={`font-medium text-sm ${!showYear1Tracks ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {metrics2.year}
                        </span>
                    </div>
                </CardHeader>
                <CardContent>
                    <MusicList
                        data={currentTracksData}
                        config={{
                            label: "tracks",
                            showRank: true,
                            layout: "list"
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

export function TopItemsCardsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="pt-0.5">Top Artists</CardTitle>
                </CardHeader>
                <CardContent>
                    <MusicListSkeleton length={5} layout="list" showRank={true} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="pt-0.5">Top Tracks</CardTitle>
                </CardHeader>
                <CardContent>
                    <MusicListSkeleton length={5} layout="list" showRank={true} />
                </CardContent>
            </Card>
        </div>
    );
} 