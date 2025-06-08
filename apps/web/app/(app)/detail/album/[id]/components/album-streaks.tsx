import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { CalendarDays, Flame } from "lucide-react";
import { getAlbumListeningStreaks } from "~/services/details/get-album-details";

interface AlbumStreaksProps {
	albumId: string;
	userId?: string;
}

export async function AlbumStreaks({ albumId, userId }: AlbumStreaksProps) {
	if (!userId) return null;
	const { maxStreak, totalDays } = await getAlbumListeningStreaks(
		userId,
		albumId,
	);
	return (
		<Card className="border-orange-400/30 dark:bg-background/80">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-orange-400">
					<Flame className="size-5" /> Listening Streaks
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-row items-center justify-center gap-6 pt-4">
				<div className="flex flex-col items-center">
					<span className="font-extrabold text-4xl text-orange-400">
						{maxStreak}
					</span>
					<span className="flex items-center gap-1 text-muted-foreground text-xs">
						<Flame className="size-4" /> Longest streak
					</span>
				</div>
				<div className="flex flex-col items-center">
					<span className="font-bold text-3xl">{totalDays}</span>
					<span className="flex items-center gap-1 text-muted-foreground text-xs">
						<CalendarDays className="size-4" /> Unique days
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
