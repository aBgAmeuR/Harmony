"use client";

import { type PropsWithChildren, Suspense, useState } from "react";
import {
	QueryClientProvider as Provider,
	QueryClient,
} from "@tanstack/react-query";

export const QueryClientProvider = ({ children }: PropsWithChildren) => {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<Suspense>
			<Provider client={queryClient}>{children}</Provider>
		</Suspense>
	);
};
