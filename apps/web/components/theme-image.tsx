"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import type { VariantProps } from "@repo/ui/lib/utils";

import { useMounted } from "~/hooks/use-mounted";

type ThemeImageProps = {
	lightSrc: string;
	darkSrc: string;
	className?: string;
} & Omit<VariantProps<typeof Image>, "src">;

export const ThemeImage = ({
	lightSrc,
	darkSrc,
	className,
	...props
}: ThemeImageProps) => {
	const { theme, systemTheme } = useTheme();
	const isMounted = useMounted();

	const isDark =
		theme === "dark" || (theme === "system" && systemTheme === "dark");

	if (!isMounted) return null;

	return (
		<Image src={isDark ? darkSrc : lightSrc} className={className} {...props} />
	);
};
