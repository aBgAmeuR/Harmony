import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { PlusIcon } from "lucide-react";

import { cn } from "../lib/utils";
import { Accordion, AccordionContent, AccordionItem } from "./ui/accordion";

type AccordionIconProps = {
	items: Array<{
		id: string;
		icon: React.ElementType;
		title: string;
		content: string;
	}>;
	className?: string;
};

export function AccordionIcons({ items, className }: AccordionIconProps) {
	return (
		<Accordion
			type="single"
			collapsible
			className={cn("w-full", className)}
			defaultValue="3"
		>
			{items.map((item) => (
				<AccordionItem value={item.id} key={item.id} className="py-2">
					<AccordionPrimitive.Header className="flex">
						<AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left font-semibold text-[15px] text-sm leading-6 outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0 [&[data-state=open]>svg]:rotate-180">
							<span className="flex items-center gap-3">
								<item.icon
									size={16}
									className="shrink-0 opacity-60"
									aria-hidden="true"
								/>
								<span>{item.title}</span>
							</span>
							<PlusIcon
								size={16}
								className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
								aria-hidden="true"
							/>
						</AccordionPrimitive.Trigger>
					</AccordionPrimitive.Header>
					<AccordionContent className="ps-7 pb-2 text-muted-foreground">
						{item.content}
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}
