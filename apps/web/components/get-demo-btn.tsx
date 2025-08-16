"use client";

import { useTransition } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button, type buttonVariants } from "@repo/ui/button";
import { cn, type VariantProps } from "@repo/ui/lib/utils";

type GetDemoBtnProps = {
	label: string;
	className?: string;
} & VariantProps<typeof buttonVariants>;

export const GetDemoBtn = ({ label, ...props }: GetDemoBtnProps) => {
	const router = useRouter();
	const [isTransition, transition] = useTransition();

	return (
		<Button
			onClick={() => transition(async () => router.push("/signin-demo"))}
			variant="glass"
			size="lg"
			className={cn("group", props.className)}
			data-testid="get-demo-btn"
			disabled={isTransition}
			{...props}
		>
			{isTransition ? (
				<LoaderCircle
					className="-ms-1 me-2 animate-spin"
					size={16}
					strokeWidth={2}
					aria-hidden="true"
				/>
			) : null}
			{label}
			<ArrowRight
				className="opacity-60 transition-transform group-hover:translate-x-0.5"
				size={16}
				strokeWidth={2}
				aria-hidden="true"
			/>
		</Button>
	);
};
