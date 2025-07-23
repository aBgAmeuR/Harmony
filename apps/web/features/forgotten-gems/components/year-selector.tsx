import { Calendar } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@repo/ui/select";

type YearSelectorProps = {
    availableYears: number[];
    selectedYear?: number;
    onYearChange: (year?: number) => void;
};

export const YearSelector = ({
    availableYears,
    selectedYear,
    onYearChange,
}: YearSelectorProps) => {
    return (
        <Select defaultValue={selectedYear?.toString() ?? "all"} onValueChange={(value) => onYearChange(value ? parseInt(value) : undefined)}>
            <SelectTrigger size="sm">
                <Calendar className="size-4 text-muted-foreground" />
                <SelectValue />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.length > 1 && <SelectSeparator />}
                {availableYears.sort((a, b) => b - a).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
} 