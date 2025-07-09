import { Clock, Headphones, Music, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { NumberFlow, NumbersFlowDate } from "@repo/ui/components/number";
import { Skeleton } from "@repo/ui/skeleton";

import { msToHours } from "~/lib/utils";

import { getStatsCardsData } from "../data/stats-cards";

type StatsCardsProps = {
	data?: Awaited<ReturnType<typeof getStatsCardsData>>;
	userId: string;
	isDemo: boolean;
};

export const StatsCards = async ({ data, userId, isDemo }: StatsCardsProps) => {
	if (!data) {
		data = await getStatsCardsData(userId, isDemo);
		if (!data) return null;
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Total Playtime</CardTitle>
					<Clock className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">
						<NumberFlow
							value={msToHours(data.listeningTime).toFixed(2)}
							suffix=" "
						/>
						hours
					</div>
					<p className="text-muted-foreground text-xs">
						<NumberFlow
							className="break-all"
							value={Math.round(msToHours(data.listeningTime) / 24)}
							prefix="That's about "
							suffix=" "
						/>
						days of non-stop music!
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Tracks Played</CardTitle>
					<Music className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">
						<NumberFlow
							value={data.totalPlays}
							format={{ notation: "standard" }}
							locales="en-US"
						/>
					</div>
					<p className="text-muted-foreground text-xs">
						<NumberFlow
							value={data.totalPlaysPerDay}
							prefix="Averaging "
							suffix=" "
						/>
						tracks per day
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">
						Artists Explored
					</CardTitle>
					<Users className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">
						<NumberFlow
							value={data.uniqueArtists}
							format={{ notation: "standard" }}
							locales="en-US"
						/>
					</div>
					<p className="text-muted-foreground text-xs">
						It's like having a concert with
						<NumberFlow
							value={data.uniqueArtists}
							format={{ notation: "standard" }}
							locales="en-US"
							prefix=" "
							suffix=" "
						/>
						artists!
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">
						Active Listeners
					</CardTitle>
					<Headphones className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">
						{data.mostActiveDay.day ? (
							<NumbersFlowDate value={data.mostActiveDay.day} />
						) : (
							"No data available"
						)}
					</div>
					<p className="text-muted-foreground text-xs">
						<NumberFlow
							value={data.mostActiveDay.totalPlayed}
							format={{ notation: "standard" }}
							locales="en-US"
							suffix=" tracks for "
							prefix="You played "
						/>
						<NumberFlow
							value={msToHours(data.mostActiveDay.timePlayed).toFixed(2)}
							suffix=" hours"
						/>
					</p>
				</CardContent>
			</Card>
		</div>
	);
};

export const StatsCardsSkeleton = () => {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Total Playtime</CardTitle>
					<Clock className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent className="space-y-1.5">
					<div className="font-bold text-2xl">
						<Skeleton>1014,63 hours</Skeleton>
					</div>
					<div className="text-muted-foreground text-xs">
						<Skeleton>That's about 42 days of non-stop music!</Skeleton>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Tracks Played</CardTitle>
					<Music className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent className="space-y-1.5">
					<div className="font-bold text-2xl">
						<Skeleton>24,302</Skeleton>
					</div>
					<div className="text-muted-foreground text-xs">
						<Skeleton>Averaging 66 tracks per day</Skeleton>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">
						Artists Explored
					</CardTitle>
					<Users className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent className="space-y-1.5">
					<div className="font-bold text-2xl">
						<Skeleton>1,829</Skeleton>
					</div>
					<div className="text-muted-foreground text-xs">
						<Skeleton>It's like having a concert with 1,829 artists!</Skeleton>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">
						Active Listeners
					</CardTitle>
					<Headphones className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent className="space-y-1.5">
					<div className="font-bold text-2xl">
						<Skeleton>August 16, 2024</Skeleton>
					</div>
					<div className="text-muted-foreground text-xs">
						<Skeleton>You played 1 tracks for 0,2 hours</Skeleton>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
