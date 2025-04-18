import { Session, auth } from "@repo/auth";
import { cache } from "react";

export const getMsPlayedInMinutes = (msPlayed: number | string) =>
	(Number(msPlayed) / (1000 * 60)).toFixed(2);

export const getMsPlayedInHours = (
	msPlayed: number | string | (string | number)[],
	showDecimals = true,
) => {
	const hours = Number(msPlayed) / (1000 * 60 * 60);

	if (showDecimals) {
		return hours.toFixed(2);
	}

	return Math.floor(hours).toString();
};

export const getUserInfos = cache(async () => {
	const session = await auth();
	const userId = session?.user?.id;
	const isDemo = session?.user?.name === "Demo";

	return {
		userId,
		isDemo,
	};
});
