import { Clock, Disc3, Music, Users } from "lucide-react";

import { StatsCards as CommonStatsCards, StatsCardsSkeleton as CommonStatsCardsSkeleton, calculatePercentageChange, msToHours } from "../../common/components/stats-cards";
import type { ArtistMetrics } from "../data/artist-metrics";

type StatsCardsProps = {
    metrics1: ArtistMetrics;
    metrics2: ArtistMetrics;
    artist1Name: string;
    artist2Name: string;
};

export const StatsCards = ({ metrics1, metrics2, artist1Name, artist2Name }: StatsCardsProps) => {
    const listeningTimeHours1 = msToHours(metrics1.total.listeningTime);
    const listeningTimeHours2 = msToHours(metrics2.total.listeningTime);
    const listeningTimeChange = calculatePercentageChange(listeningTimeHours1, listeningTimeHours2);

    const tracksChange = calculatePercentageChange(metrics1.unique.tracks, metrics2.unique.tracks);
    const albumsChange = calculatePercentageChange(metrics1.unique.albums, metrics2.unique.albums);
    const streamsChange = calculatePercentageChange(metrics1.total.streams, metrics2.total.streams);

    const statsData = [
        {
            title: "Listening Time",
            icon: Clock,
            value1: `${Math.round(listeningTimeHours1)}h`,
            value2: `${Math.round(listeningTimeHours2)}h`,
            change: listeningTimeChange,
        },
        {
            title: "Total Streams",
            icon: Music,
            value1: metrics1.total.streams.toLocaleString(),
            value2: metrics2.total.streams.toLocaleString(),
            change: streamsChange,
        },
        {
            title: "Unique Tracks",
            icon: Users,
            value1: metrics1.unique.tracks.toLocaleString(),
            value2: metrics2.unique.tracks.toLocaleString(),
            change: tracksChange,
        },
        {
            title: "Unique Albums",
            icon: Disc3,
            value1: metrics1.unique.albums.toLocaleString(),
            value2: metrics2.unique.albums.toLocaleString(),
            change: albumsChange,
        },
    ];

    return (
        <CommonStatsCards
            statsData={statsData}
            label1={artist1Name}
            label2={artist2Name}
        />
    );
};

export const StatsCardsSkeleton = CommonStatsCardsSkeleton;