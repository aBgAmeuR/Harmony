"use client";

import { Button } from "@repo/ui/button";
import { Clock } from "lucide-react";
import { useTransition } from "react";

export default function TestScheduler() {
	const [transition, startTransition] = useTransition();

	const handleClick = () => {
		startTransition(() => {
			fetch("/api/cron/update-rankings");
		});
	};

	return (
		<Button
			onClick={handleClick}
			variant="outline"
			size="icon"
			disabled={transition}
		>
			<Clock className="size-4" />
		</Button>
	);
}
