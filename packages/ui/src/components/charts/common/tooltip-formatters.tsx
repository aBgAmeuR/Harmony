import { NumberFlow } from "@repo/ui/components/number";
import { cn } from "@repo/ui/lib/utils";

export const tooltipFormatter = {
	average: (value: string, payload: any, data: any) => {
		const percentage = ((payload[0].value - data) / data) * 100;
		return (
			<div className="flex w-full items-center justify-between gap-2">
				<p>{value}</p>
				<NumberFlow
					value={Math.abs(percentage).toFixed(2)}
					prefix={percentage >= 0 ? "+" : "-"}
					suffix="%"
					className={cn(
						"font-medium",
						percentage >= 0
							? "text-emerald-700 dark:text-emerald-500"
							: "text-red-700 dark:text-red-500",
					)}
				/>
			</div>
		);
	},
	normal: (value: string) => value,
	hourSuffix: (value: number | string) => `${value}h`,
} as const;

export type TooltipFormatterValues = keyof typeof tooltipFormatter;

export const getTooltipFormatter = (
	value: keyof typeof tooltipFormatter | undefined,
	label: any,
	payload: any,
	data?: any,
) => {
	if (!value) return undefined;

	const fn = tooltipFormatter[value];
	if (!fn) return undefined;

	return fn(label, payload, data);
};
