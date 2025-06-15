import { cn } from "@repo/ui/lib/utils";
import { NumberFlow } from "@repo/ui/components/number";

export const chartLabelsFormatter = {
    hourSuffix: (value: string) => {
        return `${value}h`;
    },
    average: (value: string, payload: any, data: any) => {
        const percentage = ((payload[0].value - data) / data) * 100;
        return (
            <div className="flex w-full items-center justify-between gap-2">
                <p>{value}</p>
                <NumberFlow
                    value={Math.abs(percentage).toFixed(2)}
                    prefix={percentage >= 0 ? "+" : "-"}
                    suffix="%"
                    className={cn("font-medium", percentage >= 0 ? "text-emerald-700 dark:text-emerald-500" : "text-red-700 dark:text-red-500")}
                />
            </div>
        );
    },
    normal: (value: string) => value,
} as const;