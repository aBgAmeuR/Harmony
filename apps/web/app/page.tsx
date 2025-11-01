import { ClosingCTASection } from "~/components/landing/closing-cta";
import { FAQSection } from "~/components/landing/faq";
import { FeaturesSection } from "~/components/landing/features";
import { Features2 } from "~/components/landing/features2";
import { Features3Section } from "~/components/landing/features3";
import { FooterSection } from "~/components/landing/footer";
import { HeaderSection } from "~/components/landing/header";
import { HeroSection } from "~/components/landing/hero";
import { ValuePropsSection } from "~/components/landing/value-props";

export default async function HomePage() {
	return (
		<div className="dark flex h-full min-h-screen flex-col bg-background text-foreground">
			<HeaderSection />
			<HeroSection />
			<Features3Section />
			<Features2 />
			<FAQSection />
			<ClosingCTASection />
			<FooterSection />
		</div>
	);
}
