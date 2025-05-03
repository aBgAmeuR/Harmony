'use client';

import { cn } from '@repo/ui/lib/utils';
import type { Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { AnimIconHandle, AnimIconType } from './type';

const pathVariants: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    pathOffset: 0,
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [1, 0],
    transition: {
      duration: 0.6,
      ease: 'linear',
      opacity: { duration: 0.1 },
    },
  },
};

const polylineVariants: Variants = {
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
      duration: 0.6,
      ease: 'linear',
      opacity: { duration: 0.1 },
    },
  },
};



const PackageIcon = forwardRef<AnimIconHandle, AnimIconType>(
  ({ onMouseEnter, onMouseLeave, className, size = 16, ...props }, ref) => {
    const pathControls = useAnimation();
    const polylineControls = useAnimation();

    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => {
          pathControls.start('animate');
          polylineControls.start('animate');
        },
        stopAnimation: () => {
          pathControls.start('normal');
          polylineControls.start('normal');
        },
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          pathControls.start('animate');
          polylineControls.start('animate');
        } else {
          onMouseEnter?.(e);
        }
      },
      [polylineControls, onMouseEnter, pathControls]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          pathControls.start('normal');
          polylineControls.start('normal');
        } else {
          onMouseLeave?.(e);
        }
      },
      [pathControls, polylineControls, onMouseLeave]
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
            d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"
          />
          <motion.path
            variants={pathVariants}
            initial="normal"
            animate={pathControls}
            d="M12 22V12"
          />
          <motion.polyline
            variants={polylineVariants}
            initial="normal"
            animate={polylineControls}
            points="3.29 7 12 12 20.71 7"
          />
          <motion.path
            variants={pathVariants}
            initial="normal"
            animate={pathControls}
            d="m7.5 4.27 9 5.15"
          />
        </svg>
      </div>
    );
  }
);

PackageIcon.displayName = 'PackageIcon';

export { PackageIcon };