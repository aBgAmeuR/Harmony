import Image from "next/image";
import Balancer from "react-wrap-balancer";

import { GetDemoBtn } from "../get-demo-btn";
import { GetStartedBtn } from "./get-started-btn";

export const HeroSection = () => {
	const isMaintenance = process.env.APP_MAINTENANCE === "true";

	return (
		<section className="relative overflow-hidden bg-gradient-to-b from-background to-green-100 dark:to-green-900">
			<div className="relative mx-auto w-full max-w-5xl px-6 pt-24 text-center sm:pt-32 md:pt-48">
				<h1 className="mx-auto max-w-md text-balance font-extrabold text-2xl leading-[1.05] tracking-tight sm:max-w-xl sm:text-3xl md:max-w-4xl md:text-4xl lg:text-5xl xl:text-6xl">
					<Balancer>
						Elevate Your Music Analytics with <span className="text-primary">Harmony</span>
					</Balancer>
				</h1>
				<Balancer className="mx-auto mt-4 max-w-2xl text-balance text-base text-muted-foreground/90 leading-relaxed md:mt-5 md:text-lg">
					Streamline, analyze, and share your listening insights with our open-source Spotify dashboard.
				</Balancer>

				<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
					<GetStartedBtn variant="gradient" size="lg" className="border-foreground/80 from-foreground/90 to-foreground px-4 text-secondary hover:border-foreground hover:from-foreground hover:to-foreground">Get Started</GetStartedBtn>
					{!isMaintenance ? (
						<GetDemoBtn label="View Demo" />
					) : null}
				</div>

				<div className="mx-auto mt-2 w-full max-w-5xl translate-y-12">
					<div className="rounded-2xl border border-foreground/10 bg-card shadow-2xl ring-5 ring-foreground/10">
						<Image
							src="/images/home.png"
							alt="Harmony dashboard"
							width={1908}
							height={1064}
							className="h-auto w-full rounded-2xl object-cover"
							priority={true}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};
