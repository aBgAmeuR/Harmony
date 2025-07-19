"use client";

import ErrorComponent from "../error";

export default function ErrorPage() {
	const errorConfig = {
		message:
			"An unexpected error occurred. Please try again or contact support if the issue persists.",
		name: "Error",
	};
	const reset = () => window.location.reload();

	return <ErrorComponent error={errorConfig} reset={reset} />;
}
