import { BarChart2, Calendar, type LucideIcon, Music, Share2, Shield, Star } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { cn } from "@repo/ui/lib/utils";

import { ThemeImage } from "../theme-image";

type BentoItem = {
	title: string;
	description: string;
	icon: LucideIcon;
	className: string;
	content?: React.ReactNode;
};

const items: BentoItem[] = [
	{
		title: "Music Insights",
		description: "Top songs, artists, and albums",
		icon: Music,
		className: "md:col-span-3 md:row-span-2",
		content: (
			<ThemeImage
				darkSrc="/images/ranking-dark.png"
				lightSrc="/images/ranking-light.png"
				alt="Top songs, artists, albums"
				height={160 * 2}
				width={313 * 2}
				className="h-full w-full rounded-lg object-cover"
			/>
		),
	},
	{
		title: "Listening History",
		description: "Timeline & trends",
		icon: Calendar,
		className: "md:col-span-3 md:row-span-1",
		content: (
			<ThemeImage
				darkSrc="/images/activity-dark.png"
				lightSrc="/images/activity-light.png"
				alt="Listening history"
				height={160 * 2}
				width={227 * 2}
				className="h-full w-full rounded-lg object-cover"
			/>
		),
	},
	{
		title: "Advanced Statistics",
		description: "Deep‑dive charts (time‑of‑day, streaks)",
		icon: BarChart2,
		className: "md:col-span-2 md:row-span-1",
		content: (
			<ThemeImage
				darkSrc="/images/listening-habits-dark.png"
				lightSrc="/images/listening-habits-light.png"
				alt="Advanced statistics"
				height={160 * 2}
				width={269 * 2}
				className="h-full w-full rounded-lg object-cover"
			/>
		),
	},
	{
		title: "Rankings",
		description: "By play count or time played",
		icon: Star,
		className: "md:col-span-2 md:row-span-1",
	},
	{
		title: "Privacy‑first",
		description: "Read‑only permissions",
		icon: Shield,
		className: "md:col-span-2 md:row-span-1",
	},
	{
		title: "Share Links",
		description: "Secure, time‑limited",
		icon: Share2,
		className: "md:col-span-2 md:row-span-1",
	},
];

export function Features() {
	return (
		<section className="px-4 py-16 sm:py-20">
			<div className="mx-auto w-full max-w-6xl">
				<h2 className="mb-8 text-center font-bold text-2xl tracking-tight md:text-3xl">
					Features
				</h2>

				<div className="grid grid-cols-1 gap-4 md:auto-rows-[160px] md:grid-cols-6">
					{items.map((item, idx) => (
						<Card key={idx} className={cn("gap-2 overflow-hidden transition-colors duration-200 hover:bg-card/40", item.className)}>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<item.icon className="size-4 text-foreground/80" strokeWidth={1.25} />
									{item.title}
								</CardTitle>
								<CardDescription>{item.description}</CardDescription>
							</CardHeader>
							<CardContent>{item.content}</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
