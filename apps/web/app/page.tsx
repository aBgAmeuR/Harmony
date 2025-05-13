import { CTASection } from "~/components/landing/cta";
import { Demo } from "~/components/landing/demo";
import { FAQ } from "~/components/landing/faq";
import { Features } from "~/components/landing/features";
import { Footer } from "~/components/landing/footer";
import { Header } from "~/components/landing/header";
import { Hero2 } from "~/components/landing/hero2";

export default async function HomePage() {
	return (
		<div className="flex h-full min-h-screen flex-col">
			<Header />
			{/* <Navbar /> */}
			<Hero2 />
			<Demo />
			<Features />
			<FAQ />
			<CTASection />
			<Footer />
			{/* <main className="overflow-hidden">
				
			</main> */}
		</div>
	);
}
