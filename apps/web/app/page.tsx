import { ClosingCTASection } from "~/components/landing/closing-cta";
import { FAQSection } from "~/components/landing/faq";
import { FeaturesSection } from "~/components/landing/features";
import { FooterSection } from "~/components/landing/footer";
import { HeaderSection } from "~/components/landing/header";
import { HeroSection } from "~/components/landing/hero";
import { HowItWorksSection } from "~/components/landing/how-it-works";
import { PrivacySecuritySection } from "~/components/landing/privacy-security";
import { ValuePropsSection } from "~/components/landing/value-props";

export default async function HomePage() {
	return (
		<div className="dark flex h-full min-h-screen flex-col bg-background text-foreground">
			<HeaderSection />
			<HeroSection />
			<ValuePropsSection />
			<FeaturesSection />
			<HowItWorksSection />
			<PrivacySecuritySection />
			<FAQSection />
			<ClosingCTASection />
			<FooterSection />
		</div>
	);
}
