import type * as React from "react";

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

// Area Chart specific properties
export interface AreaChartProps extends BaseChartProps, AxisTickFormatters {
	/** The data key for the X-axis */
	xAxisDataKey: string;
	/** Array of data keys for the area series */
	areaDataKeys: string[];
	/** Whether the areas should be stacked */
	stacked?: boolean;
	/** Whether to show the legend */
	showLegend?: boolean;
	/** Whether to show the Y-axis */
	showYAxis?: boolean;
}

// Bar Chart specific properties
export interface BarChartProps extends BaseChartProps, AxisTickFormatters {
	/** The data key for the X-axis */
	xAxisDataKey: string;
	/** The data key for the bar values */
	barDataKey: string;
	/** Reference line configuration */
	referenceLine?: {
		value: number;
		label: string;
		position?:
			| "top"
			| "insideTop"
			| "bottom"
			| "insideBottom"
			| "insideBottomLeft";
	};
	/** Whether to show bar labels */
	showBarLabels?: boolean;
	/** Whether to show the Y-axis */
	showYAxis?: boolean;
	/** Formatter for bar labels */
	barLabelFormatter?: TickFormatterValues;
	/** Border radius for bars */
	barRadius?: number;
	/** Additional data for labels */
	labelData?: any;
}

// Line Chart specific properties
export interface LineChartProps extends BaseChartProps, AxisTickFormatters {
	/** The data key for the X-axis */
	xAxisDataKey: string;
	/** The data key for the line values */
	lineDataKey: string;
	/** Whether the Y-axis should be reversed */
	yAxisReversed?: boolean;
	/** Domain for the Y-axis */
	yAxisDomain?: [number | string, number | string];
	/** Whether to show the Y-axis */
	showYAxis?: boolean;
	/** Whether to show dots on the line */
	showDots?: boolean;
	/** Whether to show cursor on hover */
	cursor?: boolean;
	/** Sync ID for synchronized charts */
	syncId?: string;
}

// Pie Chart specific properties
export interface PieChartProps extends BaseChartProps {
	/** The data key for the pie slice values */
	valueDataKey: string;
	/** The data key for the pie slice names */
	nameKey: string;
	/** Inner radius of the pie chart */
	innerRadius?: number;
	/** Stroke width of pie slices */
	strokeWidth?: number;
	/** Label to display in the center */
	centerLabel?: string;
	/** Value to display in the center */
	centerValue?: string | number;
}

// Radar Chart specific properties
export interface RadarChartProps extends BaseChartProps {
	/** The data key for the angle axis */
	angleAxisDataKey: string;
	/** Array of data keys for the radar series */
	radarDataKeys: string[];
	/** Margin configuration */
	margin?: {
		top?: number;
		right?: number;
		bottom?: number;
		left?: number;
	};
	/** Formatter for angle axis ticks */
	angleAxisTickFormatter?: TickFormatterValues;
	/** Width of the angle axis */
	angleAxisWidth?: number;
	/** Opacity for radar fill */
	fillOpacity?: number;
	/** Radius of dots */
	dotRadius?: number;
	/** Whether to show dots */
	showDots?: boolean;
	/** Whether to show grid */
	showGrid?: boolean;
	/** Additional data for labels */
	labelData?: any;
}

// Radial Bar Chart specific properties
export interface RadialBarChartProps extends BaseChartProps {
	/** Array of data keys for the radial bars */
	barDataKeys: string[];
	/** End angle of the radial chart */
	endAngle?: number;
	/** Inner radius of the radial chart */
	innerRadius?: number;
	/** Outer radius of the radial chart */
	outerRadius?: number;
	/** Percentage to display in the center */
	percentage?: number;
	/** Label to display in the center */
	centerLabel?: string;
}

// Chart Race specific properties
export interface ChartRaceSeries {
	/** Name of the series */
	name: string;
	/** Color of the series */
	color: string;
	/** Data for the series */
	data: Array<Record<string, any>>;
}

export interface ChartRaceProps
	extends Omit<BaseChartProps, "tooltipLabelFormatter"> {
	/** Array of series to display */
	series: ChartRaceSeries[];
	/** The data key for the X-axis */
	xAxisDataKey: string;
	/** The data key for the Y-axis */
	yAxisDataKey: string;
	/** Domain for the Y-axis */
	yAxisDomain?: [number, number];
	/** Whether the Y-axis should be reversed */
	yAxisReversed?: boolean;
	/** Custom formatter for X-axis ticks */
	xAxisTickFormatter?: (value: any) => string;
	/** Custom formatter for Y-axis ticks */
	yAxisTickFormatter?: (value: any) => string;
	/** Custom formatter for tooltip labels */
	tooltipLabelFormatter?: (value: string, payload: any) => React.ReactNode;
}

// Union type for all chart props
export type ChartProps =
	| (AreaChartProps & { type: "area" })
	| (BarChartProps & { type: "bar" })
	| (LineChartProps & { type: "line" })
	| (PieChartProps & { type: "pie" })
	| (RadarChartProps & { type: "radar" })
	| (RadialBarChartProps & { type: "radial-bar" })
	| (ChartRaceProps & { type: "race" });

// Common chart configuration type
export interface CommonChartConfig {
	/** Whether to show grid lines */
	showGrid?: boolean;
	/** Whether to show tooltips */
	showTooltip?: boolean;
	/** Whether to show legend */
	showLegend?: boolean;
	/** Whether to show axes */
	showAxes?: boolean;
	/** Animation duration in milliseconds */
	animationDuration?: number;
	/** Whether animations are enabled */
	enableAnimations?: boolean;
}

// Chart theme configuration
export interface ChartTheme {
	/** Primary color for the chart */
	primaryColor?: string;
	/** Secondary color for the chart */
	secondaryColor?: string;
	/** Background color for the chart */
	backgroundColor?: string;
	/** Text color for the chart */
	textColor?: string;
	/** Grid color for the chart */
	gridColor?: string;
}
