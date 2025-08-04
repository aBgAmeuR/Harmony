import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Switch } from "@repo/ui/switch";

import { MusicList } from "~/components/lists/music-list";
import { MusicListSkeleton } from "~/components/lists/music-list/skeleton";

import type { ComparisonMetrics } from "../types";

type ComparisonTopItemsCardProps = {
    metrics1: ComparisonMetrics
    metrics2: ComparisonMetrics
    titles: {
        title1: string
        title2: string
    }
};

export const ComparisonTopItemsCard = ({ metrics1, metrics2, titles }: ComparisonTopItemsCardProps) => {
    const [showMetrics, setShowMetrics] = React.useState(true);

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>{titles.title1}</CardTitle>
                    <MetricToggle label1={metrics1.label} label2={metrics2.label} showMetrics={showMetrics} setShowMetrics={setShowMetrics} />
                </CardHeader>
                <CardContent>
                    <MusicList
                        data={showMetrics ? metrics2.rank1 : metrics1.rank1}
                        config={{ label: titles.title1, showRank: true, layout: "list" }}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>{titles.title2}</CardTitle>
                    <MetricToggle label1={metrics1.label} label2={metrics2.label} showMetrics={showMetrics} setShowMetrics={setShowMetrics} />
                </CardHeader>
                <CardContent>
                    <MusicList
                        data={showMetrics ? metrics2.rank2 : metrics1.rank2}
                        config={{ label: titles.title2, showRank: true, layout: "list" }}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

type MetricToggleProps = {
    label1: string
    label2: string
    showMetrics: boolean
    setShowMetrics: (showMetrics: boolean) => void
}

const MetricToggle = ({ label1, label2, showMetrics, setShowMetrics }: MetricToggleProps) => (
    <div className="flex items-center gap-3">
        <span className={`select-none font-medium text-sm ${!showMetrics ? 'text-foreground' : 'text-muted-foreground'}`}>
            {label1}
        </span>
        <Switch
            checked={showMetrics}
            onCheckedChange={setShowMetrics}
        />
        <span className={`select-none font-medium text-sm ${showMetrics ? 'text-foreground' : 'text-muted-foreground'}`}>
            {label2}
        </span>
    </div>
)

export const ComparisonTopItemsCardSkeleton = ({ titles }: Pick<ComparisonTopItemsCardProps, "titles">) => {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="pt-0.5">{titles.title1}</CardTitle>
                </CardHeader>
                <CardContent>
                    <MusicListSkeleton length={5} layout="list" showRank={true} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="pt-0.5">{titles.title2}</CardTitle>
                </CardHeader>
                <CardContent>
                    <MusicListSkeleton length={5} layout="list" showRank={true} />
                </CardContent>
            </Card>
        </div>
    );
};