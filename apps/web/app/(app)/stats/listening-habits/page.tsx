import { AppHeader } from "~/components/app-header";
import { SelectMonthRange } from "~/components/select-month-range";
import { StatCard } from "./components/stat-card";
import { auth } from "@repo/auth";
import { extractUserInfo } from "~/lib/utils";
import { HoursHabitChart } from "./hours-habit-chart";
import {
  getDaysHabit,
  getHoursHabit,
  getShuffleHabit,
  getSkippedHabit,
  getTopPlatforms,
} from "./get-charts-data";
import { DaysHabitChart } from "./days-habit-chart";
import { TopPlatformChart } from "./top-platform-chart";
import { ShuffleHabitChart } from "./shuffle-habit-chart";
import { SkippedHabitChart } from "./skipped-habit-chart";

export default async function StatsListeningHabitsPage() {
  const session = await auth();
  const { userId, isDemo } = extractUserInfo(session);

  return (
    <>
      <AppHeader items={["Package", "Stats", "Listening Habits"]}>
        <SelectMonthRange />
      </AppHeader>
      <main className="flex flex-col lg:flex-row p-4 gap-4 max-w-6xl w-full mx-auto">
        <div className="flex flex-col flex-1 gap-4">
          <StatCard
            title="Listening Hours"
            description="Time spent listening to music"
            skeletonClassName="aspect-video w-full"
          >
            <HoursHabitChart data={getHoursHabit(userId, isDemo)} />
          </StatCard>
          <StatCard
            title="Listening Days"
            description="Days you listened to music"
            skeletonClassName="aspect-video w-full"
          >
            <DaysHabitChart data={getDaysHabit(userId, isDemo)} />
          </StatCard>
        </div>
        <div className="flex justify-center flex-wrap md:justify-start lg:flex-nowrap lg:flex-col gap-4">
          <StatCard
            title="Top Platforms"
            description="Most used platforms"
            skeletonClassName="h-[240px] w-[240px]"
          >
            <TopPlatformChart data={getTopPlatforms(userId, isDemo)} />
          </StatCard>
          <StatCard
            title="Shuffle Habits"
            description="Shuffle habits"
            skeletonClassName="h-[160px] w-[240px]"
          >
            <ShuffleHabitChart data={getShuffleHabit(userId, isDemo)} />
          </StatCard>
          <StatCard
            title="Skipped Tracks"
            description="Tracks you skipped"
            skeletonClassName="h-[160px] w-[240px]"
          >
            <SkippedHabitChart data={getSkippedHabit(userId, isDemo)} />
          </StatCard>
        </div>
      </main>
    </>
  );
}
