import { Github } from "lucide-react";

import { Button } from "@repo/ui/button";
import { LinkButton } from "@repo/ui/components/link-button";

import { config } from "~/lib/config";

import { GetDemoBtn } from "../get-demo-btn";
import { ThemeToggle } from "../theme-toggle";
import { GetStartedBtn } from "./get-started-btn";

export const FooterSection = () => {
	const isMaintenance = process.env.APP_MAINTENANCE === "true";

	return (
		<footer className="w-full bg-background px-4 pt-4">
			<div className="mx-auto w-full max-w-screen-xl">
				<div className="bg-background pb-4 text-foreground">
					<div className="flex flex-col items-center justify-between gap-4 border-t pt-4 text-muted-foreground text-xs sm:flex-col md:flex-row">
						<p>
							Built by{" "}
							<LinkButton href={config.developer.github} target="_blank" variant="link" className="p-0">
								{config.developer.name}
							</LinkButton>{" "}
							- <span className="text-muted-foreground">v{config.appVersion}</span>
						</p>
						<div className="flex items-center gap-1">
							<GetStartedBtn
								variant="ghost"
								size="sm"
								className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
							>
								Get Started
							</GetStartedBtn>
							{!isMaintenance ? (
								<GetDemoBtn
									label="Get Demo"
									variant="ghost"
									size="sm"
									className="px-3"
								/>
							) : null}
							<p className="mx-2">|</p>
							<LinkButton
								href={config.githubRepo}
								target="_blank"
								variant="ghost"
								size="icon"
								aria-label="View on Github"
							>
								<Github />
							</LinkButton>
							<ThemeToggle />
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};
