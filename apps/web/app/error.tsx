"use client";

import { Suspense } from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@repo/ui/button";

import { Icons } from "~/components/icons";
import { ThemeToggle } from "~/components/theme-toggle";

type ErrorType = "Configuration" | "AccessDenied" | "Verification" | "Default";

type ErrorProps = {
	error: Error & { digest?: string };
	reset?: () => void;
};

const authErrorMessages: Record<ErrorType, string> = {
	Configuration:
		"There is a problem with the server configuration. Please contact support if this error persists.",
	AccessDenied:
		"Access to this resource has been denied. You may not have the necessary permissions.",
	Verification:
		"The verification token has expired or has already been used. Please try again.",
	Default:
		"An unexpected error occurred. Please try again or contact support if the issue persists.",
};

export default function Error({ error, reset }: ErrorProps) {
	return (
		<Suspense>
			<ErrorContent error={error} reset={reset} />
		</Suspense>
	);
}

function ErrorContent({ error, reset }: ErrorProps) {
	const searchParams = useSearchParams();
	const errorParams = searchParams.get("error") as ErrorType | null;
	const router = useRouter();

	const errorMessage = errorParams
		? authErrorMessages[errorParams]
		: authErrorMessages.Default;

	return (
		<div className="flex min-h-screen flex-col justify-between p-4">
			<div className="flex grow items-center justify-center">
				<div className="w-full max-w-md space-y-4 text-center">
					<AlertCircle className="mx-auto size-12" />
					<h1 className="font-bold text-2xl">
						{errorParams
							? "Authentication Error"
							: "An unexpected error occurred"}
					</h1>
					<p className="text-lg">{errorMessage}</p>
					<p className="font-mono text-muted-foreground text-sm">
						Error Code: <span>{errorParams || error.digest || "Unknown"}</span>
					</p>
					<div className="flex justify-center gap-2">
						<Button onClick={() => reset?.() || router.refresh()}>
							Try again
						</Button>
						<Button
							className="group"
							variant="ghost"
							aria-label="Go to homepage"
							onClick={() => router.push("/signout")}
						>
							Go to Home
							<ArrowRight
								className="opacity-60 transition-transform group-hover:translate-x-0.5"
								size={16}
								strokeWidth={2}
								aria-hidden="true"
							/>
						</Button>
					</div>
				</div>
			</div>
			<footer className="mt-8 flex items-center justify-center gap-2">
				<Icons.logo className="size-8" />
				<h1 className="font-bold text-xl">Harmony</h1>
				<ThemeToggle />
			</footer>
		</div>
	);
}
