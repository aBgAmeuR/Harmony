"use client";

import { atom, useAtom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";

import { getYearMetricsAction } from "../actions/year-metrics-action";

export const year1Atom = atom(new Date().getFullYear());
export const year2Atom = atom(new Date().getFullYear() - 1);

const metrics1Atom = atomWithQuery((get) => ({
	queryKey: ["yearMetrics", get(year1Atom)],
	queryFn: async ({ queryKey: [, year] }) =>
		getYearMetricsAction(year as number),
	staleTime: 60 * 1000 * 10,
	refetchOnMount: false,
	refetchOnReconnect: false,
	refetchOnWindowFocus: false,
	gcTime: 60 * 1000 * 10,
}));

const metrics2Atom = atomWithQuery((get) => ({
	queryKey: ["yearMetrics", get(year2Atom)],
	queryFn: async ({ queryKey: [, year] }) =>
		getYearMetricsAction(year as number),
	staleTime: 60 * 1000 * 10,
	refetchOnMount: false,
	refetchOnReconnect: false,
	refetchOnWindowFocus: false,
	gcTime: 60 * 1000 * 10,
}));

export const useYearsData = () => {
	const [{ data: metrics1, isLoading: isLoading1, isError: isError1 }] =
		useAtom(metrics1Atom);
	const [{ data: metrics2, isLoading: isLoading2, isError: isError2 }] =
		useAtom(metrics2Atom);

	return {
		isError: isError1 || isError2 || !metrics1 || !metrics2,
		isLoading: isLoading1 || isLoading2,
		metrics1: metrics1!,
		metrics2: metrics2!,
	};
};
