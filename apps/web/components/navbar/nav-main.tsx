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
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useRef } from "react";
import type { SidebarItem } from "./sidebar-config";

type NavMainProps = {
	label: string;
	items: SidebarItem[];
	disable?: boolean;
};

export function NavMain({ label, items, disable }: NavMainProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { open, isMobile } = useSidebar();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>{label}</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const iconRef = useRef<AnimIconHandle>(null);
					return (
						<Collapsible
							key={item.title}
							asChild={true}
							defaultOpen={
								item.items?.some((i) => i.url === pathname) ||
								item.items?.some(
									(i) => pathname.replace(/[^/]+$/, "*") === i.anotherUrl,
								)
							}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								{item.items ? (
									<CollapsibleTrigger asChild={true}>
										<SidebarMenuButton
											isActive={
												!open &&
												!isMobile &&
												(item.items.some((i) => i.url === pathname) ||
													item.items?.some(
														(i) =>
															pathname.replace(/[^/]+$/, "*") === i.anotherUrl,
													))
											}
											tooltip={{
												children: (
													<>
														<div className="px-2 py-1">
															<p className="text-sm">{item.title}</p>
														</div>
														<Separator className="mb-1" />
														{item.items.map((subItem) => (
															<SidebarMenuButton
																key={subItem.title}
																isActive={subItem.url === pathname}
																asChild={true}
																size="sm"
																className="group-data-[collapsible=icon]:!size-auto"
															>
																{!disable ? (
																	<button
																		onMouseEnter={() => {
																			router.prefetch(subItem.url, {
																				kind: PrefetchKind.FULL,
																			});
																			if (
																				iconRef.current &&
																				typeof iconRef.current
																					.startAnimation === "function"
																			) {
																				iconRef.current.startAnimation();
																			}
																		}}
																		onMouseLeave={() => {
																			if (
																				iconRef.current &&
																				typeof iconRef.current.stopAnimation ===
																					"function"
																			) {
																				iconRef.current.stopAnimation();
																			}
																		}}
																		onClick={() => {
																			router.push(subItem.url);
																		}}
																	>
																		{subItem.icon && (
																			<subItem.icon
																				className="p-0"
																				ref={
																					iconRef as React.Ref<SVGSVGElement>
																				}
																			/>
																		)}
																		<span>{subItem.title}</span>
																	</button>
																) : (
																	<div>
																		{subItem.icon && <subItem.icon />}
																		<span>{subItem.title}</span>
																	</div>
																)}
															</SidebarMenuButton>
														))}
													</>
												),
												className: "p-1 min-w-32",
											}}
										>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
								) : (
									<>
										{/* <MenuButton item={item} disable={disable} /> */}
										<MenuButton item={item} disable={disable} />
									</>
								)}
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.map((subItem) => (
											<SidebarMenuSubItem key={subItem.title}>
												<MenuSubButton item={subItem} disable={disable} />
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}

const MenuButton = ({
	item,
	disable = false,
	children,
	...props
}: {
	disable?: boolean;
	item: SidebarItem;
} & React.ComponentProps<typeof SidebarMenuButton>) => {
	const iconRef = useRef<AnimIconHandle>(null);
	const router = useRouter();
	const pathname = usePathname();

	return (
		<SidebarMenuButton
			tooltip={item.title}
			asChild={true}
			isActive={
				item.url === pathname ||
				item.anotherUrl === pathname ||
				pathname.replace(/[^/]+$/, "*") === item.anotherUrl
			}
			{...props}
		>
			{disable ? (
				<div>
					{item.icon && <item.icon />}
					<span>{item.title}</span>
				</div>
			) : (
				<button
					onMouseEnter={() => {
						router.prefetch(item.url, {
							kind: PrefetchKind.FULL,
						});
						if (
							iconRef.current &&
							typeof iconRef.current.startAnimation === "function"
						) {
							iconRef.current.startAnimation();
						}
					}}
					onClick={() => {
						router.push(item.url);
					}}
					className="w-full cursor-pointer"
					onMouseLeave={() => {
						if (
							iconRef.current &&
							typeof iconRef.current.stopAnimation === "function"
						) {
							iconRef.current.stopAnimation();
						}
					}}
				>
					{item.icon && (
						<item.icon
							className="p-0"
							ref={iconRef as React.Ref<SVGSVGElement>}
						/>
					)}
					<span>{item.title}</span>
					{children}
				</button>
			)}
		</SidebarMenuButton>
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
	const iconRef = useRef<AnimIconHandle>(null);
	const router = useRouter();
	const pathname = usePathname();

	return (
		<SidebarMenuSubButton
			asChild={true}
			isActive={
				pathname === item.url ||
				pathname.replace(/[^/]+$/, "*") === item.anotherUrl
			}
			{...props}
		>
			{!disable ? (
				<button
					onMouseEnter={() => {
						router.prefetch(item.url, {
							kind: PrefetchKind.FULL,
						});
						if (
							iconRef.current &&
							typeof iconRef.current.startAnimation === "function"
						) {
							iconRef.current.startAnimation();
						}
					}}
					onClick={() => {
						router.push(item.url);
					}}
					onMouseLeave={() => {
						if (
							iconRef.current &&
							typeof iconRef.current.stopAnimation === "function"
						) {
							iconRef.current.stopAnimation();
						}
					}}
					className="w-full cursor-pointer"
				>
					{item.icon && (
						<item.icon
							className="p-0"
							ref={iconRef as React.Ref<SVGSVGElement>}
						/>
					)}
					<span>{item.title}</span>
				</button>
			) : (
				<div>
					{item.icon && <item.icon />}
					<span>{item.title}</span>
				</div>
			)}
		</SidebarMenuSubButton>
	);
};
