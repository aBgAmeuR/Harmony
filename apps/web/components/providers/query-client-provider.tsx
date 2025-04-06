"use client";

import { PropsWithChildren, Suspense, useState } from "react";
import {
  QueryClient,
  QueryClientProvider as Provider,
} from "@tanstack/react-query";

export const QueryClientProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());

  return <Suspense><Provider client={queryClient}>{children}</Provider></Suspense>;
};
