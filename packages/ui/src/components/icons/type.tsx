import { HTMLAttributes } from "react";

export type AnimIconType = HTMLAttributes<HTMLDivElement> & {
  size?: string;
}

export type AnimIconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
}
