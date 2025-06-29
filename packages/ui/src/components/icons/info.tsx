"use client";

import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";

import { cn } from "@repo/ui/lib/utils";

import type { AnimIconHandle, AnimIconType } from "./type";

const pathVariants: Variants = {
	normal: {
		opacity: 1,
		pathLength: 1,
		pathOffset: 0,
		transition: {
			duration: 1,
			opacity: { duration: 0.1 },
		},
	},
	animate: {
		opacity: [0, 1],
		pathLength: [0, 1],
		pathOffset: [1, 0],
		transition: {
			duration: 1,
			ease: "linear",
			opacity: { duration: 0.1 },
		},
	},
};

const circleVariants: Variants = {
	normal: {
		opacity: 1,
		pathLength: 1,
		pathOffset: 0,
		transition: {
			duration: 0.6,
			opacity: { duration: 0.1 },
		},
	},
	animate: {
		opacity: [0, 1],
		pathLength: [0, 1],
		pathOffset: [1, 0],
		transition: {
			duration: 0.6,
			ease: "linear",
			opacity: { duration: 0.1 },
		},
	},
};

const InfoIcon = forwardRef<AnimIconHandle, AnimIconType>(
	({ onMouseEnter, onMouseLeave, className, size = 16, ...props }, ref) => {
		const pathControls = useAnimation();
		const circleControls = useAnimation();

		const isControlledRef = useRef(false);

		useImperativeHandle(ref, () => {
			isControlledRef.current = true;

			return {
				startAnimation: () => {
					pathControls.start("animate");
					circleControls.start("animate");
				},
				stopAnimation: () => {
					pathControls.start("normal");
					circleControls.start("normal");
				},
			};
		});

		const handleMouseEnter = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlledRef.current) {
					pathControls.start("animate");
					circleControls.start("animate");
				} else {
					onMouseEnter?.(e);
				}
			},
			[circleControls, onMouseEnter, pathControls],
		);

		const handleMouseLeave = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlledRef.current) {
					pathControls.start("normal");
					circleControls.start("normal");
				} else {
					onMouseLeave?.(e);
				}
			},
			[pathControls, circleControls, onMouseLeave],
		);

		return (
			<div
				className={cn(className)}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				{...props}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					viewBox="0 0 24 24"
				>
					<motion.path
						variants={pathVariants}
						initial="normal"
						animate={pathControls}
						d="M12 16v-4"
					/>
					<motion.path
						variants={pathVariants}
						initial="normal"
						animate={pathControls}
						d="M12 8h.01"
					/>
					<motion.circle
						variants={circleVariants}
						initial="normal"
						animate={circleControls}
						cx="12"
						cy="12"
						r="10"
					/>
				</svg>
			</div>
		);
	},
);

InfoIcon.displayName = "InfoIcon";

export { InfoIcon };
