import '@/app/global.css';
import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { Inter } from 'next/font/google';

import { Provider } from '@/app/provider';
import { source } from '@/lib/source';

import { baseOptions } from './layout.config';

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>
          <DocsLayout tree={source.pageTree} {...baseOptions}>
            {children}
          </DocsLayout>
        </Provider>
      </body>
    </html>
  );
}
