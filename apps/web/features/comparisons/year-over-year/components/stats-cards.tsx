import { Clock, Disc3, Music, Users } from "lucide-react";

import { msToHours } from "~/lib/utils";

import { ComparisonStatsCards, ComparisonStatsCardsSkeleton } from "../../common/components/stats-cards";
import type { YearMetrics } from "../data/year-metrics";


type StatsCardsProps = {
    metrics1: YearMetrics
    metrics2: YearMetrics
};

const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
};

export const StatsCards = ({ metrics1, metrics2 }: StatsCardsProps) => {
    const listeningTimeHours1 = msToHours(metrics1.totalListeningTime);
    const listeningTimeHours2 = msToHours(metrics2.totalListeningTime);
    const listeningTimeChange = calculatePercentageChange(listeningTimeHours1, listeningTimeHours2);

    const tracksChange = calculatePercentageChange(metrics1.uniqueTracks, metrics2.uniqueTracks);
    const artistsChange = calculatePercentageChange(metrics1.uniqueArtists, metrics2.uniqueArtists);
    const albumsChange = calculatePercentageChange(metrics1.uniqueAlbums, metrics2.uniqueAlbums);

    const statsData = [
        {
            title: "Listening Time",
            icon: Clock,
            value1: `${Math.round(listeningTimeHours1)}h`,
            value2: `${Math.round(listeningTimeHours2)}h`,
            change: listeningTimeChange,
        },
        {
            title: "Unique Tracks",
            icon: Music,
            value1: metrics1.uniqueTracks.toLocaleString(),
            value2: metrics2.uniqueTracks.toLocaleString(),
            change: tracksChange,
        },
        {
            title: "Unique Artists",
            icon: Users,
            value1: metrics1.uniqueArtists.toLocaleString(),
            value2: metrics2.uniqueArtists.toLocaleString(),
            change: artistsChange,
        },
        {
            title: "Unique Albums",
            icon: Disc3,
            value1: metrics1.uniqueAlbums.toLocaleString(),
            value2: metrics2.uniqueAlbums.toLocaleString(),
            change: albumsChange,
        },
    ];

    return <ComparisonStatsCards cards={statsData} label={metrics2.year.toString()} />
};

export const StatsCardsSkeleton = () => {
    return <ComparisonStatsCardsSkeleton cards={[
        { title: "Listening Time", icon: Clock },
        { title: "Unique Tracks", icon: Music },
        { title: "Unique Artists", icon: Users },
        { title: "Unique Albums", icon: Disc3 },
    ]} />
};
