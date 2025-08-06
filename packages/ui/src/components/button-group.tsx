"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@repo/ui/lib/utils";

const buttonGroupVariants = cva(
	"flex items-center [&>*:focus-within]:ring-1 [&>*:focus-within]:z-10 [&>*]:ring-offset-0 [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none",
	{
		variants: {
			size: {
				default: "[&>*]:h-10 [&>*]:px-4 [&>*]:py-2",
				sm: "[&>*]:h-8 [&>*]:rounded-md [&>*]:px-3",
				lg: "[&>*]:h-11 [&>*]:rounded-md [&>*]:px-8",
				icon: "[&>*]:h-10 [&>*]:w-10",
			},
			separated: {
				true: "[&>*]:outline [&>*]:outline-1 [&>*]:outline-zinc-500 gap-0.5 [&>*:focus-within]:ring-offset-2",
				false: "[&>*:focus-within]:ring-offset-1",
			},
		},
		defaultVariants: {
			separated: false,
			size: "default",
		},
	},
);

export interface ButtonGroupProps
	extends React.HTMLAttributes<HTMLDivElement>,
	VariantProps<typeof buttonGroupVariants> {
	separated?: boolean;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
	({ children, className, size, separated = false, ...props }, ref) => {
		return (
			<div
				className={cn(buttonGroupVariants({ size, className, separated }))}
				ref={ref}
				{...props}
			>
				{children}
			</div>
		);
	},
);
ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };
