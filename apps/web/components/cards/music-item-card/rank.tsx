type MusicItemCardRankProps = {
	rank: number;
};

export const MusicItemCardRank = ({ rank }: MusicItemCardRankProps) => (
	<span className="w-6 text-right font-medium text-muted-foreground text-sm">
		{rank}
	</span>
);
