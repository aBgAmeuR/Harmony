import { Music4Icon } from "lucide-react";

import { getUser } from "@repo/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";

import { getMonthlyTracksTabData } from "../data/monthly-tracks-tab";
import { MonthlyTracksTabClient } from "./monthly-tracks-tab-client";

type MonthlyTracksTabProps = {
	artistId: string;
};

export const MonthlyTracksTab = async ({ artistId }: MonthlyTracksTabProps) => {
	const { userId } = await getUser();
	const data = await getMonthlyTracksTabData(artistId, userId);

	if (!data || data.monthlyTrends.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Monthly Top Tracks</CardTitle>
					<CardDescription> No monthly listening data available for this artist</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
					<Music4Icon className="mb-2 size-8" />
					<p>Start listening to build your monthly stats!</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<MonthlyTracksTabClient {...data} />
	);
};
