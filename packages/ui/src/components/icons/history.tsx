"use client";

import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import type { Transition, Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";

import { cn } from "@repo/ui/lib/utils";

import type { AnimIconHandle, AnimIconType } from "./type";

const arrowTransition: Transition = {
	type: "spring",
	stiffness: 250,
	damping: 25,
};

const arrowVariants: Variants = {
	normal: {
		rotate: "0deg",
	},
	animate: {
		rotate: "-50deg",
	},
};

const handTransition: Transition = {
	duration: 0.6,
	ease: [0.4, 0, 0.2, 1],
};

const handVariants: Variants = {
	normal: {
		rotate: 0,
		originX: "50%",
		originY: "50%",
	},
	animate: {
		rotate: -360,
	},
};

const minuteHandTransition: Transition = {
	duration: 0.5,
	ease: "easeInOut",
};

const minuteHandVariants: Variants = {
	normal: {
		rotate: 0,
		originX: "50%",
		originY: "50%",
	},
	animate: {
		rotate: -45,
	},
};

const HistoryIcon = forwardRef<AnimIconHandle, AnimIconType>(
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
					"flex cursor-pointer select-none items-center justify-center rounded-md p-2 transition-colors duration-200 hover:bg-accent",
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
					<motion.g
						transition={arrowTransition}
						variants={arrowVariants}
						animate={controls}
					>
						<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
						<path d="M3 3v5h5" />
					</motion.g>
					<motion.line
						x1="12"
						y1="12"
						x2="12"
						y2="7"
						variants={handVariants}
						animate={controls}
						initial="normal"
						transition={handTransition}
					/>
					<motion.line
						x1="12"
						y1="12"
						x2="16"
						y2="14"
						variants={minuteHandVariants}
						animate={controls}
						initial="normal"
						transition={minuteHandTransition}
					/>
				</svg>
			</div>
		);
	},
);

HistoryIcon.displayName = "HistoryIcon";

export { HistoryIcon };
