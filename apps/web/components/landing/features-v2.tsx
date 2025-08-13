
"use client";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import Balancer from "react-wrap-balancer";

import { ReusableBarChart } from "@repo/ui/components/charts/bar-chart";
import { ReusableLineChart } from "@repo/ui/components/charts/line-chart";
import { cn } from "@repo/ui/lib/utils";
import { Separator } from "@repo/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";

import { MusicItemCard } from "../cards/music-item-card";
import type { MusicItemCardProps } from "../cards/music-item-card/type";


export const FeaturesV2 = () => {
    return (
        <section className="mx-auto w-full max-w-5xl px-6">
            <div className="relative flex flex-col items-start justify-start gap-6 py-8 md:py-16">
                <div className="z-10 flex flex-col gap-4 self-stretch pt-8 md:pt-14">
                    <h2 className="w-full max-w-[655px] font-semibold text-4xl text-foreground leading-tight">
                        Powerful Music Analytics
                    </h2>
                    <Balancer className="w-full max-w-[600px] font-medium text-lg text-muted-foreground leading-relaxed md:text-xl">
                        Analytics beyond Wrapped. Private, open-source, and minimal permissions.
                    </Balancer>
                </div>

                <div className="mask-fade-all">
                    <Image src="/images/listening-history-v2.png" alt="Feature 2" width={1280} height={661} className="h-auto w-full" />
                </div>

                <div className="grid w-full grid-cols-2 gap-4 divide-x-1 border-border border-y-1">
                    <div className="flex flex-col gap-6 py-12 pr-12">
                        <div className="flex flex-col gap-1">
                            <h3 className="font-medium text-2xl">
                                Rankings
                            </h3>
                            <p className="text-muted-foreground">
                                Detailed rankings with multiple sort modes and change tracking.
                            </p>
                        </div>
                        <div className="[--mask-bottom:linear-gradient(to_bottom,var(--mask-visible)_50%,var(--mask-invisible)_100%)] [--mask-invisible:rgba(0,0,0,0)] [--mask-right:linear-gradient(to_right,var(--mask-visible)_60%,var(--mask-invisible)_100%)] [--mask-visible:rgba(0,0,0,1)] [-webkit-mask-composite:source-in] [-webkit-mask-image:var(--mask-bottom),var(--mask-right)] [mask-composite:intersect] [mask-image:var(--mask-bottom),var(--mask-right)]">
                            <Image src="/images/top-tracks.png" alt="Feature 2" width={704} height={638} className="h-auto w-full" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 py-12 pl-12">
                        <div className="flex flex-col gap-1">
                            <h3 className="font-medium text-2xl">
                                Advanced Statistics
                            </h3>
                            <p className="text-muted-foreground">
                                Deep-dive charts and breakdowns with time-of-day analysis.
                            </p>
                        </div>
                        <div className="mask-fade-bottom-right">
                            <Image src="/images/advanced-statistics.png" alt="Feature 2" width={995} height={947} className="h-auto w-full" />
                        </div>
                    </div>
                </div>

                <InteractiveComparisonsSection />
            </div>
        </section>
    )
};

