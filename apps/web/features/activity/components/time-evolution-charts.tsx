import { ReusableLineChart } from "@repo/ui/components/charts/line-chart";
import { Skeleton } from "@repo/ui/skeleton";
import {
    ChartCard,
    ChartCardContent,
    ChartCardHeader,
} from "~/components/charts/utils/chart-card";
import { getTimeEvolutionData } from "../data/time-evolution";

type TimeEvolutionChartsProps = {
    userId: string;
    isDemo: boolean;
    data?: Awaited<ReturnType<typeof getTimeEvolutionData>>;
};

export const TimeEvolutionCharts = async ({
    userId,
    isDemo,
    data,
}: TimeEvolutionChartsProps) => {
    if (!data) {
        data = await getTimeEvolutionData(userId, isDemo);
        if (!data) return null;
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ChartCard className="justify-between">
                <ChartCardHeader
                    title="Tracks Evolution"
                    description="Evolution of tracks listened to for the first time."
                />
                <ChartCardContent className="pt-0">
                    <ReusableLineChart
                        data={data.tracks.data}
                        xAxisDataKey="month"
                        lineDataKey="value"
                        config={{ value: { label: "Tracks", color: "var(--chart-1)" } }}
                        showYAxis={false}
                        className="aspect-video size-full"
                        cursor={true}
                        syncId="first-time-evolution"
                    />
                </ChartCardContent>
            </ChartCard>
            <ChartCard className="justify-between">
                <ChartCardHeader
                    title="Albums Evolution"
                    description="Evolution of albums listened to for the first time."
                />
                <ChartCardContent className="pt-0">
                    <ReusableLineChart
                        data={data.albums.data}
                        xAxisDataKey="month"
                        lineDataKey="value"
                        config={{ value: { label: "Albums", color: "var(--chart-2)" } }}
                        showYAxis={false}
                        className="aspect-video size-full"
                        cursor={true}
                        syncId="first-time-evolution"
                    />
                </ChartCardContent>
            </ChartCard>
            <ChartCard className="justify-between">
                <ChartCardHeader
                    title="Artists Evolution"
                    description="Evolution of artists listened to for the first time."
                />
                <ChartCardContent className="pt-0">
                    <ReusableLineChart
                        data={data.artists.data}
                        xAxisDataKey="month"
                        lineDataKey="value"
                        config={{ value: { label: "Artists", color: "var(--chart-3)" } }}
                        showYAxis={false}
                        className="aspect-video size-full"
                        cursor={true}
                        syncId="first-time-evolution"
                    />
                </ChartCardContent>
            </ChartCard>
        </div>
    );
}

export const TimeEvolutionChartsSkeleton = () => {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ChartCard className="justify-between">
                <ChartCardHeader
                    title="Tracks Evolution"
                    description="Evolution of tracks listened to for the first time."
                />
                <ChartCardContent>
                    <Skeleton className="aspect-video" />
                </ChartCardContent>
            </ChartCard>
            <ChartCard className="justify-between">
                <ChartCardHeader
                    title="Albums Evolution"
                    description="Evolution of albums listened to for the first time."
                />
                <ChartCardContent>
                    <Skeleton className="aspect-video" />
                </ChartCardContent>
            </ChartCard>
            <ChartCard className="justify-between">
                <ChartCardHeader
                    title="Artists Evolution"
                    description="Evolution of artists listened to for the first time."
                />
                <ChartCardContent>
                    <Skeleton className="aspect-video" />
                </ChartCardContent>
            </ChartCard>
        </div>
    );
};
