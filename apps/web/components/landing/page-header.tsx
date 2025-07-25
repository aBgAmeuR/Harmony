import Balance from "react-wrap-balancer";

import { cn } from "@repo/ui/lib/utils";

function PageHeader({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<section
			className={cn(
				"mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20",
				className,
			)}
			{...props}
		>
			{children}
		</section>
	);
}

function PageHeaderHeading({
	className,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h1
			className={cn(
				"text-center font-bold text-3xl leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]",
				className,
			)}
			{...props}
		/>
	);
}

function PageHeaderDescription({
	className,
	...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
	return (
		<Balance
			className={cn(
				"max-w-[750px] text-center font-light text-foreground text-lg",
				className,
			)}
			{...props}
		/>
	);
}

function PageActions({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"flex items-center justify-center space-x-4 py-4 md:pb-10",
				className,
			)}
			{...props}
		/>
	);
}

export { PageHeader, PageHeaderHeading, PageHeaderDescription, PageActions };
