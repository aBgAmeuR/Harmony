import type * as React from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@repo/ui/sidebar";

type NavSecondaryProps = {
	items: {
		title: string;
		url: string;
		icon: LucideIcon;
		external?: boolean;
	}[];
};

export function NavSecondary({
	items,
	...props
}: NavSecondaryProps & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	const pathname = usePathname();

	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild={true} size="sm" tooltip={item.title} isActive={item.url === pathname}>
								<Link href={item.url} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined}>
									<item.icon />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
