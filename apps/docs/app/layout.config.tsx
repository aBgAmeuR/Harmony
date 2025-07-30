import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

import { Icons } from '@/components/icons';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <div className="flex items-center gap-2">
        <Icons.logo className="size-8" />
        <div className="text-left text-xl leading-tight">
          <span className="truncate font-semibold">Harmony Support</span>
        </div>
      </div>
    ),
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [],
  githubUrl: 'https://github.com/aBgAmeuR/Harmony',
};
