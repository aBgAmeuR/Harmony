import { ClosingCTA } from "~/components/landing/closing-cta";
import { FAQ } from "~/components/landing/faq";
import { Features } from "~/components/landing/features";
import { Footer } from "~/components/landing/footer";
import { Header } from "~/components/landing/header";
import { Hero2 } from "~/components/landing/hero2";
import { HowItWorks } from "~/components/landing/how-it-works";
import { PrivacySecurity } from "~/components/landing/privacy-security";
import { ValueProps } from "~/components/landing/value-props";

export default async function HomePage() {
	return (
		<div className="dark flex h-full min-h-screen flex-col bg-background text-foreground">
			<Header />
			<Hero2 />
			<ValueProps />
			<Features />
			<HowItWorks />
			<PrivacySecurity />
			<FAQ />
			<ClosingCTA />
			<Footer />
		</div>
	);
}
