'use client';

import { cn } from '@repo/ui/lib/utils';
import { motion, useAnimation } from 'motion/react';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { AnimIconHandle, AnimIconType } from './type';

const Disc3Icon = forwardRef<AnimIconHandle, AnimIconType>(
  ({ onMouseEnter, onMouseLeave, className, size = 16, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => controls.start('animate'),
        stopAnimation: () => controls.start('normal'),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start('animate');
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
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          animate={controls}
          variants={{
            normal: {
              rotate: 0,
            },
            animate: {
              rotate: -360,
              transition: {
                duration: 3,
                ease: 'linear',
                repeat: Infinity,
              },
            },
          }}
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="2" />
          <path d="M6 12c0-1.7.7-3.2 1.8-4.2" />
          <path d="M18 12c0 1.7-.7 3.2-1.8 4.2" />
        </motion.svg>
      </div>
    );
  }
);

Disc3Icon.displayName = 'Disc3Icon';

export { Disc3Icon };
