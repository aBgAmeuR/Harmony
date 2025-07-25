import type { PropsWithChildren } from "react";
import React from "react";
import type { Metadata } from "next";

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

export const Layout = ({ children }: PropsWithChildren) => {
	return children;
};

export const LayoutContent = ({
	children,
	className,
}: PropsWithChildren<{ className?: string }>) => {
	return (
		<main className={cn("mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-4 p-4", className)}>
			{children}
		</main>
	);
};

export const LayoutHeader = ({
	items,
	demo = true,
	children,
	metadata,
	className,
}: PropsWithChildren<{
	items: string[];
	demo?: boolean;
	metadata?: Metadata;
	className?: string;
}>) => {
	return (
		<header className={cn("mx-auto flex w-full max-w-screen-2xl shrink-0 gap-2 px-4 pt-2", metadata ? "flex-col" : "justify-between", className)}>
			<div className="flex h-8 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-8 sm:h-10">
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
								</BreadcrumbItem>
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
			</div>
			{metadata ? (
				<div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<LayoutTitle>{metadata.title?.toString()}</LayoutTitle>
						<LayoutDescription>{metadata.description?.toString()}</LayoutDescription>
					</div>
					<div className="flex flex-wrap items-center gap-1 lg:flex-nowrap">
						{children}
					</div>
				</div>
			) : (
				<div className="flex flex-nowrap items-center gap-1">
					{children}
				</div>
			)}
		</header>
	);
};

export const LayoutTitle = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
	return (
		<h1 className={cn("font-bold text-2xl tracking-tight", className)}>
			{children}
		</h1>
	);
};

export const LayoutDescription = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
	return (
		<p className={cn("text-muted-foreground text-sm", className)}>
			{children}
		</p>
	);
};