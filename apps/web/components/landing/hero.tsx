import { ArrowRight, GithubIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";

import { config } from "~/lib/config";

import { GetDemoBtn } from "../get-demo-btn";
import { Announcement } from "./announcement";
import { GetStartedBtn } from "./get-started-btn";
import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "./page-header";

export const Hero = () => {
	const isMaintenance = process.env.APP_MAINTENANCE === "true";

	return (
		<PageHeader>
			{/* <InteractiveGridPattern
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,rgba(255,255,255,0.8),transparent)]",
          "animate-appear-zoom opacity-0 delay-600",
        )}
        width={50}
        height={50}
        squares={[80, 80]}
        strokeDasharray={"4 2"}
        squaresClassName="hover:fill-chart-1"
      /> */}
			<Announcement className="z-10 animate-appear" />
			<div
				aria-hidden="true"
				className="-top-96 -translate-x-1/2 absolute start-1/2 flex max-w-full overflow-hidden"
			>
				<div className="-translate-x-40 h-[44rem] w-[25rem] max-w-full rotate-[-60deg] bg-gradient-to-r from-background/50 to-background blur-3xl" />
				<div className="-rotate-12 -translate-x-60 h-[50rem] w-[90rem] max-w-full origin-top-left rounded-full bg-gradient-to-tl from-primary-foreground via-primary-foreground to-background blur-3xl" />
			</div>
			<PageHeaderHeading className="animate-appear opacity-0 delay-100">
				Discover Your Listening Story
			</PageHeaderHeading>
			<PageHeaderDescription className=" animate-appear opacity-0 delay-200">
				Get statistics on your Spotify account. Upload your Spotify data and get
				insights on your listening habits and more detailed information about
				your account.
			</PageHeaderDescription>
			<PageActions className="animate-appear flex-col opacity-0 delay-300">
				<div className="flex items-center justify-center space-x-4">
					<GetStartedBtn>Get Started</GetStartedBtn>
					<Link
						target="\_blank"
						rel="noreferrer"
						href={config.githubRepo}
						className={cn("group", buttonVariants({ variant: "outline" }))}
					>
						<GithubIcon className="size-4" />
						Github
						<ArrowRight
							className="opacity-60 transition-transform group-hover:translate-x-0.5"
							size={16}
							strokeWidth={2}
							aria-hidden="true"
						/>
					</Link>
				</div>
				{!isMaintenance ? (
					<GetDemoBtn label="Get a demo of Harmony" className="mt-2" />
				) : null}
			</PageActions>
		</PageHeader>
	);
};
