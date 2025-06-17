export const axisTickFormatters = {
    msToHours: (value: number) => {
        return `${(value / 1000 / 60 / 60).toFixed(0)}h`;
    },
    msToHoursWithDecimal: (value: number) => {
        return `${(value / 1000 / 60 / 60).toFixed(2)}h`;
    },
    hourSuffix: (value: number | string) => {
        return `${value}h`;
    },
} as const;