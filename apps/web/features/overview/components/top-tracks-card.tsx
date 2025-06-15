import { Button } from "@repo/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card"
import { ButtonLink } from "@repo/ui/components/button-link"
import { ArrowRight } from "lucide-react"
import { Suspense } from "react"
import { ListSkeleton } from "~/components/list-skeleton"
import { RankingTracks } from "~/features/rankings/components/ranking-tracks"
import type { getRankingTracksData } from "~/features/rankings/data/ranking-tracks"

type TopTracksCardProps = {
    data?: Awaited<ReturnType<typeof getRankingTracksData>>;
    userId: string;
    isDemo: boolean;
}

export const TopTracksCard = async ({ data, userId, isDemo }: TopTracksCardProps) => {
    return (
        <Card className="col-span-1 pb-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1.5">
                    <CardTitle>Top Tracks</CardTitle>
                    <CardDescription>Top tracks you've listened to</CardDescription>
                </div>
                <ButtonLink href="/rankings/tracks" rightArrow={true} variant="outline">View All</ButtonLink>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<ListSkeleton length={5} />}>
                    <RankingTracks data={data} userId={userId} isDemo={isDemo} limit={5} />
                </Suspense>
            </CardContent>
        </Card>
    )
}