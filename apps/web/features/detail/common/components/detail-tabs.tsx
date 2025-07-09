import type { PropsWithChildren } from "react";

import { cn } from "@repo/ui/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";

type DetailTabsProps = PropsWithChildren<{
	tabs: string[];
	disabledTabs?: string[];
}>;

export const DetailTabs = ({
	tabs,
	disabledTabs,
	children,
}: DetailTabsProps) => {
	return (
		<Tabs defaultValue={tabs[0]} className="w-full">
			<div className="border-border border-y py-1">
				<div className="mx-auto w-full max-w-7xl px-4">
					<TabsList className="bg-transparent">
						{tabs.map((tab) => (
							<TabsTrigger
								key={`tabTrigger-${tab}`}
								value={tab}
								className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
								disabled={disabledTabs?.includes(tab)}
							>
								{tab}
							</TabsTrigger>
						))}
					</TabsList>
				</div>
			</div>
			{children}
		</Tabs>
	);
};

type DetailTabsContentProps = PropsWithChildren<{
	value: string;
	className?: string;
}>;

export const DetailTabsContent = ({
	children,
	value,
	className,
}: DetailTabsContentProps) => {
	return (
		<TabsContent
			value={value}
			className={cn("mx-auto w-full max-w-7xl space-y-4 px-4 py-2", className)}
		>
			{children}
		</TabsContent>
	);
};
