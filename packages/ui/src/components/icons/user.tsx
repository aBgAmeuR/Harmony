"use client";

import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { motion, useAnimation, type Variants } from "motion/react";

import { cn } from "@repo/ui/lib/utils";

import type { AnimIconHandle, AnimIconType } from "./type";

const pathVariant: Variants = {
	normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
	animate: {
		pathLength: [0, 1],
		opacity: [0, 1],
		pathOffset: [1, 0],
	},
};

const circleVariant: Variants = {
	normal: {
		pathLength: 1,
		pathOffset: 0,
		scale: 1,
	},
	animate: {
		pathLength: [0, 1],
		pathOffset: [1, 0],
		scale: [0.5, 1],
	},
};

const UserIcon = forwardRef<AnimIconHandle, AnimIconType>(
	({ onMouseEnter, onMouseLeave, className, size = 16, ...props }, ref) => {
		const controls = useAnimation();
		const isControlledRef = useRef(false);

		useImperativeHandle(ref, () => {
			isControlledRef.current = true;

			return {
				startAnimation: () => controls.start("animate"),
				stopAnimation: () => controls.start("normal"),
			};
		});

		const handleMouseEnter = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlledRef.current) {
					controls.start("animate");
				} else {
					onMouseEnter?.(e);
				}
			},
			[controls, onMouseEnter],
		);

		const handleMouseLeave = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlledRef.current) {
					controls.start("normal");
				} else {
					onMouseLeave?.(e);
				}
			},
			[controls, onMouseLeave],
		);
		return (
			<div
				className={cn(
					`flex cursor-pointer select-none items-center justify-center rounded-md p-2 transition-colors duration-200 hover:bg-accent`,
					className,
				)}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				{...props}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<motion.circle
						cx="12"
						cy="8"
						r="5"
						animate={controls}
						variants={circleVariant}
					/>

					<motion.path
						d="M20 21a8 8 0 0 0-16 0"
						variants={pathVariant}
						transition={{
							delay: 0.2,
							duration: 0.4,
						}}
						animate={controls}
					/>
				</svg>
			</div>
		);
	},
);

UserIcon.displayName = "UserIcon";

export { UserIcon };
