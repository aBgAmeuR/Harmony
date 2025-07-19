"use client";

import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@repo/ui/collapsible";
import type { AnimIconHandle } from "@repo/ui/components/icons/type";
import { Separator } from "@repo/ui/separator";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@repo/ui/sidebar";

import type { SidebarItem } from "./sidebar-config";

// Utility: isActive
function isSidebarItemActive(item: SidebarItem, pathname: string): boolean {
	return (
		item.url === pathname ||
		item.anotherUrl === pathname ||
		pathname.replace(/[^/]+$/, "*") === item.anotherUrl ||
		(item.items?.some((sub) => isSidebarItemActive(sub, pathname)) ?? false)
	);
}

type SidebarNavButtonProps = {
	item: SidebarItem;
	disable?: boolean;
	isActive?: boolean;
	onClick?: (e: React.MouseEvent) => void;
	onMouseEnter?: (e: React.MouseEvent) => void;
	onMouseLeave?: (e: React.MouseEvent) => void;
	children?: React.ReactNode;
	as?: React.ElementType;
	className?: string;
	tooltip?: any;
	[key: string]: any;
};

function SidebarNavButton({
	item,
	disable,
	isActive,
	onClick,
	onMouseEnter,
	onMouseLeave,
	children,
	as: Wrapper = "button",
	className = "w-full cursor-pointer",
	isCollapsed = false,
	hasSubItems = false,
	...props
}: SidebarNavButtonProps & { isCollapsed?: boolean; hasSubItems?: boolean }) {
	const iconRef = useRef<AnimIconHandle>(null);

	const handleMouseEnter = (e: React.MouseEvent) => {
		props.router?.prefetch?.(item.url, { kind: PrefetchKind.FULL });
		if (iconRef.current?.startAnimation) {
			iconRef.current.startAnimation();
		}
		onMouseEnter?.(e);
	};

	const handleMouseLeave = (e: React.MouseEvent) => {
		if (iconRef.current?.stopAnimation) {
			iconRef.current.stopAnimation();
		}
		onMouseLeave?.(e);
	};

	const handleClick = (e: React.MouseEvent) => {
		props.router?.push?.(item.url);
		onClick?.(e);
	};

	if (disable) {
		return (
			<Wrapper
				tabIndex={-1}
				aria-disabled={true}
				className={className}
				data-active={isActive}
				{...props}
			>
				{item.icon && (
					<item.icon
						className="p-0"
						ref={iconRef as React.Ref<SVGSVGElement>}
					/>
				)}
				<span>{item.title}</span>
				{children}
			</Wrapper>
		);
	}

	return (
		<Wrapper
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={handleClick}
			className={className}
			data-active={isActive}
			{...props}
		>
			{item.icon && (
				<item.icon className="p-0" ref={iconRef as React.Ref<SVGSVGElement>} />
			)}
			<span>{item.title}</span>
			{children}
		</Wrapper>
	);
}

function SidebarItemRenderer({
	item,
	pathname,
	disable,
	isCollapsed,
	isOpen,
	router,
}: {
	item: SidebarItem;
	pathname: string;
	disable?: boolean;
	isCollapsed: boolean;
	isOpen?: boolean;
	router: AppRouterInstance;
}) {
	const isActive = isSidebarItemActive(item, pathname);

	if (item.items) {
		return (
			<Collapsible
				key={item.title}
				asChild={true}
				defaultOpen={isActive}
				className="group/collapsible"
			>
				<SidebarMenuItem>
					<CollapsibleTrigger asChild={true}>
						<SidebarNavButton
							item={item}
							disable={disable}
							isActive={!isOpen && isActive}
							as={SidebarMenuButton}
							isCollapsed={isCollapsed}
							hasSubItems={!!item.items}
							tooltip={{
								children: (
									<SidebarTooltip
										item={item}
										disable={disable}
										router={router}
									/>
								),
								className: "p-1 min-w-32",
							}}
						>
							<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
						</SidebarNavButton>
					</CollapsibleTrigger>
					{isOpen && (
						<CollapsibleContent>
							<SidebarMenuSub>
								{item.items.map((sub) => (
									<SidebarMenuSubItem key={sub.title}>
										<SidebarNavButton
											item={sub}
											disable={disable}
											isActive={isSidebarItemActive(sub, pathname)}
											as={SidebarMenuSubButton}
											router={router}
										/>
									</SidebarMenuSubItem>
								))}
							</SidebarMenuSub>
						</CollapsibleContent>
					)}
				</SidebarMenuItem>
			</Collapsible>
		);
	}
	return (
		<SidebarMenuItem key={item.title}>
			<SidebarNavButton
				item={item}
				disable={disable}
				isActive={isActive}
				as={SidebarMenuButton}
				tooltip={item.title}
				router={router}
			/>
		</SidebarMenuItem>
	);
}

export function NavMain({
	label,
	items,
	disable,
	hasPackage = true,
}: {
	label: string;
	items: SidebarItem[];
	disable?: boolean;
	hasPackage?: boolean;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const { open, isMobile } = useSidebar();

	const filteredItems = items.filter(
		(item) => item.alwaysVisible || hasPackage,
	);

	return (
		<SidebarGroup>
			<SidebarGroupLabel>{label}</SidebarGroupLabel>
			<SidebarMenu>
				{filteredItems.map((item) => (
					<SidebarItemRenderer
						key={item.title}
						item={item}
						pathname={pathname}
						disable={disable}
						isCollapsed={isMobile}
						isOpen={open}
						router={router}
					/>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

const SidebarTooltip = ({
	item,
	disable = false,
	router,
}: {
	item: SidebarItem;
	disable?: boolean;
	router: AppRouterInstance;
}) => {
	const pathname = usePathname();

	return (
		<div
			role="tooltip"
			className="flex flex-col rounded-lg"
		>
			<div className="px-2 py-1 font-semibold">
				{item.title}
			</div>
			<Separator className="my-1" />
			{item.items?.map((subItem) => {
				const subActive = isSidebarItemActive(subItem, pathname);
				return (
					<SidebarMenuButton
						key={subItem.title}
						isActive={subActive}
						asChild={true}
						size="sm"
						className="group-data-[collapsible=icon]:!size-auto z-10 rounded-md hover:bg-accent"
						aria-label={subItem.title}
					>
						<SidebarNavButton
							item={subItem}
							disable={disable}
							isActive={subActive}
							as={"button"}
							router={router}
						/>
					</SidebarMenuButton>
				);
			})}
		</div>
	);
};
