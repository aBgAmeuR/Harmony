import type * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link, { type LinkProps } from "next/link";

import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";

interface LinkButtonProps
	extends LinkProps,
		VariantProps<typeof buttonVariants>,
		Omit<React.ComponentProps<"a">, keyof LinkProps> {
	disabled?: boolean;
	leftArrow?: boolean;
	rightArrow?: boolean;
}

function LinkButton({
	className,
	variant,
	size,
	href,
	disabled,
	children,
	leftArrow,
	rightArrow,
	...props
}: LinkButtonProps) {
	return (
		<Link
			href={!disabled ? href : ""}
			className={cn(
				"group",
				buttonVariants({ variant, size, className }),
				disabled && "pointer-events-none opacity-50",
			)}
			aria-disabled={disabled}
			tabIndex={disabled ? -1 : undefined}
			data-slot="link-button"
			{...props}
		>
			{leftArrow && (
				<ArrowLeftIcon
					className="group-hover:-translate-x-0.5 size-4 transition-transform"
					strokeWidth={2}
					aria-hidden="true"
				/>
			)}
			{children}
			{rightArrow && (
				<ArrowRightIcon
					className="size-4 transition-transform group-hover:translate-x-0.5"
					strokeWidth={2}
					aria-hidden="true"
				/>
			)}
		</Link>
	);
}

export { LinkButton };
