import type { PropsWithChildren } from "react";
import React, { Suspense } from "react";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@repo/ui/breadcrumb";
import { cn } from "@repo/ui/lib/utils";
import { Separator } from "@repo/ui/separator";
import { SidebarTrigger } from "@repo/ui/sidebar";

import { BackBtn } from "../back-btn";
import { DemoBadge } from "../demo-badge";

export const Layout = ({ children }: PropsWithChildren) => {
	return children;
};

export const LayoutContent = ({
	children,
	className,
}: PropsWithChildren<{ className?: string }>) => {
	return (
		<main className={cn("flex flex-1 flex-col gap-4 p-4 pt-0", className)}>
			{children}
		</main>
	);
};

export const LayoutHeader = ({
	items,
	demo = true,
	children,
}: PropsWithChildren<{
	items: string[];
	demo?: boolean;
}>) => {
	return (
		<header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
			<div className="flex items-center gap-2 ">
				<SidebarTrigger className="-ml-1" />
				<BackBtn />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>
				<Breadcrumb>
					<BreadcrumbList className="flex-nowrap">
						{items.slice(0, -1).map((item, index) => (
							<React.Fragment key={`${item}-${index}`}>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbPage className="line-clamp-1 break-all text-muted-foreground text-sm">
										{item}
									</BreadcrumbPage>
									components/lists/music-list/index.tsx	</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
							</React.Fragment>
						))}
						<BreadcrumbItem>
							<BreadcrumbPage className="truncate">
								{items[items.length - 1]}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				{demo && (
					<Suspense fallback={null}>
						<DemoBadge />
					</Suspense>
				)}
			</div>
			<div className="flex items-center gap-1">{children}</div>
		</header>
	);
};
