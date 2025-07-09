import type { PropsWithChildren } from "react";

import { cn } from "../lib/utils";

type MainProps = PropsWithChildren<{
	className?: string;
}>;

export const Main = ({ className, children }: MainProps) => {
	return (
		<main className={cn("flex flex-1 flex-col gap-4 p-4 pt-0", className)}>
			{children}
		</main>
	);
};
