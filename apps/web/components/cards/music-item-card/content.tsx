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
	const nameContent = (
		<>
			<p className="line-clamp-2 break-all text-sm font-medium group-hover:underline">
				{item.name}
			</p>
			<ExternalLink className="size-3 hidden group-hover:block" />
			<span className="sr-only">Open in Spotify</span>
		</>
	);
	return (
		<div className="flex-1">
			<div className="inline-flex flex-col gap-1">
				<a
					className="group flex gap-1 cursor-pointer w-auto items-center"
					href={item.href}
					target="_blank"
					rel="noopener noreferrer"
				>
					{nameContent}
				</a>
				{item.artists && (
					<div className="flex items-center gap-1">
						<p className="line-clamp-2 break-all text-sm text-muted-foreground">
							{item.artists}
						</p>
						{item.description}
					</div>
				)}
			</div>
		</div>
	);
};
