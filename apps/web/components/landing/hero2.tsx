import { Button, buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { ArrowRight, ChevronRight, CirclePlay, GithubIcon } from "lucide-react";
import Link from "next/link";

import Image from "next/image";
import { GetDemoBtn } from "../get-demo-btn";
import { Announcement } from "./announcement";
import { GetStartedBtn } from "./get-started-btn";

export const Hero2 = () => {
	const isMaintenance = process.env.APP_MAINTENANCE === "true";

	return (
		<section className="bg-linear-to-b from-background to-background pb-20">
			<div className="relative py-36">
				<div className="relative z-10 mx-auto w-full max-w-5xl px-6">
					<div className="md:w-1/2">
						<div>
							<h1 className="max-w-md text-balance font-medium text-5xl md:text-6xl">
								Discover Your Listening Story
							</h1>
							<p className="my-8 max-w-2xl text-balance text-muted-foreground text-xl">
								Get statistics on your Spotify account. Get insights on your
								listening habits and more detailed information about your
								account.
							</p>

							<div className="flex items-center gap-3">
								<GetStartedBtn size="lg">Get Started</GetStartedBtn>
								{!isMaintenance ? <GetDemoBtn label="Get a demo" /> : null}
							</div>
						</div>

						<div className="mt-10">
							<p className="text-muted-foreground">Data collected from :</p>
							<div className="mt-2 grid max-w-sm grid-cols-3 gap-6">
								<div className="flex">
									<img
										className="h-5 w-fit invert-0 dark:invert"
										src="/images/spotify.svg"
										alt="Spotify Logo"
										height="20"
										width="auto"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="perspective-near md:-right-6 mt-24 max-w-5xl translate-x-12 md:absolute md:top-40 md:bottom-16 md:left-1/2 md:mt-0 md:translate-x-0">
					<div className="before:-inset-x-4 relative h-full before:absolute before:top-0 before:bottom-7 before:skew-x-6 before:rounded-[calc(var(--radius)+1rem)] before:border before:border-foreground/5 before:bg-foreground/5">
						<div className="-translate-y-12 relative h-full skew-x-6 overflow-hidden rounded-(--radius) border border-transparent bg-background shadow-foreground/10 shadow-md ring-1 ring-foreground/5">
							<Image
								src="/images/home.png"
								alt="app screen"
								width="1908"
								height="1064"
								className="size-full object-cover object-top-left"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
