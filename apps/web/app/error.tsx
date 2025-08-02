"use client";

import { Suspense } from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@repo/ui/button";

import { Icons } from "~/components/icons";
import { ThemeToggle } from "~/components/theme-toggle";

type ErrorProps = {
	error: Error & { digest?: string };
	reset?: () => void;
};

const KNOWN_ERRORS = {
	Configuration: {
		title: "Configuration Error",
		message:
			"There is a problem with the server configuration. Please contact support if this error persists.",
	},
	AccessDenied: {
		title: "Access Denied",
		message:
			"Access to this resource has been denied. You may not have the necessary permissions.",
	},
	Verification: {
		title: "Verification Error",
		message:
			"The verification token has expired or has already been used. Please try again.",
	},
	Default: {
		title: "Error",
		message:
			"An unexpected error occurred. Please try again or contact support if the issue persists.",
	},
	LinkExpired: {
		title: "Link Expired",
		message:
			"The link has expired. Please request a new link from the person who shared it with you.",
	},
	LinkMaxUsage: {
		title: "Link Max Usage",
		message:
			"The link has reached its maximum usage limit. Please request a new link from the person who shared it with you.",
	},
	LinkNotFound: {
		title: "Link Not Found",
		message:
			"The link does not exist or has been revoked. Please check the URL and try again.",
	},
} as const;

export default function Error({ error, reset }: ErrorProps) {
	return (
		<Suspense>
			<ErrorContent error={error} reset={reset} />
		</Suspense>
	);
}

function ErrorContent({ error, reset }: ErrorProps) {
	const searchParams = useSearchParams();
	const errorParams = searchParams.get("error");
	const router = useRouter();

	const knownError =
		errorParams && errorParams in KNOWN_ERRORS
			? KNOWN_ERRORS[errorParams as keyof typeof KNOWN_ERRORS]
			: KNOWN_ERRORS.Default;

	return (
		<div className="flex min-h-screen flex-col justify-between p-4">
			<div className="flex grow items-center justify-center">
				<div className="w-full max-w-md space-y-4 text-center">
					<AlertCircle className="mx-auto size-12" />
					<h1 className="font-bold text-2xl">
						{knownError.title}
					</h1>
					<p className="text-lg">{knownError.message}</p>
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
