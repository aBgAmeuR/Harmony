"use client";

import * as ScrollAreaPrimitve from "@radix-ui/react-scroll-area";
import { useRef } from "react";
import useHorizontalScroller from "@/hooks/use-horizontal-scroller";

export type Props = {
  children: React.ReactNode;
  orientation?: React.ComponentProps<
    typeof ScrollAreaPrimitve.Scrollbar
  >["orientation"];
};

function ScrollArea({ children, orientation }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useHorizontalScroller(ref, {
    enabled: orientation === "horizontal",
  });

  return (
    <ScrollAreaPrimitve.Root
      className="relative overflow-hidden"
      scrollHideDelay={150}
    >
      <ScrollAreaPrimitve.Viewport
        className="h-full w-full rounded-[inherit]"
        ref={ref}
      >
        {children}
      </ScrollAreaPrimitve.Viewport>
      <ScrollAreaPrimitve.Scrollbar
        orientation={orientation}
        className="flex touch-none select-none p-0.5 transition-colors duration-200 ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col no-hover:hidden"
      >
        <ScrollAreaPrimitve.Thumb className="relative flex-1 rounded-[10px] bg-tertiary transition-colors before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] hover:cursor-pointer hover:bg-gray-500" />
      </ScrollAreaPrimitve.Scrollbar>
      <ScrollAreaPrimitve.Corner />
    </ScrollAreaPrimitve.Root>
  );
}

export default ScrollArea;

function Spacer() {
  return <div className="w-2 shrink-0"></div>;
}

ScrollArea.Spacer = Spacer;