import "@repo/ui/globals.css";

import { cn } from "@repo/ui/lib/utils";
import { Toaster } from "@repo/ui/sonner";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Inter } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";

import { Providers } from "~/components/providers/providers";

import Error from "./error";

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
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
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
          // vaul-drawer-wrapper=""
          className={cn(inter.className, "antialiased")}
        >
          <ErrorBoundary errorComponent={Error}>
            <Providers>{children}</Providers>
          </ErrorBoundary>
          <Toaster richColors closeButton />
        </body>
      </html>
    </ViewTransitions>
  );
}
