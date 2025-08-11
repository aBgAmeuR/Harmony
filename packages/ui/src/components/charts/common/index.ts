import type { ChartConfig } from "@repo/ui/chart";

import type { ChartTooltipFormatter } from "./chart-tooltip-formatter";
import type { TickFormatterValues } from "./tick-formatters";
import type { TooltipFormatterValues } from "./tooltip-formatters";

export interface BaseChartProps {
	data: any[];
	config: ChartConfig;
	className?: string;
	tooltipLabelFormatter?: TooltipFormatterValues;
	tooltipValueFormatter?: ChartTooltipFormatter;
}

export interface AxisTickFormatters {
	yAxisTickFormatter?: TickFormatterValues;
	xAxisTickFormatter?: TickFormatterValues;
}
