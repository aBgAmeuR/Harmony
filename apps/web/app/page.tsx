import { CTASection } from "~/components/landing/cta";
import { FAQ } from "~/components/landing/faq";
import { FeaturesV2 } from "~/components/landing/features-v2";
import { Footer } from "~/components/landing/footer";
import { Header } from "~/components/landing/header";
import { Hero2 } from "~/components/landing/hero2";
import { ValueProps } from "~/components/landing/value-props";

export default async function HomePage() {
	return (
		<div className="dark flex h-full min-h-screen flex-col bg-background text-foreground">
			<Header />
			<Hero2 />
			<ValueProps />
			<FeaturesV2 />
			<FAQ />
			<CTASection />
			<Footer />
		</div>
	);
}
