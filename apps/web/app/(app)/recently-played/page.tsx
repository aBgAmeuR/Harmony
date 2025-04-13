import { Main } from "@repo/ui/components/main";
import { AppHeader } from "~/components/app-header";
import { MusicList } from "~/components/lists/music-list";

export default function RecentlyPlayedPage() {
  return (
    <>
      <AppHeader items={["Stats", "Recently Played"]} />
      <Main>
        <MusicList type="recentlyPlayed" />
      </Main>
    </>
  );
}