function InteractiveComparisonsSection() {
    return (
        <div className="flex w-full flex-col gap-6 py-12">
            <Tabs
                defaultValue="numbers"
                orientation="vertical"
                className="w-full flex-row justify-between"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="font-medium text-2xl">Comparisons</h3>
                        <p className="text-muted-foreground">Compare artists or years side-by-side.</p>
                    </div>
                    <TabsList className="flex-col rounded-none bg-transparent p-0">
                        <TabsTrigger
                            value="numbers"
                            className="after:-translate-y-1/2 relative w-full justify-start rounded-none after:absolute after:top-1/2 after:left-0 after:h-3/4 after:w-1 after:rounded-full after:bg-card data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                        >
                            Numbers
                        </TabsTrigger>
                        <TabsTrigger
                            value="evolution"
                            className="after:-translate-y-1/2 relative w-full justify-start rounded-none after:absolute after:top-1/2 after:left-0 after:h-3/4 after:w-1 after:rounded-full after:bg-card data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                        >
                            Monthly Evolution
                        </TabsTrigger>
                        <TabsTrigger
                            value="comparison"
                            className="after:-translate-y-1/2 relative w-full justify-start rounded-none after:absolute after:top-1/2 after:left-0 after:h-3/4 after:w-1 after:rounded-full after:bg-card data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                        >
                            Listening Time Comparison
                        </TabsTrigger>
                        <TabsTrigger
                            value="ranking"
                            className="after:-translate-y-1/2 relative w-full justify-start rounded-none after:absolute after:top-1/2 after:left-0 after:h-3/4 after:w-1 after:rounded-full after:bg-card data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                        >
                            Rankings
                        </TabsTrigger>
                    </TabsList>
                </div>
                <div className="relative aspect-video h-72 rounded-xl border border-foreground/10 bg-card/20 p-4 backdrop-blur">
                    <TabsContent value="numbers">
                        <h4 className="mb-3 font-semibold">Numbers</h4>
                        <NumbersPreview />
                    </TabsContent>
                    <TabsContent value="evolution">
                        <h4 className="mb-3 font-semibold">Monthly Evolution</h4>
                        <MonthlyEvolution />
                    </TabsContent>
                    <TabsContent value="comparison" className="flex flex-1 flex-col">
                        <h4 className="mb-3 font-semibold">Listening Time Comparison</h4>
                        <ListeningTimeComparisonCard />
                    </TabsContent>
                    <TabsContent value="ranking">
                        <h4 className="mb-3 font-semibold">Rankings</h4>
                        <Rankings />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}

function NumbersPreview() {
    return (
        <div className="grid grid-cols-2 gap-3">
            <MetricTile title="Listening Time" value="176h" delta="-4.5% vs Drake" trend="down" />
            <MetricTile title="Total Streams" value="3553" delta="+2.9% vs Drake" trend="up" />
            <MetricTile title="Unique Tracks" value="325" delta="+15.7% vs Drake" trend="up" />
            <MetricTile title="Unique Albums" value="22" delta="+4.8% vs Drake" trend="up" />
        </div>
    );
}

export function MonthlyEvolution() {
    const data = [
        { month: "Jan", value1: 17342013, value2: 23891742 },
        { month: "Feb", value1: 1238491, value2: 16749238 },
        { month: "Mar", value1: 14567823, value2: 27654321 },
        { month: "Apr", value1: 26789123, value2: 31234567 },
        { month: "May", value1: 32456789, value2: 29876543 },
        { month: "Jun", value1: 28765432, value2: 33456789 },
        { month: "Jul", value1: 33987654, value2: 6543219 },
        { month: "Aug", value1: 25987654, value2: 11987654 },
        { month: "Sep", value1: 234567, value2: 28765432 },
        { month: "Oct", value1: 7891234, value2: 32987654 },
        { month: "Nov", value1: 3456789, value2: 27891234 },
        { month: "Dec", value1: 26543219, value2: 34219876 },
    ];

    const config = {
        value1: { label: "Kanye West", color: "var(--chart-1)" },
        value2: { label: "Drake", color: "var(--chart-4)" },
    };

    return (
        <div className="flex flex-1">
            <ReusableLineChart
                data={data}
                className="size-full"
                xAxisDataKey="month"
                lineDataKeys={["value1", "value2"]}
                config={config}
                showYAxis={false}
                tooltipValueFormatter="hourSuffix"
                showDots={true}
                margin={{ left: 12, top: 0, right: 12, bottom: 6 }}
            />
        </div>
    );
}


export function ListeningTimeComparisonCard() {
    const data = [
        { metric: "Listening Time (min)", value1: 17600, value2: 14200 },
        { metric: "Total Streams", value1: 3553, value2: 2980 },
    ];

    const config = {
        value1: { label: "Kanye West", color: "var(--chart-1)" },
        value2: { label: "Drake", color: "var(--chart-4)" },
    };

    return (
        <ReusableBarChart
            data={data}
            xAxisDataKey="metric"
            barDataKeys={["value1", "value2"]}
            config={config}
            showYAxis={false}
            className="aspect-auto! size-full flex-1"
        />
    );
}

export function Rankings() {
    const data: MusicItemCardProps["item"][] = [
        {
            id: "6Kj17Afjo1OKJYpf5VzCeo",
            name: "Pain 1993 (with Playboi Carti)",
            href: "https://open.spotify.com/track/6Kj17Afjo1OKJYpf5VzCeo",
            image: "https://i.scdn.co/image/ab67616d0000b273bba7cfaf7c59ff0898acba1f",
            artists: "Drake, Playboi Carti",
        },
        {
            id: "3CA9pLiwRIGtUBiMjbZmRw",
            name: "Nice For What",
            href: "https://open.spotify.com/track/3CA9pLiwRIGtUBiMjbZmRw",
            image: "https://i.scdn.co/image/ab67616d0000b273f907de96b9a4fbc04accc0d5",
            artists: "Drake",
        },
    ];

    return (
        <div className="flex flex-col">
            {data.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex flex-col">
                    <MusicItemCard item={item} rank={index + 1} />
                    {index < data.length - 1 && <Separator className="my-2" />}
                </div>
            ))}
        </div>
    );
}


function MetricTile(props: { title: string; value: string; delta: string; trend: "up" | "down" }) {
    const DeltaPrefix = props.trend === "up" ? TrendingUp : TrendingDown;
    return (
        <div className="rounded-lg border border-foreground/10 bg-card p-3">
            <div className="mb-1 text-muted-foreground">{props.title}</div>
            <div className="font-semibold text-2xl tabular-nums">{props.value}</div>
            <div className={cn("flex items-center gap-1 text-xs", props.trend === "up" ? "text-emerald-500" : "text-red-500")}>
                <DeltaPrefix className="size-3" />
                {props.delta}
            </div>
        </div>
    );
}