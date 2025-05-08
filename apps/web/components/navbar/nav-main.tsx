"use client";

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
import { ChevronRight } from "lucide-react";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useRef } from "react";
import type { SidebarItem } from "./sidebar-config";

type NavMainProps = {
	label: string;
	items: SidebarItem[];
	disable?: boolean;
	hasPackage?: boolean;
};

export function NavMain({
	label,
	items,
	disable,
	hasPackage = true,
}: NavMainProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { open, isMobile } = useSidebar();

	const isItemActive = (item: SidebarItem): boolean => {
		const isDirectMatch =
			item.url === pathname ||
			item.anotherUrl === pathname ||
			pathname.replace(/[^/]+$/, "*") === item.anotherUrl;

		return isDirectMatch || Boolean(item.items?.some(isItemActive));
	};

	const filteredItems = items.filter((item) => {
		if (item.alwaysVisible) return true;
		if (hasPackage) return true;
		return false;
	});

	return (
		<SidebarGroup>
			<SidebarGroupLabel>{label}</SidebarGroupLabel>
			<SidebarMenu>
				{filteredItems.map((item) => (
					<Collapsible
						key={item.title}
						asChild={true}
						defaultOpen={isItemActive(item)}
						className="group/collapsible"
					>
						<SidebarMenuItem>
							{item.items ? (
								<>
									<CollapseMenuButton
										item={item}
										disable={disable}
										isItemActive={isItemActive(item)}
										isMobile={isMobile}
										router={router}
										isOpen={open}
									/>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.items?.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<MenuSubButton
														item={subItem}
														disable={disable}
														className="w-full"
													/>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</>
							) : (
								<MenuButton item={item} disable={disable} />
							)}
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

type NavigationButtonProps = {
	item: SidebarItem;
	disable?: boolean;
	router: ReturnType<typeof useRouter>;
	children?: React.ReactNode;
	className?: string;
};

const NavigationButton = ({
	item,
	disable = false,
	router,
	children,
	className = "w-full cursor-pointer",
}: NavigationButtonProps) => {
	const iconRef = useRef<AnimIconHandle>(null);

	const handleMouseEnter = () => {
		router.prefetch(item.url, { kind: PrefetchKind.FULL });
		if (iconRef.current?.startAnimation) {
			iconRef.current.startAnimation();
		}
	};

	const handleMouseLeave = () => {
		if (iconRef.current?.stopAnimation) {
			iconRef.current.stopAnimation();
		}
	};

	const handleClick = () => {
		router.push(item.url);
	};

	if (disable) {
		return (
			<div>
				{item.icon && <item.icon />}
				<span>{item.title}</span>
				{children}
			</div>
		);
	}

	return (
		<button
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={handleClick}
			className={className}
		>
			{item.icon && (
				<item.icon className="p-0" ref={iconRef as React.Ref<SVGSVGElement>} />
			)}
			<span>{item.title}</span>
			{children}
		</button>
	);
};

const MenuButton = ({
	item,
	disable = false,
	children,
	...props
}: {
	disable?: boolean;
	item: SidebarItem;
} & React.ComponentProps<typeof SidebarMenuButton>) => {
	const router = useRouter();
	const pathname = usePathname();

	const isActive =
		item.url === pathname ||
		item.anotherUrl === pathname ||
		pathname.replace(/[^/]+$/, "*") === item.anotherUrl;

	return (
		<SidebarMenuButton
			tooltip={item.title}
			asChild={true}
			isActive={isActive}
			{...props}
		>
			<NavigationButton item={item} disable={disable} router={router}>
				{children}
			</NavigationButton>
		</SidebarMenuButton>
	);
};

const CollapseMenuButton = ({
	item,
	disable = false,
	isItemActive,
	isMobile,
	router,
	isOpen,
}: {
	disable?: boolean;
	item: SidebarItem;
	isMobile: boolean;
	isItemActive: boolean;
	router: AppRouterInstance;
	isOpen?: boolean;
}) => {
	const iconRef = useRef<AnimIconHandle>(null);

	return (
		<CollapsibleTrigger asChild={true}>
			<SidebarMenuButton
				isActive={!isOpen && !isMobile && isItemActive}
				tooltip={{
					children: (
						<SidebarTooltip
							item={item}
							isActive={isItemActive}
							disable={disable}
							router={router}
						/>
					),
					className: "p-1 min-w-32",
				}}
				onMouseEnter={() => {
					if (iconRef.current?.startAnimation) {
						iconRef.current.startAnimation();
					}
				}}
				onMouseLeave={() => {
					if (iconRef.current?.stopAnimation) {
						iconRef.current.stopAnimation();
					}
				}}
			>
				{item.icon && <item.icon ref={iconRef as React.Ref<SVGSVGElement>} />}
				<span>{item.title}</span>
				<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
			</SidebarMenuButton>
		</CollapsibleTrigger>
	);
};

const MenuSubButton = ({
	item,
	disable = false,
	children,
	...props
}: {
	disable?: boolean;
	item: SidebarItem;
} & React.ComponentProps<typeof SidebarMenuSubButton>) => {
	const router = useRouter();
	const pathname = usePathname();

	const isActive =
		pathname === item.url ||
		pathname.replace(/[^/]+$/, "*") === item.anotherUrl;

	return (
		<SidebarMenuSubButton asChild={true} isActive={isActive} {...props}>
			<NavigationButton item={item} disable={disable} router={router}>
				{children}
			</NavigationButton>
		</SidebarMenuSubButton>
	);
};

const SidebarTooltip = ({
	item,
	isActive,
	disable = false,
	router,
}: {
	item: SidebarItem;
	isActive: boolean;
	disable?: boolean;
	router: AppRouterInstance;
}) => {
	return (
		<>
			<div className="px-2 py-1">
				<p className="text-sm">{item.title}</p>
			</div>
			<Separator className="mb-1" />
			{item.items?.map((subItem) => (
				<SidebarMenuButton
					key={subItem.title}
					isActive={isActive}
					asChild={true}
					size="sm"
					className="group-data-[collapsible=icon]:!size-auto z-10"
				>
					<NavigationButton item={subItem} disable={disable} router={router} />
				</SidebarMenuButton>
			))}
		</>
	);
};
