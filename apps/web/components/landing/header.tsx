"use client";
import { Button } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Icons } from "../icons";

const menuItems = [
	{ name: "Features", href: "#link" },
	{ name: "Pricing", href: "#link" },
	{ name: "About", href: "#link" },
];

export const Header = () => {
	const [menuState, setMenuState] = React.useState(false);
	const [isScrolled, setIsScrolled] = React.useState(false);

	React.useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	return (
		<header>
			<nav
				data-state={menuState && "active"}
				className={cn(
					"fixed z-20 w-full transition-all duration-300",
					isScrolled &&
						"border-black/5 border-b bg-background/75 backdrop-blur-lg",
				)}
			>
				<div className="mx-auto max-w-5xl px-6">
					<div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0">
						<div className="flex w-full justify-between gap-6 lg:w-auto">
							<Link
								href="/"
								className="flex items-center gap-2 font-bold text-xl"
							>
								<Icons.logo className="size-8" />
								Harmony
							</Link>

							<button
								onClick={() => setMenuState(!menuState)}
								aria-label={menuState === true ? "Close Menu" : "Open Menu"}
								className="-m-2.5 -mr-4 relative z-20 block cursor-pointer p-2.5 lg:hidden"
							>
								<Menu className="m-auto size-6 in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 duration-200" />
								<X className="-rotate-180 absolute inset-0 m-auto size-6 in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 scale-0 in-data-[state=active]:opacity-100 opacity-0 duration-200" />
							</button>

							<div className="m-auto hidden size-fit lg:block">
								<ul className="flex gap-1">
									{menuItems.map((item, index) => (
										<li key={index}>
											<Button asChild={true} variant="ghost" size="sm">
												<Link href={item.href} className="text-base">
													<span>{item.name}</span>
												</Link>
											</Button>
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="mb-6 in-data-[state=active]:block hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border bg-background p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:in-data-[state=active]:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
							<div className="lg:hidden">
								<ul className="space-y-6 text-base">
									{menuItems.map((item, index) => (
										<li key={index}>
											<Link
												href={item.href}
												className="block text-muted-foreground duration-150 hover:text-accent-foreground"
											>
												<span>{item.name}</span>
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
								<Button
									asChild={true}
									variant="ghost"
									size="sm"
									className={cn(isScrolled && "lg:hidden")}
								>
									<Link href="#">
										<span>Login</span>
									</Link>
								</Button>
								<Button
									asChild={true}
									size="sm"
									className={cn(isScrolled && "lg:hidden")}
								>
									<Link href="#">
										<span>Sign Up</span>
									</Link>
								</Button>
								<Button
									asChild={true}
									size="sm"
									className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
								>
									<Link href="#">
										<span>Get Started</span>
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};
