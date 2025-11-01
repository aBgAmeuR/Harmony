import { GithubIcon } from "lucide-react";

import { Button } from "@repo/ui/button";

import { config } from "~/lib/config";

import { cn } from "@repo/ui/lib/utils";
import { Icons } from "../icons";
import Link from "next/link";
import { CopyrightYear } from "../copyright-year";

export const FooterSection = () => {
	const resources = [
		{
			title: "Documentation",
			href: "/docs",
		},
		{
			title: "Changelog",
			href: "/changelog",
		},
		{
			title: "Github",
			href: config.githubRepo,
		},
	];

	const socialLinks = [
		{
			icon: GithubIcon,
			link: config.githubRepo,
		},
	];

	return (
		<footer className="relative mx-auto flex w-full max-w-5xl flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-4 py-6 md:rounded-t-6xl md:px-6">
			<div className="-translate-x-1/2 -translate-y-1/2 absolute top-0 right-1/2 left-1/2 h-px w-1/3 rounded-full bg-primary/20 blur" />

			<div className="flex w-full justify-between">
				<div className="space-y-3">
					<Link
						href="/"
						className="flex items-center gap-2 font-bold text-xl"
					>
						<Icons.logo className="size-8" />
						Harmony
					</Link>
					<p className="text-muted-foreground text-sm">
						&copy; <CopyrightYear /> Harmony, All rights reserved
					</p>
					<div className="flex gap-2">
						{socialLinks.map((item, index) => (
							<Button
								key={`social-${item.link}-${index}`}
								size="icon-sm"
								variant="outline"
							>
								<a href={item.link} target="_blank">
									<item.icon className="size-3.5" />
								</a>
							</Button>
						))}
					</div>
				</div>

				<div>
					<span className="text-muted-foreground text-xs">Resources</span>
					<div className="mt-2 flex flex-col gap-2">
						{resources.map(({ href, title }) => (
							<a
								className="w-max text-sm hover:underline"
								href={href}
								key={title}
							>
								{title}
							</a>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
};
