'use client';

import { cn } from '@repo/ui/lib/utils';
import { motion, useAnimation, Variants } from 'motion/react';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { AnimIconHandle, AnimIconType } from './type';

const lineVariants: Variants = {
  visible: { pathLength: 1, opacity: 1 },
  hidden: { pathLength: 0, opacity: 0 },
};

const ListOrderedIcon = forwardRef<AnimIconHandle, AnimIconType>(
  ({ onMouseEnter, onMouseLeave, className, size = 16, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: async () => {
          await controls.start((i) => ({
            pathLength: 0,
            opacity: 0,
            transition: { delay: i * 0.1, duration: 0.3 },
          }));
          await controls.start((i) => ({
            pathLength: 1,
            opacity: 1,
            transition: { delay: i * 0.1, duration: 0.3 },
          }));
        },
        stopAnimation: () => controls.start('visible'),
      };
    });

    const handleMouseEnter = useCallback(
      async (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          await controls.start((i) => ({
            pathLength: 0,
            opacity: 0,
            transition: { delay: i * 0.1, duration: 0.3 },
          }));
          await controls.start((i) => ({
            pathLength: 1,
            opacity: 1,
            transition: { delay: i * 0.1, duration: 0.3 },
          }));
        } else {
          onMouseEnter?.(e);
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start('normal');
        } else {
          onMouseLeave?.(e);
        }
      },
      [controls, onMouseLeave]
    );

    return (
      <div
        className={cn(
          `cursor-pointer select-none hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center`,
          className
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
          <motion.path
            variants={lineVariants}
            initial="visible"
            animate={controls}
            custom={0}
            d="M10 6h11"
          />
          <motion.path
            variants={lineVariants}
            initial="visible"
            animate={controls}
            custom={1}
            d="M10 12h11"
          />
          <motion.path
            variants={lineVariants}
            initial="visible"
            animate={controls}
            custom={2}
            d="M10 18h11"
          />
          <motion.path
            initial="visible"
            animate={controls}
            custom={1}
            d="M4 10h2"
          />
          <motion.path
            initial="visible"
            animate={controls}
            custom={1}
            d="M4 6h1v4"
          />
          <motion.path
            initial="visible"
            animate={controls}
            custom={0}
            d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"
          />
        </svg>
      </div>
    );
  }
);

ListOrderedIcon.displayName = 'ListOrderedIcon';

export { ListOrderedIcon };