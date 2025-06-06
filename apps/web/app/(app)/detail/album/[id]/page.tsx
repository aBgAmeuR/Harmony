import { auth } from "@repo/auth";
import { cn } from "@repo/ui/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { type PropsWithChildren, Suspense } from "react";

import { AppHeader } from "~/components/app-header";

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
									<h1 className="mb-2 text-2xl font-bold">Album Overview</h1>
									<p className="text-muted-foreground">
										Detailed information about this album including release
										details, popularity, and your listening statistics.
									</p>
								</div>
								<Suspense>
									<AlbumListeningStats albumId={id} userId={userId} />
								</Suspense>
							</Container>
						</TabsContent>

						<TabsContent value="tracklist">
							<Container className="space-y-6">
								<Suspense>
									<AlbumTracklist albumId={id} userId={userId} />
								</Suspense>
							</Container>
						</TabsContent>

						<TabsContent value="stats">
							<Container className="space-y-6">
								<Suspense>
									<AlbumListeningStats
										albumId={id}
										userId={userId}
										detailed={true}
									/>
								</Suspense>
							</Container>
						</TabsContent>

						<TabsContent value="insights">
							<Container className="space-y-6">
								<Suspense>
									<AlbumInsights albumId={id} userId={userId} />
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
