import { BarChart2, Calendar, Music } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui/card";
import { cn } from "@repo/ui/lib/utils";

import { ThemeImage } from "../theme-image";

const features = [
	{
		title: "Music Insights",
		description:
			"Discover your most played songs, artists, albums and analyze your music preferences.",
		icon: Music,
		component: (
			<ThemeImage
				darkSrc="/images/ranking-dark.png"
				lightSrc="/images/ranking-light.png"
				alt="Top songs, artists, albums"
				height={160 * 2}
				width={313 * 2}
				className="w-full"
			/>
		),
		delay: "delay-300",
	},
	{
		title: "Listening History",
		description:
			"Visualize your listening history and track how your taste evolves over time.",
		icon: Calendar,
		component: (
			<ThemeImage
				darkSrc="/images/activity-dark.png"
				lightSrc="/images/activity-light.png"
				alt="Listening History"
				height={160 * 2}
				width={227 * 2}
				className="w-full"
			/>
		),
		delay: "delay-700",
	},
	{
		title: "Advanced Statistics",
		description:
			"Dive deep into your listening patterns with advanced analytics and visualizations.",
		icon: BarChart2,
		component: (
			<ThemeImage
				darkSrc="/images/listening-habits-dark.png"
				lightSrc="/images/listening-habits-light.png"
				alt="Listening Habits"
				height={160 * 2}
				width={269 * 2}
				className="w-full"
			/>
		),
		delay: "delay-600",
	},
] as const;

export function Features() {
	return (
		<section className="px-4 py-12 sm:py-16 md:py-20">
			<div className="mx-auto w-full max-w-screen-xl">
				<h2 className="mb-12 animate-appear text-center font-bold text-2xl opacity-0 delay-200 md:text-3xl">
					Discover Harmony's Features
				</h2>
				<div className="grid grid-cols-1 justify-items-center gap-6 md:grid-cols-3">
					{features.map((feature, index) => (
						<Card
							key={index}
							className={cn(
								"flex w-full flex-col overflow-hidden",
								feature.delay,
								"animate-appear opacity-0",
							)}
						>
							<CardHeader className="pb-1">
								<feature.icon className="size-4" strokeWidth={1} />
							</CardHeader>
							<CardContent className="grow text-left">
								<h3 className="mb-1 font-semibold text-lg">{feature.title}</h3>
								<p className="text-muted-foreground leading-snug">
									{feature.description}
								</p>
							</CardContent>
							<CardFooter className="justify-end pr-0 pb-0">
								<div className="h-40 w-full overflow-hidden rounded-tl-md bg-background p-px">
									{feature.component}
								</div>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
