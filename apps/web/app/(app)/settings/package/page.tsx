import { Clock, Layers, LineChart, Sparkles } from "lucide-react";

import { getUser } from "@repo/auth";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@repo/ui/card";
import { cn } from "@repo/ui/lib/utils";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";

import { Client } from "./client";
import { DocsModal } from "./docs-modal";
import { HistoryModal } from "./history-modal";
import { DemoStep } from "./steps-components/demo-step";

export default async function SettingsPackagePage() {
	const { isDemo } = await getUser();

	return (
		<Layout>
			<LayoutHeader items={["Settings", "Package"]} />
			<LayoutContent className="items-center justify-center">
				<div>
					<div className="mb-8 text-center">
						<h1 className="mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text font-bold text-3xl text-transparent">
							Upload Your Spotify Data
						</h1>
						<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
							Transform your listening history into beautiful insights and
							discover your unique music journey through interactive
							visualizations.
						</p>
					</div>

					<FeatureShowcase className="mb-6" />

					<Card>
						<CardHeader className="mb-4">
							<CardTitle>Upload Your Spotify Data Package</CardTitle>
							<CardDescription>
								Please upload your Spotify data package to generate your
								listening stats.
							</CardDescription>
						</CardHeader>

						{isDemo ? <DemoStep /> : <Client />}

						<CardFooter className="mt-2 justify-between">
							<DocsModal />
							<HistoryModal />
						</CardFooter>
					</Card>
				</div>
			</LayoutContent>
		</Layout>
	);
}

const FeatureShowcase = ({ className }: { className?: string }) => {
	return (
		<div className={cn("grid gap-3 sm:grid-cols-2", className)}>
			<Card className="flex-row gap-2 p-4">
				<div className="flex size-8 min-w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
					<LineChart className="size-4" />
				</div>
				<div>
					<CardTitle>Track your listening patterns</CardTitle>
					<CardDescription>
						See how your music taste evolves over time with beautiful
						visualizations.
					</CardDescription>
				</div>
			</Card>
			<Card className="flex-row gap-2 p-4">
				<div className="flex size-8 min-w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
					<Sparkles className="size-4" />
				</div>
				<div>
					<CardTitle>Discover hidden gems</CardTitle>
					<CardDescription>
						Uncover forgotten favorites and tracks you've loved but rarely play.
					</CardDescription>
				</div>
			</Card>
			<Card className="flex-row gap-2 p-4">
				<div className="flex size-8 min-w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
					<Layers className="size-4" />
				</div>
				<div>
					<CardTitle>Compare artists and genres</CardTitle>
					<CardDescription>
						See which artists and genres dominate your listening habits.
					</CardDescription>
				</div>
			</Card>
			<Card className="flex-row gap-2 p-4">
				<div className="flex size-8 min-w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
					<Clock className="size-4" />
				</div>
				<div>
					<CardTitle>View your all-time top tracks</CardTitle>
					<CardDescription>
						Get insights into your most played songs and artists.
					</CardDescription>
				</div>
			</Card>
		</div>
	);
};
