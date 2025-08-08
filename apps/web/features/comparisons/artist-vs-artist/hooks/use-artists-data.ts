"use client";

import { atom, useAtom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";

import { getArtistMetricsAction } from "../actions/artist-metrics-action";

export const artist1Atom = atom<string | null>(null);
export const artist2Atom = atom<string | null>(null);

const metrics1Atom = atomWithQuery((get) => ({
	queryKey: ["artistMetrics", get(artist1Atom)],
	queryFn: async ({ queryKey: [, artist] }) =>
		getArtistMetricsAction(artist as string),
	initialData: null,
}));

const metrics2Atom = atomWithQuery((get) => ({
	queryKey: ["artistMetrics", get(artist2Atom)],
	queryFn: async ({ queryKey: [, artist] }) =>
		getArtistMetricsAction(artist as string),
	initialData: null,
}));

export const useArtistsData = () => {
	const [{ data: metrics1, isFetching: isLoading1, isError: isError1 }] =
		useAtom(metrics1Atom);
	const [{ data: metrics2, isFetching: isLoading2, isError: isError2 }] =
		useAtom(metrics2Atom);

	return {
		isError: isError1 || isError2,
		isLoading: isLoading1 || isLoading2,
		metrics1: metrics1 ?? null,
		metrics2: metrics2 ?? null,
	};
};
