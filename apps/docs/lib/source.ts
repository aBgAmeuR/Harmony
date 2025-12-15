import { docs } from 'fumadocs-mdx:collections/server'
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import { createElement } from "react";
import { icons } from "lucide-react";
import { loader } from 'fumadocs-core/source';

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
	// it assigns a URL to your pages
	baseUrl: "/docs",
	source: toFumadocsSource(docs, []),
	icon(icon) {
		if (!icon) {
			// You may set a default icon
			return;
		}
		if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
	},
});
