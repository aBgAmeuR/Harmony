import type React from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";

import { getUserOrNull } from "@repo/auth";
import { SidebarInset, SidebarProvider } from "@repo/ui/sidebar";

import { AppSidebar } from "~/components/navbar/app-sidebar";

import ErrorComponent from "../error";

export const experimental_ppr = true;

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const cookieStorage = await cookies();
	const defaultOpen = cookieStorage.get("sidebar_state")?.value === "true";
	const user = await getUserOrNull();

	return (
		<ErrorBoundary errorComponent={ErrorComponent}>
			<SidebarProvider defaultOpen={defaultOpen}>
				<AppSidebar user={user} />
				<SidebarInset>
					<NextTopLoader
						color="#5be990"
						crawl={true}
						showSpinner={false}
						height={2}
						zIndex={9}
					/>
					{children}
				</SidebarInset>
			</SidebarProvider>
		</ErrorBoundary>
	);
}
