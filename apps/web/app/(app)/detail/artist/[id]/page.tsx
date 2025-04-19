import { auth } from "@repo/auth";
import { cn } from "@repo/ui/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { type PropsWithChildren, Suspense } from "react";

import { AppHeader } from "~/components/app-header";

import {
	getArtistDetails,
	getArtistListeningTrends,
} from "~/actions/get-artist-stats-action";
import { getMonthlyTopTracks } from "~/services/details/get-monthly-top-tracks";
import { ArtistHeader, ArtistHeaderSkeleton } from "./components/artist-header";
import { ArtistListeningTrends } from "./components/artist-listening-trends";
import { MonthlyTopTracks } from "./components/monthly-top-tracks";
import { TracksAlbumLists } from "./tracks-album-lists";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function DetailArtistPage({ params }: PageProps) {
	const { id } = await params;
	const session = await auth();
	const userId = session?.user?.id;

	return (
		<>
			<AppHeader items={["Detail", "Artist"]} />
			<div className="flex flex-col gap-8 py-4">
				<Container>
					<Suspense fallback={<ArtistHeaderSkeleton />}>
						<ArtistHeader artistId={id} userId={userId} />
					</Suspense>
				</Container>
				<div>
					<Tabs defaultValue="overview" className="w-full">
						<div className="mb-4 border-border border-y py-1">
							<Container>
								<TabsList className="bg-transparent ">
									<TabsTrigger
										value="overview"
										className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
									>
										Overview
									</TabsTrigger>
									<TabsTrigger
										value="stats"
										className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
									>
										Statistics
									</TabsTrigger>
									<TabsTrigger
										value="monthly-tracks"
										className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
									>
										Monthly Tracks
									</TabsTrigger>
									<TabsTrigger
										value="catalog"
										className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
									>
										Catalog
									</TabsTrigger>
								</TabsList>
							</Container>
						</div>

						<TabsContent value="overview">
							<Container className="space-y-6">
								<h1 className="font-bold text-2xl">Overview</h1>
								<p className="text-muted-foreground">
									Here you can find an overview of the artist's statistics and
									information.
								</p>
							</Container>
						</TabsContent>

						<TabsContent value="stats">
							<Container className="space-y-6">
								<Suspense>
									<ArtistListeningTrends
										stats={getArtistListeningTrends(userId, id)}
									/>
								</Suspense>
							</Container>
						</TabsContent>

						<TabsContent value="monthly-tracks">
							<Container className="space-y-6">
								<Suspense>
									<MonthlyTopTracks
										dataPromise={getMonthlyTopTracks(userId, id, 5)}
										artistNamePromise={getArtistDetails(id).then(
											(artist) => artist?.name,
										)}
									/>
								</Suspense>
							</Container>
						</TabsContent>

						<TabsContent value="catalog">
							<Container className="space-y-6">
								<Suspense>
									<TracksAlbumLists
										artistId={id}
										sessionId={userId}
										showAll={true}
									/>
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
