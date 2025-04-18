import { AccordionIcons } from "@repo/ui/components/accordion-icons";
import { Music, RefreshCw, Share2, Shield, Zap } from "lucide-react";

const items = [
	{
		id: "1",
		icon: Music,
		title: "How does Harmony access my Spotify data?",
		content:
			"Harmony uses the official Spotify Web API and the Spotify data package that users upload. We only request the permissions you explicitly grant, and we never store your personal information except your package that you provided to us.",
	},
	{
		id: "2",
		icon: Shield,
		title: "Is my data safe with Harmony?",
		content:
			"Absolutely. We take privacy very seriously. Harmony only accesses the Spotify data you explicitly grant permission for and does not store any personal information.",
	},
	{
		id: "3",
		icon: Zap,
		title: "Can I use Harmony if I don't have a Spotify Premium account?",
		content:
			"Yes, Harmony works seamlessly with both Spotify Free and Premium accounts. There are no restrictions on using the app regardless of your account type.",
	},
	{
		id: "4",
		icon: RefreshCw,
		title: "How often is my data updated?",
		content:
			"Harmony fetches the latest Spotify data every 30 minutes via the Spotify Web API. Additionally, you can upload your Spotify data package once a day for even more detailed insights.",
	},
	{
		id: "5",
		icon: Share2,
		title: "Can I share my Harmony insights with friends?",
		content:
			"Currently, Harmony doesn't have a built-in sharing feature. However, you can take screenshots of your insights to share with friends. We're exploring the possibility of adding a sharing feature in future updates!",
	},
];

export function FAQ() {
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
