import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@repo/ui/button";
import { ButtonGroup } from "@repo/ui/components/button-group";
import { MonthPicker } from "@repo/ui/components/monthpicker";
import { cn } from "@repo/ui/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";

import { DateUtils } from "~/lib/date-utils";

type MonthSelectorProps = {
    date: Date;
    setDate: (date: Date) => void;
    minDate: Date;
    maxDate: Date;
};

export const MonthSelector = ({
    date,
    setDate,
    minDate,
    maxDate,
}: MonthSelectorProps) => {
    return (
        <ButtonGroup size="sm">
            <Button
                size="sm"
                variant="outline"
                onClick={() =>
                    setDate(new Date(date.getFullYear(), date.getMonth() - 1))
                }
                disabled={date.getTime() < minDate.getTime()}
            >
                <ArrowLeft className="size-4" />
            </Button>
            <Popover>
                <PopoverTrigger asChild={true}>
                    <Button
                        size="sm"
                        variant="outline"
                        className={cn(
                            "w-[86px] justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                        )}
                    >
                        {DateUtils.formatDate(date, "month-year-short")}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <MonthPicker
                        onMonthSelect={setDate}
                        selectedMonth={date}
                        maxDate={maxDate}
                        minDate={minDate}
                    />
                </PopoverContent>
            </Popover>
            <Button
                size="sm"
                variant="outline"
                onClick={() =>
                    setDate(new Date(date.getFullYear(), date.getMonth() + 1))
                }
                disabled={date.getTime() > maxDate.getTime()}
            >
                <ArrowRight className="size-4" />
            </Button>
        </ButtonGroup>
    );
}
