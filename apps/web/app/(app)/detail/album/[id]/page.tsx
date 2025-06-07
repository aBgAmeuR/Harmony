import { auth } from "@repo/auth";
import { cn } from "@repo/ui/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { type PropsWithChildren, Suspense } from "react";

import { AppHeader } from "~/components/app-header";

import { getAlbumDetails } from "~/services/details/get-album-details";
import { AlbumCharts } from "./components/album-charts";
import { AlbumHeader, AlbumHeaderSkeleton } from "./components/album-header";
import { AlbumInsights } from "./components/album-insights";
import { AlbumListeningStats } from "./components/album-listening-stats";
import { AlbumTracklist } from "./components/album-tracklist";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function DetailAlbumPage({ params }: PageProps) {
	const { id } = await params;
	const session = await auth();
	const userId = session?.user?.id;

	const albumData = await getAlbumDetails({ albumId: id, userId });

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
					<Tabs defaultValue="overview" className="w-full">
						<div className="mb-4 border-border border-y py-1">
							<Container>
								<TabsList className="bg-transparent">
									<TabsTrigger
										value="overview"
										className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
									>
										Overview
									</TabsTrigger>
									<TabsTrigger
										value="tracklist"
										className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
									>
										Tracklist
									</TabsTrigger>
									<TabsTrigger
										value="stats"
										className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
									>
										Statistics
									</TabsTrigger>
									<TabsTrigger
										value="insights"
										className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
									>
										Insights
									</TabsTrigger>
								</TabsList>
							</Container>
						</div>

						<TabsContent value="overview">
							<Container className="space-y-6">
								<div>
									<h1 className="mb-2 font-bold text-2xl">Album Overview</h1>
									<p className="text-muted-foreground">
										Detailed information about this album including release
										details, popularity, and your listening statistics.
									</p>
								</div>
								<Suspense>
									{albumData.globalStats && (
										<AlbumListeningStats
											globalStats={albumData.globalStats}
											favoriteTrack={albumData.favoriteTrack}
											monthlyTrend={albumData.monthlyTrend}
										/>
									)}
								</Suspense>
							</Container>
						</TabsContent>

						<TabsContent value="tracklist">
							<Container className="space-y-6">
								<AlbumTracklist tracklist={albumData.tracklist} />
							</Container>
						</TabsContent>

						<TabsContent value="stats">
							<Container className="space-y-6">
								<Suspense>
									{albumData.globalStats && (
										<AlbumListeningStats
											globalStats={albumData.globalStats}
											favoriteTrack={albumData.favoriteTrack}
											monthlyTrend={albumData.monthlyTrend}
											detailed={true}
										/>
									)}
								</Suspense>
								<AlbumCharts
									hoursData={albumData.hoursData.filter(
										(d: any): d is { hour: string; msPlayed: number } =>
											typeof d.hour === "string",
									)}
									daysData={albumData.daysData.filter(
										(d: any): d is { day: string; msPlayed: number } =>
											typeof d.day === "string",
									)}
								/>
							</Container>
						</TabsContent>

						<TabsContent value="insights">
							<Container className="space-y-6">
								<Suspense>
									<AlbumInsights insights={albumData.insights as any} />
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
