import "@repo/ui/globals.css";

import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Inter } from "next/font/google";

import { cn } from "@repo/ui/lib/utils";
import { Toaster } from "@repo/ui/sonner";

import { Providers } from "~/components/providers/providers";

import ErrorComponent from "./error";

const inter = Inter({ subsets: ["latin"] });

export const preferredRegion = "lhr1";

export const metadata: Metadata = {
	title: "Harmony",
	description:
		"Harmony is a web app that helps you visualize your Spotify data.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<head>
				<link
					rel="icon"
					type="image/png"
					href="/favicon-96x96.png"
					sizes="96x96"
				/>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link rel="shortcut icon" href="/favicon.ico" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<meta name="apple-mobile-web-app-title" content="Harmony" />
				<link rel="manifest" href="/site.webmanifest" />
			</head>
			<body
				data-vaul-drawer-wrapper=""
				className={cn(inter.className, "antialiased")}
			>
				<ErrorBoundary errorComponent={ErrorComponent}>
					<Providers>{children}</Providers>
				</ErrorBoundary>
				<Analytics debug={false} />
				<Toaster richColors={true} closeButton={true} />
			</body>
		</html>
	);
}
