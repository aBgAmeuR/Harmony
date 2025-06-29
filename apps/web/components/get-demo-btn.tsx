"use client";

import { useTransition } from "react";
import { LoaderCircle } from "lucide-react";

import { signIn } from "@repo/auth/actions";
import { Button, type buttonVariants } from "@repo/ui/button";
import { cn, type VariantProps } from "@repo/ui/lib/utils";

type GetDemoBtnProps = {
	label: string;
	className?: string;
} & VariantProps<typeof buttonVariants>;

export const GetDemoBtn = ({ label, ...props }: GetDemoBtnProps) => {
	const [isTransition, transition] = useTransition();

	const onClick = () => {
		transition(async () => {
			await signIn("credentials", {
				username: "demo",
				password: "demo",
				redirect: true,
				redirectTo: "/settings/about",
			});
		});
	};

	return (
		<Button
			onClick={onClick}
			variant="link"
			className={cn("p-0 text-primary", props.className)}
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
		</Button>
	);
};
