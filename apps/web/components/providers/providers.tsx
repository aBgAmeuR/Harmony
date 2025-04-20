import { SessionProvider } from "@repo/auth";
import type { PropsWithChildren } from "react";

import { QueryClientProvider } from "./query-client-provider";
import { ThemeProvider } from "./theme-provider";

export const Providers = ({ children }: PropsWithChildren) => {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem={true}
			disableTransitionOnChange={true}
		>
			<SessionProvider>
				<QueryClientProvider>{children}</QueryClientProvider>
			</SessionProvider>
		</ThemeProvider>
	);
};
