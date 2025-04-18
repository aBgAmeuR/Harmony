import { auth } from "@repo/auth";
import { SidebarInset, SidebarProvider } from "@repo/ui/sidebar";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { cookies } from "next/headers";
import type React from "react";

import { AppSidebar } from "~/components/navbar/app-sidebar";

import NextTopLoader from "nextjs-toploader";
import Error from "../error";

export default async function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStorage = await cookies();
	const sideBarState = cookieStorage.get("sidebar:state")?.value || "true";
	const session = await auth();

	return (
		<ErrorBoundary errorComponent={Error}>
			<SidebarProvider defaultOpen={sideBarState === "true"}>
				<AppSidebar user={session?.user} />
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
