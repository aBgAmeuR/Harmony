import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";

import type { MusicItemCardProps } from "~/components/cards/music-item-card/type";
import { MusicList } from "~/components/lists/music-list";

import type { YearMetrics } from "../data/year-metrics";

type TopItemsCardsProps = {
    metrics1: YearMetrics;
    metrics2: YearMetrics;
};

function transformArtistsToMusicItems(artists: YearMetrics['topArtists']): MusicItemCardProps['item'][] {
    return artists.map((artist, index) => ({
        id: artist.id,
        name: artist.name,
        href: `https://open.spotify.com/artist/${artist.id}`,
        image: artist.image,
        artists: "", // Artists don't have sub-artists
        stat1: `${artist.plays} plays`,
        stat2: `#${index + 1}`,
    }));
}

function transformTracksToMusicItems(tracks: YearMetrics['topTracks']): MusicItemCardProps['item'][] {
    return tracks.map((track, index) => ({
        id: track.id,
        name: track.name,
        href: `https://open.spotify.com/track/${track.id}`,
        image: track.image,
        artists: track.artists.join(", "),
        stat1: `${track.plays} plays`,
        stat2: `#${index + 1}`,
    }));
}

export function TopItemsCards({ metrics1, metrics2 }: TopItemsCardsProps) {
    const artists1 = transformArtistsToMusicItems(metrics1.topArtists);
    const artists2 = transformArtistsToMusicItems(metrics2.topArtists);
    const tracks1 = transformTracksToMusicItems(metrics1.topTracks);
    const tracks2 = transformTracksToMusicItems(metrics2.topTracks);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Artists {metrics1.year}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MusicList
                            data={artists1}
                            config={{
                                label: "artists",
                                showRank: true,
                                layout: "list"
                            }}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Top Artists {metrics2.year}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MusicList
                            data={artists2}
                            config={{
                                label: "artists",
                                showRank: true,
                                layout: "list"
                            }}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Tracks {metrics1.year}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MusicList
                            data={tracks1}
                            config={{
                                label: "tracks",
                                showRank: true,
                                layout: "list"
                            }}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Top Tracks {metrics2.year}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MusicList
                            data={tracks2}
                            config={{
                                label: "tracks",
                                showRank: true,
                                layout: "list"
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 