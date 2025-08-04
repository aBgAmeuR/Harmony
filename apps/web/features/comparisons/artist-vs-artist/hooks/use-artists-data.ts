import { useAtom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";

import { getArtistMetricsAction } from "../actions/artist-metrics-action";
import { artist1Atom, artist2Atom } from "../components/artist-selector";

const metrics1Atom = atomWithQuery((get) => ({
	queryKey: ["artistMetrics", get(artist1Atom)],
	queryFn: async ({ queryKey: [, artist] }) =>
		getArtistMetricsAction(artist as string),
}));

const metrics2Atom = atomWithQuery((get) => ({
	queryKey: ["artistMetrics", get(artist2Atom)],
	queryFn: async ({ queryKey: [, artist] }) =>
		getArtistMetricsAction(artist as string),
}));

export const useArtistsData = () => {
	const [{ data: metrics1, isPending: isLoading1, isError: isError1 }] =
		useAtom(metrics1Atom);
	const [{ data: metrics2, isPending: isLoading2, isError: isError2 }] =
		useAtom(metrics2Atom);

	return {
		isError: isError1 || isError2 || !metrics1 || !metrics2,
		isLoading: isLoading1 || isLoading2,
		metrics1: metrics1!,
		metrics2: metrics2!,
	};
};
