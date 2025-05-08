"use client";

import Error from "../error";

export default function ErrorPage() {
	const error = {
		message:
			"An unexpected error occurred. Please try again or contact support if the issue persists.",
		name: "Error",
	};
	const reset = () => window.location.reload();

	return <Error error={error} reset={reset} />;
}
