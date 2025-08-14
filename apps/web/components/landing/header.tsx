import Link from "next/link";

import { LinkButton } from "@repo/ui/components/link-button";

import { config } from "~/lib/config";

import { Icons } from "../icons";

const menuItems = [
	{ name: "Github", href: config.githubRepo },
	{ name: "Docs", href: "/docs" },
];

export const Header = () => {
	return (
		<header>
			<nav className="fixed z-20 w-full border-black/5 border-b bg-background/75 backdrop-blur-lg">
				<div className="mx-auto max-w-5xl px-6">
					<div className="relative flex items-center justify-between gap-0 gap-6 py-3">
						<Link
							href="/"
							className="flex items-center gap-2 font-bold text-xl"
						>
							<Icons.logo className="size-8" />
							Harmony
						</Link>
						<ul className="hidden flex-1 gap-2 sm:inline-flex">
							{menuItems.map((item, index) => (
								<li key={index}>
									<LinkButton href={item.href} variant="ghost" size="sm">
										<span>{item.name}</span>
									</LinkButton>
								</li>
							))}
						</ul>

						<div className="hidden gap-2 min-[400px]:flex">
							<LinkButton href="#" variant="ghost" size="sm">
								<span>View Demo</span>
							</LinkButton>
							<LinkButton href="#" variant="gradient" size="sm" className="border-primary/90 from-primary/70 to-primary/80 hover:border-primary hover:from-primary/80 hover:to-primary/90">
								<span>Get Started</span>
							</LinkButton>
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};
