"use client";

import type * as React from "react";
import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@repo/ui/button";

export function ThemeToggle(props: React.ComponentProps<typeof Button>) {
	const { setTheme, theme } = useTheme();

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
			aria-label="Toggle theme"
			{...props}
		>
			<SunMedium
				className="dark:-rotate-90 rotate-0 scale-100 transition-all dark:scale-0"
				size={18}
			/>
			<Moon
				className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				size={18}
			/>
		</Button>
	);
}
