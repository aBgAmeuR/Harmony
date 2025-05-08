import { buttonVariants } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { cn } from "@repo/ui/lib/utils";
import { BarChart3, Clock, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { Icons } from "~/components/icons";

export const UserHasNotPackage = () => {
	return (
		<div className="flex h-full items-center justify-center">
			<Card className="w-full max-w-5xl overflow-hidden py-0">
				<div className="grid h-full grid-cols-1 lg:grid-cols-2">
					<div className="flex flex-col bg-card p-5 sm:p-6 md:p-8">
						<div className="mb-4 md:mb-6">
							<h1 className="font-bold text-xl tracking-tight sm:text-2xl">
								Unlock Your Music Journey
							</h1>
							<p className="mt-2 text-muted-foreground text-sm sm:text-base">
								Upload your Spotify data package to discover insights about your
								listening habits
							</p>
						</div>

						<div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
							<FeatureCard
								icon={<BarChart3 className="h-5 w-5 text-primary" />}
								title="Listening Analytics"
								description="Visualize your music consumption patterns over time"
							/>
							<FeatureCard
								icon={<Trophy className="h-5 w-5 text-primary" />}
								title="Top Artists & Tracks"
								description="Discover your most played music across different time periods"
							/>
							<FeatureCard
								icon={<Clock className="h-5 w-5 text-primary" />}
								title="Listening History"
								description="Track your complete listening journey through the years"
							/>
							<FeatureCard
								icon={<Sparkles className="h-5 w-5 text-primary" />}
								title="Personalized Insights"
								description="Get unique perspectives on your music preferences"
							/>
						</div>
					</div>

					<div className="flex flex-col items-center justify-center bg-muted/30 p-5 text-center sm:p-6 md:p-8">
						<Icons.logo className="mb-4 size-12 lg:size-20" />

						<h2 className="mb-2 font-semibold text-lg sm:text-xl">
							Ready to explore your music data?
						</h2>
						<p className="mb-6 max-w-xs text-muted-foreground text-sm sm:mb-8">
							Upload your Spotify data package to unlock all features and
							discover your unique music profile
						</p>

						<Link
							href="/settings/package"
							className={cn(
								buttonVariants({ size: "lg" }),
								"mb-4 w-full max-w-xs",
							)}
						>
							Upload Spotify Package
						</Link>

						<div className="text-muted-foreground text-xs sm:text-sm">
							<p className="mb-1">Don't have your Spotify data yet?</p>
							<Link
								href="/settings/package"
								className={cn(buttonVariants({ variant: "link" }))}
							>
								Learn how to download your data
							</Link>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="flex h-full flex-col rounded-lg bg-muted/30 p-3 sm:p-4">
			<div className="mb-2 flex-shrink-0">{icon}</div>
			<h3 className="mb-1 font-medium text-xs sm:text-sm">{title}</h3>
			<p className="line-clamp-3 text-muted-foreground text-xs">
				{description}
			</p>
		</div>
	);
}
