import { auth } from "@repo/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { NumberFlow, NumbersFlowDate } from "@repo/ui/number";
import { Skeleton } from "@repo/ui/skeleton";
import { Clock, Headphones, Music, Users } from "lucide-react";

import { getOverviewCardsData } from "~/services/stats-cards/get-overview-cards-data";

const msToHours = (ms: number) => ms / 1000 / 60 / 60;

export const TopStatsCards = async () => {
  const session = await auth();
  const data = await getOverviewCardsData(session?.user.id);
  if (!data) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Playtime</CardTitle>
          <Clock className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <NumberFlow
              value={msToHours(data.listeningTime).toFixed(2)}
              suffix=" "
            />
            hours
          </div>
          <p className="text-xs text-muted-foreground">
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
          <CardTitle className="text-sm font-medium">Tracks Played</CardTitle>
          <Music className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <NumberFlow
              value={data.totalPlays}
              format={{ notation: "standard" }}
              locales="en-US"
            />
          </div>
          <p className="text-xs text-muted-foreground">
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
          <CardTitle className="text-sm font-medium">
            Artists Explored
          </CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <NumberFlow
              value={data.uniqueArtists}
              format={{ notation: "standard" }}
              locales="en-US"
            />
          </div>
          <p className="text-xs text-muted-foreground">
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
          <CardTitle className="text-sm font-medium">
            Active Listeners
          </CardTitle>
          <Headphones className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.mostActiveDay.day ? (
              <NumbersFlowDate value={data.mostActiveDay.day} />
            ) : (
              "No data available"
            )}
          </div>
          <p className="text-xs text-muted-foreground">
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

export const TopStatsCardsSkeleton = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Playtime</CardTitle>
          <Clock className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-40 h-6 my-1.5" />
          <Skeleton className="w-full max-w-56 h-[18px]" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tracks Played</CardTitle>
          <Music className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-24 h-6 my-1.5" />
          <Skeleton className="w-full max-w-52 h-[18px]" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Artists Explored
          </CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-20 h-6 my-1.5" />
          <Skeleton className="w-full max-w-52 h-[18px]" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Listeners
          </CardTitle>
          <Headphones className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-40 h-6 my-1.5" />
          <Skeleton className="w-full max-w-52 h-[18px]" />
        </CardContent>
      </Card>
    </div>
  );
};