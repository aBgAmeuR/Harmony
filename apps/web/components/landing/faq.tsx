import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@repo/ui/accordion";

const items = [
	{
		id: "1",
		title: "How does Harmony access my Spotify data?",
		content:
			"Harmony uses the official Spotify Web API and the Spotify data package that users upload. We only request read-only permissions you explicitly grant: user-read-email (account linking), user-top-read (weekly charts), and user-read-recently-played (last 50 tracks). We never store personal information except the package you provide.",
	},
	{
		id: "2",
		title: "Is my data safe with Harmony?",
		content:
			"Absolutely. We take privacy very seriously. Harmony only accesses the Spotify data you explicitly grant permission for and does not store any personal information. Your data is stored in a secure PostgreSQL database with no third-party analytics services involved.",
	},
	{
		id: "3",
		title: "Can I use Harmony if I don't have a Spotify Premium account?",
		content:
			"Yes, Harmony works seamlessly with both Spotify Free and Premium accounts. There are no feature restrictions based on your subscription type.",
	},
	{
		id: "4",
		title: "How often is my data updated?",
		content:
			"Harmony automatically refreshes data from the Spotify Web API every hour for Top Artists, Top Tracks, and Recently Played sections. For richer metrics like long-term rankings and historical charts, you can upload your Spotify data package once per day.",
	},
	{
		id: "5",
		title: "What is the Spotify data package and why do I need it?",
		content:
			"The Extended Streaming History package provides lifetime streaming data that the public Spotify API doesn't expose. It's optional but unlocks advanced statistics like year-over-year trends, forgotten gems, and historical rankings. You can request it from Spotify's Privacy page and import it once per day.",
	},
	{
		id: "6",
		title: "Can I share my Harmony insights with friends?",
		content:
			"Yes! Harmony has a built-in sharing feature. You can create secure, time-limited shareable URLs from Settings → Sharing. These links allow friends to view your profile as read-only without signing up. You can manage up to 10 active links and revoke them at any time.",
	},
	{
		id: "7",
		title: "How do I revoke Harmony's access to my Spotify account?",
		content:
			"You can revoke Harmony's access at any time by visiting your Spotify Apps settings at spotify.com/account/apps/, locating 'Harmony' and clicking 'Remove Access'. You can also delete your Harmony account from Settings → Danger Zone to wipe all records within 24 hours.",
	},
];

export const FAQSection = () => {
	return (
		<div className="relative mx-auto min-h-screen w-full max-w-5xl lg:border-x">
			<div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t" />
			<div className="grid h-screen grid-cols-1 md:grid-cols-2">
				<div className="space-y-4 px-4 pt-12 pb-4 md:border-r">
					<h2 className="font-bold text-3xl md:text-4xl">FAQs</h2>
					<p className="text-muted-foreground">
						Here are some common questions and answers that you might encounter
						when using Harmony.
					</p>
				</div>
				<div className="place-content-center">
					<Accordion collapsible defaultValue="item-1" type="single">
						{items.map((item) => (
							<AccordionItem
								className="first:border-t last:border-b data-[state=open]:bg-card"
								key={item.id}
								value={item.id}
							>
								<AccordionTrigger className="px-4 py-4 text-[15px] leading-6 hover:no-underline">
									{item.title}
								</AccordionTrigger>
								<AccordionContent className="px-4 pb-4 text-muted-foreground">
									{item.content}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</div>
	);
}
