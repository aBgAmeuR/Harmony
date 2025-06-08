import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { CalendarDays, Clock } from "lucide-react";
import { getAlbumFirstLastListen } from "~/services/details/get-album-details";

interface AlbumFirstLastListenProps {
	albumId: string;
	userId?: string;
}

export async function AlbumFirstLastListen({
	albumId,
	userId,
}: AlbumFirstLastListenProps) {
	if (!userId) return null;
	const { firstListen, lastListen } = await getAlbumFirstLastListen(
		userId,
		albumId,
	);
	return (
		<Card className="border-blue-400/30 dark:bg-background/80">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-blue-400">
					<Clock className="size-5" /> First & Last Listen
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-row items-center justify-center gap-6 pt-4">
				<div className="flex flex-col items-center gap-1 text-center">
					<span className="font-semibold text-lg">
						{firstListen ? firstListen : "N/A"}
					</span>
					<span className="flex items-center gap-1 text-muted-foreground text-xs">
						<Clock className="size-4" /> First listen
					</span>
				</div>
				<div className="flex flex-col items-center gap-1 text-center">
					<span className="font-semibold text-lg">
						{lastListen ? lastListen : "N/A"}
					</span>
					<span className="flex items-center gap-1 text-muted-foreground text-xs">
						<CalendarDays className="size-4" /> Last listen
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
