"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Switch } from "@repo/ui/switch";

import type { MusicItemCardProps } from "~/components/cards/music-item-card/type";
import { MusicList } from "~/components/lists/music-list";
import { MusicListSkeleton } from "~/components/lists/music-list/skeleton";

import type { ArtistMetrics } from "../data/artist-metrics";

type TopItemsCardsProps = {
    metrics1: ArtistMetrics;
    metrics2: ArtistMetrics;
    artist1Name: string;
    artist2Name: string;
};

type RankChange = "up" | "down" | "new";

function calculateRankChanges<T extends { trackId?: string; albumId?: string }>(
    currentList: T[],
    previousList: T[]
): Map<string, { rankChange: RankChange; previousRank?: number }> {
    const getId = (item: T) => item.trackId || item.albumId || '';
    const previousRanks = new Map(previousList.map((item, index) => [getId(item), index + 1]));
    const rankChanges = new Map<string, { rankChange: RankChange; previousRank?: number }>();

    currentList.forEach((item, currentIndex) => {
        const currentRank = currentIndex + 1;
        const itemId = getId(item);
        const previousRank = previousRanks.get(itemId);

        if (previousRank === undefined) {
            rankChanges.set(itemId, { rankChange: "new" });
        } else {
            const change = previousRank > currentRank ? "up" :
                previousRank < currentRank ? "down" :
                    undefined;
            rankChanges.set(itemId, {
                rankChange: change as RankChange,
                previousRank
            });
        }
    });

    return rankChanges;
}

function transformTracksToMusicItems(
    tracks: ArtistMetrics['topTracks'],
    rankChanges?: Map<string, { rankChange: RankChange; previousRank?: number }>
): MusicItemCardProps['item'][] {
    return tracks.map((track) => {
        const rankChangeInfo = rankChanges?.get(track.trackId);
        return {
            id: track.trackId,
            name: `Track ${track.trackId}`, // Will be replaced with actual track name from Spotify API
            href: `https://open.spotify.com/track/${track.trackId}`,
            image: "", // Will be populated from Spotify API
            artists: "", // Will be populated from Spotify API
            stat1: `${track.plays} plays`,
            stat2: `${Math.round(track.time / 60000)} min`,
            rankChange: rankChangeInfo?.rankChange,
        };
    });
}

function transformAlbumsToMusicItems(
    albums: ArtistMetrics['topAlbums'],
    rankChanges?: Map<string, { rankChange: RankChange; previousRank?: number }>
): MusicItemCardProps['item'][] {
    return albums.map((album) => {
        const rankChangeInfo = rankChanges?.get(album.albumId);
        return {
            id: album.albumId,
            name: `Album ${album.albumId}`, // Will be replaced with actual album name from Spotify API
            href: `https://open.spotify.com/album/${album.albumId}`,
            image: "", // Will be populated from Spotify API
            artists: "", // Will be populated from Spotify API
            stat1: `${album.plays} plays`,
            stat2: `${Math.round(album.time / 60000)} min`,
            rankChange: rankChangeInfo?.rankChange,
        };
    });
}

export function TopItemsCards({ metrics1, metrics2, artist1Name, artist2Name }: TopItemsCardsProps) {
    const [showArtist1Tracks, setShowArtist1Tracks] = useState(true);
    const [showArtist1Albums, setShowArtist1Albums] = useState(true);

    const tracksRankChanges1 = calculateRankChanges(metrics1.topTracks, metrics2.topTracks);
    const tracksRankChanges2 = calculateRankChanges(metrics2.topTracks, metrics1.topTracks);
    const albumsRankChanges1 = calculateRankChanges(metrics1.topAlbums, metrics2.topAlbums);
    const albumsRankChanges2 = calculateRankChanges(metrics2.topAlbums, metrics1.topAlbums);

    const tracks1 = transformTracksToMusicItems(metrics1.topTracks, tracksRankChanges1);
    const tracks2 = transformTracksToMusicItems(metrics2.topTracks, tracksRankChanges2);
    const albums1 = transformAlbumsToMusicItems(metrics1.topAlbums, albumsRankChanges1);
    const albums2 = transformAlbumsToMusicItems(metrics2.topAlbums, albumsRankChanges2);

    const currentTracksData = showArtist1Tracks ? tracks1 : tracks2;
    const currentAlbumsData = showArtist1Albums ? albums1 : albums2;

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-base">Top Tracks</CardTitle>
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{artist2Name}</span>
                        <Switch
                            checked={showArtist1Tracks}
                            onCheckedChange={setShowArtist1Tracks}
                        />
                        <span className="font-medium text-sm">{artist1Name}</span>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    {/* <MusicList items={currentTracksData} /> */}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-base">Top Albums</CardTitle>
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{artist2Name}</span>
                        <Switch
                            checked={showArtist1Albums}
                            onCheckedChange={setShowArtist1Albums}
                        />
                        <span className="font-medium text-sm">{artist1Name}</span>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    {/* <MusicList items={currentAlbumsData} /> */}
                </CardContent>
            </Card>
        </div>
    );
}

export function TopItemsCardsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-base">Top Tracks</CardTitle>
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">Artist 2</span>
                        <Switch disabled />
                        <span className="font-medium text-sm">Artist 1</span>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <MusicListSkeleton />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-base">Top Albums</CardTitle>
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">Artist 2</span>
                        <Switch disabled />
                        <span className="font-medium text-sm">Artist 1</span>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <MusicListSkeleton />
                </CardContent>
            </Card>
        </div>
    );
}