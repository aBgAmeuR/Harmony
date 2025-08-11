import { CTASection } from "~/components/landing/cta";
import { FAQ } from "~/components/landing/faq";
import { Features } from "~/components/landing/features";
import { Footer } from "~/components/landing/footer";
import { Header } from "~/components/landing/header";
import { Hero2 } from "~/components/landing/hero2";
import { ScrollFeatures } from "~/components/landing/scroll-features";
import { ValueProps } from "~/components/landing/value-props";

export default async function HomePage() {
	return (
		<div className="flex h-full min-h-screen flex-col">
			<Header />
			<Hero2 />
			<ValueProps />
			<Features />
			<ScrollFeatures />
			<FAQ />
			<CTASection />
			<Footer />
		</div>
	);
}
