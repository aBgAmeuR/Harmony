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
		<footer className="relative">
			<div
				className={cn(
					"mx-auto max-w-5xl lg:border-x",
					"dark:bg-[radial-gradient(35%_80%_at_30%_0%,--theme(--color-foreground/.1),transparent)]"
				)}
			>
				<div className="absolute inset-x-0 h-px w-full bg-border" />
				<div className="flex justify-between max-w-5xl gap-6 p-4 sm:flex-row flex-col">
					<div className="flex flex-col gap-3">
						<Link
							href="/"
							className="flex items-center gap-2 font-bold text-xl"
						>
							<Icons.logo className="size-8" />
							Harmony
						</Link>
						<p className="max-w-sm text-balance font-mono text-muted-foreground text-sm">
							A comprehensive music analytics platform.
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
				<div className="absolute inset-x-0 h-px w-full bg-border" />
				<div className="flex max-w-4xl flex-col justify-between gap-2 py-4">
					<p className="text-center font-light text-muted-foreground text-sm">
						&copy; <CopyrightYear /> Harmony, All rights reserved
					</p>
				</div>
			</div>
		</footer>
	);
};
