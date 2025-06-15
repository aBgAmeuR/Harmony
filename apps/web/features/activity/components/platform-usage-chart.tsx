import { ReusableAreaChart } from "@repo/ui/components/charts/area-chart";
import { NumberFlow } from "@repo/ui/components/number";
import { Skeleton } from "@repo/ui/skeleton";
import {
    ChartCard,
    ChartCardContent,
    ChartCardHeader,
    ChartCardHeaderContent,
} from "~/components/charts/utils/chart-card";
import { msToHours } from "~/components/charts/utils/time-formatters";
import { getPlatformUsageData } from "../data/platform-usage";

interface PlatformUsageChartComponentProps {
    userId: string;
    isDemo: boolean;
    data?: {
        data: Array<{
            month: string;
            web: number;
            mobile: number;
            desktop: number;
        }>;
        mostUsedPlatform: {
            platform: string;
            value: number;
        };
    };
}

const chartConfig = {
    web: { label: "Web", color: "var(--chart-1)" },
    mobile: { label: "Mobile", color: "var(--chart-2)" },
    desktop: { label: "Desktop", color: "var(--chart-3)" },
};

export const PlatformUsageChart = async ({
    userId,
    isDemo,
    data,
}: PlatformUsageChartComponentProps) => {
    if (!data) {
        data = await getPlatformUsageData(userId, isDemo);
    }

    return (
        <ChartCard>
            <ChartCardHeader
                showSeparator={true}
                title="Platform Usage Over Time"
                description="Showing platform usage statistics"
            >
                <ChartCardHeaderContent
                    title={
                        <>
                            Most used platform is{" "}
                            <span className="font-medium">
                                {data.mostUsedPlatform.platform.charAt(0).toUpperCase() +
                                    data.mostUsedPlatform.platform.slice(1)}
                            </span>
                            {" "}with
                        </>
                    }
                    description={
                        <NumberFlow
                            value={msToHours(data.mostUsedPlatform.value).toFixed(2)}
                            suffix=" hours"
                        />
                    }
                />
            </ChartCardHeader>
            <ChartCardContent>
                <ReusableAreaChart
                    data={data.data}
                    xAxisDataKey="month"
                    areaDataKeys={["web", "mobile", "desktop"]}
                    stacked={true}
                    config={chartConfig}
                    yAxisTickFormatter="msToHours"
                    showLegend={true}
                />
            </ChartCardContent>
        </ChartCard>
    );
}

export function PlatformUsageChartSkeleton() {
    return (
        <ChartCard>
            <ChartCardHeader
                showSeparator={true}
                title="Platform Usage Over Time"
                description="Showing platform usage statistics"
            >
                <ChartCardHeaderContent
                    title={
                        <span className="flex gap-1">
                            Most used platform is <Skeleton className="h-4 w-11" /> with
                        </span>
                    }
                    description={<Skeleton className="mt-2 h-[22px] w-28" />}
                />
            </ChartCardHeader>
            <ChartCardContent>
                <Skeleton className="aspect-[10/3]" />
            </ChartCardContent>
        </ChartCard>
    );
}
