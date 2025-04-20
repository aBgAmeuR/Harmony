"use client";

import { Button } from "@repo/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export const BackBtn = () => {
	const router = useRouter();
	const path = useSearchParams().get("back");
	if (!path) return null;
	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={() => router.push(path)}
			aria-label="Retourner à la page précédente"
			className="group"
		>
			<ArrowLeftIcon
				className="-ms-1 group-hover:-translate-x-0.5 opacity-60 transition-transform"
				size={16}
				aria-hidden="true"
			/>
			Back
		</Button>
	);
};
