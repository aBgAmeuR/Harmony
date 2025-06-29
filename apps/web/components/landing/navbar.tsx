import { Github } from "lucide-react";
import Link from "next/link";

import { Button } from "@repo/ui/button";

import { GetDemoBtn } from "../get-demo-btn";
import { Icons } from "../icons";
import { ThemeToggle } from "../theme-toggle";
import { GetStartedBtn } from "./get-started-btn";

export const Navbar = () => {
	const isMaintenance = process.env.APP_MAINTENANCE === "true";

	return (
		<header className="-mb-4 top-0 z-50 px-4 pb-4">
			<div className="fade-bottom absolute left-0 h-24 w-full" />
			<div className="relative mx-auto max-w-screen-xl">
				<nav className="flex items-center justify-between py-4">
					<nav className="flex items-center justify-start gap-4">
						<Link
							href="/"
							className="flex items-center gap-2 font-bold text-xl"
						>
							<Icons.logo className="size-8" />
							Harmony
						</Link>
						<div className="hidden gap-2 sm:flex">
							<Button
								variant="ghost"
								size="icon"
								aria-label="View on Github"
								asChild={true}
							>
								<Link
									href="https://github.com/aBgAmeuR/Harmony"
									target="_blank"
								>
									<Github />
								</Link>
							</Button>
							<ThemeToggle />
						</div>
					</nav>
					<nav className="flex items-center justify-end gap-4">
						{!isMaintenance ? (
							<GetDemoBtn label="Get Demo" variant="link" />
						) : null}
						<GetStartedBtn>Get Started</GetStartedBtn>
					</nav>
				</nav>
			</div>
		</header>
	);
};
