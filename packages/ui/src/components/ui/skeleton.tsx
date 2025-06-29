import { cn } from "@repo/ui/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	if (props.children) {
		return (
			<div
				className={cn("animate-pulse rounded-md bg-accent", className)}
				{...props}
			>
				<div className="invisible">{props.children}</div>
			</div>
		);
	}

	return (
		<div
			data-slot="skeleton"
			className={cn("animate-pulse rounded-md bg-accent", className)}
			{...props}
		/>
	);
}

export { Skeleton };
