import { Info } from "lucide-react";

import { signOut } from "@repo/auth/actions";
import { Button } from "@repo/ui/button";
import { CardContent } from "@repo/ui/card";

export const DemoStep = () => {
	return (
		<CardContent className="mx-6 rounded-lg border border-border bg-background p-4 shadow-black/5 shadow-lg">
			<div className="flex items-center gap-4">
				<Info
					className="text-blue-500"
					size={24}
					strokeWidth={2}
					aria-hidden="true"
				/>
				<div className="flex w-full grow items-center justify-between">
					<div className="space-y-1">
						<p className="font-medium text-sm">Sign in to view your package</p>
						<p className="text-muted-foreground text-xs">
							You must sign in to view your package and explore your listening
							history with Harmony.
						</p>
					</div>
					<form
						action={async () => {
							"use server";
							await signOut({
								redirect: true,
								redirectTo: "/",
							});
						}}
					>
						<Button className="w-full" size="sm" type="submit">
							Exit demo
						</Button>
					</form>
				</div>
			</div>
		</CardContent>
	);
};
