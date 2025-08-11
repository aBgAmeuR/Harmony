import { ExternalLink } from "lucide-react";

type MusicItemCardContentProps = {
	item: {
		href: string;
		name: string;
		artists?: string;
		description?: React.ReactNode;
	};
};

export const MusicItemCardContent = ({ item }: MusicItemCardContentProps) => {
	return (
		<div className="flex-1">
			<div className="inline-flex flex-col gap-1">
				<a
					className="group flex w-auto cursor-pointer items-center gap-1"
					href={item.href}
					target="_blank"
					rel="noopener noreferrer"
				>
					<p className="line-clamp-2 break-all font-medium text-sm group-hover:underline">
						{item.name}
					</p>
					<ExternalLink className="hidden size-3 group-hover:block" />
					<span className="sr-only">Open in Spotify</span>
				</a>
				{item.artists && (
					<div className="flex items-center gap-1">
						<p className="line-clamp-2 break-all text-muted-foreground text-sm">
							{item.artists}
						</p>
						{item.description}
					</div>
				)}
			</div>
		</div>
	);
};
