import {
	BarChart2,
	Calendar,
	Code,
	Database,
	Github,
	Heart,
	ImageIcon,
	Info,
	Milestone,
	Music,
	Shield,
	Users,
} from "lucide-react";

import { Badge } from "@repo/ui/badge";
import { buttonVariants } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { cn } from "@repo/ui/lib/utils";

import { AppHeader } from "~/components/app-header";
import { Icons } from "~/components/icons";
import { config } from "~/lib/config";

export default async function SettingsAboutPage() {
	return (
		<>
			<AppHeader items={["Settings", "About"]} />
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<div className="mx-auto flex w-full max-w-screen-xl flex-col gap-4">
					<Card>
						<CardContent className="flex items-center gap-6">
							<Icons.logo className="size-20" />
							<div>
								<h1 className="mb-2 font-bold text-2xl">About Harmony</h1>
								<p className="text-lg text-muted-foreground">
									Your personal music insights powered by{" "}
									<a
										href="https://spotify.com"
										target="_blank"
										rel="noopener noreferrer"
										className="underline transition-colors hover:text-primary"
									>
										Spotify
										<Icons.spotify className="ml-1 inline size-4" />
									</a>
								</p>
							</div>
						</CardContent>
					</Card>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Info className="size-5 text-primary" /> App Information
								</CardTitle>
							</CardHeader>

							<CardContent className="pt-2">
								<p className="mb-4">
									Harmony is an open-source application that generates
									comprehensive statistics from your Spotify data plan,
									providing insights into your listening habits and music
									preferences.
								</p>

								<div className="mb-4 flex items-center gap-2">
									<span className="text-muted-foreground">Version</span>
									<span className="font-medium">{config.appVersion}</span>
									<Badge>Stable</Badge>
								</div>

								<a
									href={config.githubRepo}
									className={cn(buttonVariants({ variant: "secondary" }))}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Github className="size-4" />
									View on GitHub
								</a>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Shield className="size-5 text-primary" /> Privacy
								</CardTitle>
							</CardHeader>

							<CardContent className="pt-2">
								<p className="mb-4">
									We take your privacy seriously. Harmony only accesses the
									Spotify data you explicitly grant permission for and does not
									store any personal information.
								</p>
								<ul className="space-y-2 text-muted-foreground text-sm">
									<li className="flex items-start gap-2">
										<span className="mt-0.5 rounded-full bg-green-500/20 p-1 text-primary">
											<Shield className="h-3 w-3" />
										</span>
										No personal data stored
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-0.5 rounded-full bg-green-500/20 p-1 text-primary">
											<Shield className="h-3 w-3" />
										</span>
										Secure OAuth authentication
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-0.5 rounded-full bg-green-500/20 p-1 text-primary">
											<Shield className="h-3 w-3" />
										</span>
										Transparent data usage
									</li>
								</ul>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Music className="size-5 text-primary" /> Features
							</CardTitle>
						</CardHeader>

						<CardContent className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 md:grid-cols-3">
							<FeatureCard
								icon={<BarChart2 className="size-5 text-primary" />}
								title="Top Tracks Analysis"
								description="Discover your most played tracks and artists with detailed statistics"
							/>
							<FeatureCard
								icon={<Calendar className="size-5 text-primary" />}
								title="Listening History"
								description="View your recently played tracks with timestamps and patterns"
							/>
							<FeatureCard
								icon={<Users className="size-5 text-primary" />}
								title="Artist Comparisons"
								description="Compare listening stats between different artists"
							/>
							<FeatureCard
								icon={<Database className="size-5 text-primary" />}
								title="Detailed Rankings"
								description="Get rankings for tracks, albums, and artists based on your listening habits"
							/>
							<FeatureCard
								icon={<Heart className="size-5 text-primary" />}
								title="Favorite Genres"
								description="Visualize your music taste with genre distribution charts"
							/>
							<FeatureCard
								icon={<Milestone className="size-5 text-primary" />}
								title="Listening Milestones"
								description="Track your journey with listening milestones and achievements"
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Code className="size-5 text-primary" /> Content Guidelines
							</CardTitle>
						</CardHeader>

						<CardContent className="mt-2 space-y-4">
							<ContentSection
								icon={<Database className="h-5 w-5 text-primary" />}
								title="Metadata"
								description="All metadata displayed in Harmony (artist names, track titles, album information) is sourced directly from Spotify's API. We ensure accurate attribution and maintain the integrity of the original metadata."
							/>

							<ContentSection
								icon={<ImageIcon className="h-5 w-5 text-primary" />}
								title="Cover Art"
								description="Album and playlist artwork displayed in Harmony is sourced directly from Spotify. All cover art remains the property of the respective rights holders and is displayed in accordance with Spotify's Developer Terms."
							/>
						</CardContent>
					</Card>

					<div className="p-4 text-center text-muted-foreground text-sm">
						<p>
							Harmony is not affiliated with Spotify AB. Spotify is a trademark
							of Spotify AB.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}

interface FeatureCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
	return (
		<div className="rounded-lg bg-secondary p-4">
			<div className="mb-2 flex items-center gap-3">
				{icon}
				<h3 className="font-medium text-foreground">{title}</h3>
			</div>
			<p className="text-muted-foreground text-sm">{description}</p>
		</div>
	);
}

interface ContentSectionProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

function ContentSection({ icon, title, description }: ContentSectionProps) {
	return (
		<div>
			<div className="mb-1 flex items-center gap-3">
				{icon}
				<h3 className="font-medium text-foreground text-lg">{title}</h3>
			</div>
			<p className="mb-4 text-muted-foreground text-sm">{description}</p>
		</div>
	);
}
