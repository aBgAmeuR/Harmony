export const tickFormatter = {
    msToHours: (value: number) => `${(value / 1000 / 60 / 60).toFixed(0)}h`,
    msToHoursWithDecimal: (value: number) => `${(value / 1000 / 60 / 60).toFixed(2)}h`,
    hourSuffix: (value: number | string) => `${value}h`,
    normal: (value: string) => value,
} as const;

export type TickFormatterValues = keyof typeof tickFormatter;

export const getTickFormatter = (value: TickFormatterValues | undefined) => value ? tickFormatter[value] : undefined;