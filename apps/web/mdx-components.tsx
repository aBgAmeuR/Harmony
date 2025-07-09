import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import { MdxTable } from "@repo/ui/components/mdx-table";
import { cn } from '@repo/ui/lib/utils';

export function getMDXComponents(components: MDXComponents): MDXComponents {
    return {

        ...defaultMdxComponents,
        MdxTable,
        img: (props) => (
            <span className="p-2 bg-muted rounded-lg inline-block">
                <ImageZoom
                    {...props}
                    className={cn("rounded-md my-0!", props.className)}
                />
            </span>
        ),
        ...components,
    }
}