import { auth } from "@repo/auth";
import { cn } from "@repo/ui/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { type PropsWithChildren, Suspense } from "react";

import { AppHeader } from "~/components/app-header";

import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";
import { notFound } from "next/navigation";
import {
	getAlbumTracksWithStats,
	getListeningTrends,
} from "~/services/details/get-album-details";
import { AlbumFirstLastListen } from "./components/album-first-last-listen";
import { AlbumHeader, AlbumHeaderSkeleton } from "./components/album-header";
import { AlbumListeningTrends } from "./components/album-listening-trends";
import { AlbumStats } from "./components/album-stats";
import { AlbumStatsSkeleton } from "./components/album-stats-skeleton";
import { AlbumStreaks } from "./components/album-streaks";
import { AlbumStreaksSkeleton } from "./components/album-streaks-skeleton";
import { AlbumTracks } from "./components/album-tracks";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function DetailAlbumPage({ params }: PageProps) {
	const { id } = await params;
	const session = await auth();
	const userId = session?.user?.id;

	if (!userId) {
		notFound();
	}

	return (
		<>
			<AppHeader items={["Detail", "Album"]} />
			<div className="flex flex-col gap-8 py-4">
				<Container>
					<Suspense fallback={<AlbumHeaderSkeleton />}>
						<AlbumHeader albumId={id} userId={userId} />
					</Suspense>
				</Container>
				<div>
					<Tabs defaultValue="stats" className="w-full">
						<div className="mb-4 border-border border-y py-1">
							<Container>
								<TabsList className="bg-transparent">
									<TabsTrigger
										value="stats"
										className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
									>
										Statistics
									</TabsTrigger>
									<TabsTrigger
										value="tracks"
										className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
									>
										Tracks
									</TabsTrigger>
									<TabsTrigger
										value="trends"
										className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
									>
										Listening Trends
									</TabsTrigger>
								</TabsList>
							</Container>
						</div>

						<TabsContent value="stats">
							<Container className="space-y-6">
								<Suspense fallback={<AlbumStatsSkeleton />}>
									<AlbumStats albumId={id} userId={userId} />
								</Suspense>
								<div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
									<Suspense fallback={null}>
										<AlbumStreaks albumId={id} userId={userId} />
										<AlbumFirstLastListen albumId={id} userId={userId} />
									</Suspense>
								</div>
							</Container>
						</TabsContent>

						<TabsContent value="tracks">
							<Container className="space-y-6">
								<Suspense>
									<AlbumTracks data={getAlbumTracksWithStats(userId, id)} />
								</Suspense>
							</Container>
						</TabsContent>

						<TabsContent value="trends">
							<Container className="space-y-6">
								<Suspense>
									<AlbumListeningTrends data={getListeningTrends(userId, id)} />
								</Suspense>
							</Container>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</>
	);
}

const Container = ({
	children,
	className,
}: PropsWithChildren<{
	className?: string;
}>) => {
	return (
		<div className={cn("mx-auto w-full max-w-7xl px-4", className)}>
			{children}
		</div>
	);
};
