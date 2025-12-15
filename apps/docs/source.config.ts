import {
	defineConfig,
	defineDocs,
	frontmatterSchema,
	metaSchema,
} from "fumadocs-mdx/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs: ReturnType<typeof defineDocs> = defineDocs({
	dir: "content/docs",
	docs: {
		schema: frontmatterSchema,
		async: true
	},
	meta: {
		schema: metaSchema,
	},
});

export default defineConfig({
	mdxOptions: {
		remarkPlugins: [remarkMath],
		// Place it at first, it should be executed before the syntax highlighter
		rehypePlugins: (v) => [rehypeKatex, ...v],
	},
});
