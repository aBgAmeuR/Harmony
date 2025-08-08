'use client'

import { type PropsWithChildren, Suspense, } from 'react'
import { QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'

import { getQueryClient } from '~/lib/get-query-client'

export function QueryClientProvider({ children }: PropsWithChildren) {
	const queryClient = getQueryClient()

	return (
		<Suspense>
			<TanstackQueryClientProvider client={queryClient}>
				<JotaiProvider>
					{children}
				</JotaiProvider>
			</TanstackQueryClientProvider>
		</Suspense>
	)
}