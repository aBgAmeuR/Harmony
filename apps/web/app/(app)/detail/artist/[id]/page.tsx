import { type PropsWithChildren, Suspense } from "react";
import { auth } from "@repo/auth";
import { cn } from "@repo/ui/lib/utils";
import { ScrollArea } from "@repo/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";

import { AppHeader } from "~/components/app-header";

import { ArtistHeader } from "./components/artist-header";
import { ArtistHeaderSkeleton } from "./components/artist-header-skeleton";
import { ArtistStatsSummarySkeleton } from "./components/artist-stats-summary-skeleton";
import {
  ArtistListeningTrendsWrapper,
  ArtistStatsSummaryWrapper,
  QuickInsightsWrapper,
} from "./components/data-wrappers";
import { MonthlyTopTracksSkeleton } from "./components/monthly-top-tracks-skeleton";
import { MonthlyTopTracksWrapper } from "./components/monthly-top-tracks-wrapper";
import { QuickInsightsSkeleton } from "./components/quick-insights-skeleton";
import {
  TracksAlbumLists,
  TracksAlbumsListsSkeleton,
} from "./tracks-album-lists";

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
          {/* Artist Header with Stats */}
          <Suspense fallback={<ArtistHeaderSkeleton />}>
            <ArtistHeader artistId={id} userId={userId} />
          </Suspense>
        </Container>
        <div>
          {/* Main Content */}
          <Tabs defaultValue="overview" className="w-full">
            <div className="mb-4 py-1 border-y border-border">
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
              <Container className="space-y-8">
                <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                  <div className="space-y-6">
                    {/* Main Stats Summary */}
                    <Suspense fallback={<ArtistStatsSummarySkeleton />}>
                      <ArtistStatsSummaryWrapper
                        userId={userId}
                        artistId={id}
                      />
                    </Suspense>

                    {/* Top Tracks Preview */}
                    <ScrollArea className="rounded-lg border bg-card">
                      <div className="p-6">
                        <Suspense fallback={<TracksAlbumsListsSkeleton />}>
                          <TracksAlbumLists
                            artistId={id}
                            limitTracks={5}
                            limitAlbums={5}
                            sessionId={userId}
                          />
                        </Suspense>
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Quick Insights */}
                  <div className="space-y-6">
                    <Suspense fallback={<QuickInsightsSkeleton />}>
                      <QuickInsightsWrapper artistId={id} />
                    </Suspense>
                  </div>
                </div>
              </Container>
            </TabsContent>

            <TabsContent value="stats">
              <Container className="space-y-6">
                <Suspense>
                  <ArtistListeningTrendsWrapper userId={userId} artistId={id} />
                </Suspense>
              </Container>
            </TabsContent>

            {/* New Monthly Tracks Tab */}
            <TabsContent value="monthly-tracks">
              <Container className="space-y-6">
                <Suspense>
                  <MonthlyTopTracksWrapper artistId={id} userId={userId} />
                </Suspense>
              </Container>
            </TabsContent>

            <TabsContent value="catalog">
              <Container className="space-y-6">
                <Suspense>
                  <TracksAlbumLists artistId={id} sessionId={userId} showAll />
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
    <div className={cn("max-w-7xl w-full mx-auto px-4", className)}>
      {children}
    </div>
  );
};
