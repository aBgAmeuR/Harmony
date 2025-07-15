import { Github, } from "lucide-react";

import { LinkButton } from "@repo/ui/components/link-button";

import { Icons } from "~/components/icons";
import { Layout, LayoutHeader } from "~/components/layouts/layout";


export default async function SettingsAboutPage() {
	return (
		<Layout>
			<LayoutHeader items={["Settings", "About"]} />
			<div className="container mx-auto max-w-2xl px-6 py-12">
				<div className="mb-8 text-center">
					<div className="flex items-center gap-4">
						<Icons.logo className="size-16" />
						<h1 className="font-bold text-3xl">Harmony</h1>
					</div>
				</div>

				<div className="space-y-8">
					<section className="space-y-4">
						<h2 className="font-medium text-xl">About</h2>
						<div className="space-y-3">
							<p>
								Harmony is an open-source application that transforms your Spotify
								listening data into meaningful insights about your music preferences
								and habits.
							</p>
							<p>
								Discover your top tracks, explore listening patterns, and gain
								deeper understanding of your musical journey.
							</p>
						</div>
					</section>

					<section className="space-y-4">
						<h2 className="font-medium text-xl">Features</h2>
						<ul className="grid list-inside list-disc gap-2 text-sm">
							<li>Top tracks and artists analysis</li>
							<li>Listening history and patterns</li>
							<li>Artist comparisons and rankings</li>
							<li>Detailed rankings for tracks, albums, and artists</li>
							<li>Charts and visualizations for your listening habits</li>
						</ul>
					</section>

					<section className="space-y-4">
						<h2 className="font-medium text-xl">Privacy</h2>
						<div className="space-y-2 text-sm">
							<p>
								Your privacy is our priority. Harmony only accesses the Spotify
								data you explicitly permit and stores no personal information.
							</p>
							<p>
								All data remains secure through OAuth authentication and
								transparent usage policies.
							</p>
						</div>
					</section>

					<section className="space-y-4">
						<h2 className="font-medium text-xl">Links</h2>
						<div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
							<LinkButton
								variant="outline"
								size="sm"
								href="https://github.com/aBgAmeuR/Harmony"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Github className="size-4" />
								Source Code
							</LinkButton>
							<LinkButton
								variant="outline"
								size="sm"
								href="https://spotify.com"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icons.spotify className="size-4" />
								Spotify
							</LinkButton>
						</div>
					</section>
				</div>

				<div className="mt-16 border-t pt-8 text-center">
					<p className="text-muted-foreground text-sm">
						Harmony is not affiliated with Spotify AB.
					</p>
				</div>
			</div>
		</Layout>
	);
}
