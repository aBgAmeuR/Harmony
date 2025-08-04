"use client";

import { useAtom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";

import { getYearMetricsAction } from "../actions/year-metrics-action";
import { year1Atom, year2Atom } from "../components/year-selector";

const metrics1Atom = atomWithQuery((get) => ({
	queryKey: ["yearMetrics", get(year1Atom)],
	queryFn: async ({ queryKey: [, year] }) =>
		getYearMetricsAction(year as number),
}));

const metrics2Atom = atomWithQuery((get) => ({
	queryKey: ["yearMetrics", get(year2Atom)],
	queryFn: async ({ queryKey: [, year] }) =>
		getYearMetricsAction(year as number),
}));

export const useYearsData = () => {
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
