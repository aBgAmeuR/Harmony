import { Lock, Music, Package, RefreshCw, Share2, Shield, Zap } from "lucide-react";

import { AccordionIcons } from "@repo/ui/components/accordion-icons";

const items = [
	{
		id: "1",
		icon: Music,
		title: "How does Harmony access my Spotify data?",
		content:
			"Harmony uses the official Spotify Web API and the Spotify data package that users upload. We only request read-only permissions you explicitly grant: user-read-email (account linking), user-top-read (weekly charts), and user-read-recently-played (last 50 tracks). We never store personal information except the package you provide.",
	},
	{
		id: "2",
		icon: Shield,
		title: "Is my data safe with Harmony?",
		content:
			"Absolutely. We take privacy very seriously. Harmony only accesses the Spotify data you explicitly grant permission for and does not store any personal information. Your data is stored in a secure PostgreSQL database with no third-party analytics services involved.",
	},
	{
		id: "3",
		icon: Zap,
		title: "Can I use Harmony if I don't have a Spotify Premium account?",
		content:
			"Yes, Harmony works seamlessly with both Spotify Free and Premium accounts. There are no feature restrictions based on your subscription type.",
	},
	{
		id: "4",
		icon: RefreshCw,
		title: "How often is my data updated?",
		content:
			"Harmony automatically refreshes data from the Spotify Web API every hour for Top Artists, Top Tracks, and Recently Played sections. For richer metrics like long-term rankings and historical charts, you can upload your Spotify data package once per day.",
	},
	{
		id: "5",
		icon: Package,
		title: "What is the Spotify data package and why do I need it?",
		content:
			"The Extended Streaming History package provides lifetime streaming data that the public Spotify API doesn't expose. It's optional but unlocks advanced statistics like year-over-year trends, forgotten gems, and historical rankings. You can request it from Spotify's Privacy page and import it once per day.",
	},
	{
		id: "6",
		icon: Share2,
		title: "Can I share my Harmony insights with friends?",
		content:
			"Yes! Harmony has a built-in sharing feature. You can create secure, time-limited shareable URLs from Settings → Sharing. These links allow friends to view your profile as read-only without signing up. You can manage up to 10 active links and revoke them at any time.",
	},
	{
		id: "7",
		icon: Lock,
		title: "How do I revoke Harmony's access to my Spotify account?",
		content:
			"You can revoke Harmony's access at any time by visiting your Spotify Apps settings at spotify.com/account/apps/, locating 'Harmony' and clicking 'Remove Access'. You can also delete your Harmony account from Settings → Danger Zone to wipe all records within 24 hours.",
	},
];

export const FAQSection = () => {
	return (
		<section className="px-4 py-12 sm:py-16 md:py-20">
			<div className="mx-auto w-full max-w-3xl">
				<h2 className="mb-8 animate-appear text-center font-bold text-2xl opacity-0 delay-500 sm:mb-10 md:mb-12 md:text-3xl">
					Frequently Asked Questions
				</h2>
				<AccordionIcons
					items={items}
					className="animate-appear opacity-0 delay-500"
				/>
			</div>
		</section>
	);
}
