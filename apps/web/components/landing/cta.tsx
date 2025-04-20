import { Card, CardContent, CardFooter } from "@repo/ui/card";
import Balancer from "react-wrap-balancer";

import { GetDemoBtn } from "../get-demo-btn";
import { GetStartedBtn } from "./get-started-btn";

export const CTASection = () => {
	const isMaintenance = process.env.APP_MAINTENANCE === "true";

	return (
		<section className="animate-appear px-4 py-12 opacity-0 delay-1000 sm:py-16 md:py-20">
			<Card className="mx-auto w-full max-w-screen-xl p-8 lg:p-16">
				<CardContent className="grow text-center">
					<h2 className="mb-2 font-bold text-3xl">
						Unlock Your Musical Journey
					</h2>
					<h3 className="mb-0 px-4 text-lg text-muted-foreground">
						<Balancer>
							Discover insights about your listening habits, favorite artists,
							and musical evolution. Let Harmony bring your Spotify data to
							life.
						</Balancer>
					</h3>
				</CardContent>
				<CardFooter className="mt-2 flex justify-center pb-0">
					<GetStartedBtn size="lg">Get Started for Free</GetStartedBtn>
					{!isMaintenance ? (
						<GetDemoBtn
							label="Get a demo ->"
							className="w-fit"
							variant="link"
						/>
					) : null}
				</CardFooter>
			</Card>
		</section>
	);
};
