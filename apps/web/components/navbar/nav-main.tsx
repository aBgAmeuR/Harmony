"use client";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@repo/ui/collapsible";
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
import { ChevronRight, type LucideIcon } from "lucide-react";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
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
				{items.map((item) => (
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
																	}}
																	onClick={() => {
																		router.push(subItem.url);
																	}}
																>
																	{subItem.icon && <subItem.icon />}
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
								<SidebarMenuButton
									tooltip={item.title}
									asChild={true}
									isActive={
										item.url === pathname ||
										item.anotherUrl === pathname ||
										pathname.replace(/[^/]+$/, "*") === item.anotherUrl
									}
								>
									{!disable ? (
										<button
											onMouseEnter={() => {
												router.prefetch(item.url, {
													kind: PrefetchKind.FULL,
												});
											}}
											onClick={() => {
												router.push(item.url);
											}}
											className="w-full cursor-pointer"
										>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
										</button>
									) : (
										<div>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
										</div>
									)}
								</SidebarMenuButton>
							)}
							<CollapsibleContent>
								<SidebarMenuSub>
									{item.items?.map((subItem) => (
										<SidebarMenuSubItem key={subItem.title}>
											<SidebarMenuSubButton
												asChild={true}
												isActive={
													pathname === subItem.url ||
													pathname.replace(/[^/]+$/, "*") === subItem.anotherUrl
												}
											>
												{!disable ? (
													<button
														onMouseEnter={() => {
															router.prefetch(subItem.url, {
																kind: PrefetchKind.FULL,
															});
														}}
														onClick={() => {
															router.push(subItem.url);
														}}
														className="w-full cursor-pointer"
													>
														{subItem.icon && <subItem.icon />}
														<span>{subItem.title}</span>
													</button>
												) : (
													<div>
														{subItem.icon && <subItem.icon />}
														<span>{subItem.title}</span>
													</div>
												)}
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
