"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { useSession } from "next-auth/react";

import { Skeleton } from "../ui/skeleton";
import { NavHeader } from "./nav-header";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { data } from "./sidebar-config";

import { NavMain } from "@/components/navbar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader {...data.header} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.stats} label="Stats" />
        {/* <NavMain items={data.package} label="Package" /> */}
        {/* <NavMain items={data.advanced} label="Advanced" /> */}
        <NavMain items={data.settings} label="Settings" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {session && session.user && session.user.id ? (
          <NavUser user={session.user} />
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Skeleton className="size-8 rounded-lg" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <Skeleton className="h-[17.5] w-1/2" />
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
