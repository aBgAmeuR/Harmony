'use client';

import { Button } from "@repo/ui/button";
import { ButtonGroup } from "@repo/ui/components/button-group";
import { Credenza, CredenzaBody, CredenzaClose, CredenzaContent, CredenzaDescription, CredenzaFooter, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from "@repo/ui/credenza";
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { toast } from "@repo/ui/sonner";
import { useMutation } from "@tanstack/react-query";
import { format, localeFormat } from "light-date";
import { CalendarRangeIcon, Loader2 } from "lucide-react";
import { useTopLoader } from "nextjs-toploader";
import { useState } from "react";
import { setDateRangeAction } from "./date-range-actions";

const PRESETS = [
    { label: 'All Time', value: 'all-time' },
    { label: 'This Year', value: 'this-year' },
    { label: 'Last Year', value: 'last-year' },
    { label: 'Custom', value: 'custom' },
] as const;

type Preset = (typeof PRESETS)[number]['value'];

const formatMonth = (date: Date) =>
    `${localeFormat(date, "{MMM}")} ${format(date, "{yyyy}")}`;

const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
};

const getLastDayOfMonth = (year: number, month: number) => {
    return new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
};

type DateRangeSelectorClientProps = {
    dateRange: {
        dateStart: Date;
        dateEnd: Date;
    };
    minMaxDateRange?: {
        minDate: Date;
        maxDate: Date;
    };
};

export const DateRangeSelectorClient = ({ dateRange, minMaxDateRange }: DateRangeSelectorClientProps) => {
    const loader = useTopLoader()
    const [selectedRange, setSelectedRange] = useState({
        from: dateRange.dateStart,
        to: dateRange.dateEnd,
    });
    const { mutate, isPending } = useMutation({
        mutationFn: async (dateRange: { from: Date; to: Date }) => await setDateRangeAction(dateRange.from, dateRange.to),
        onError: () => toast.error("Failed to update date range, please try again later"),
        onMutate: () => loader.start(),
        onSettled: () => loader.done()
    });

    const displayText = selectedRange?.from && selectedRange?.to
        ? `${formatMonth(selectedRange.from)} - ${formatMonth(selectedRange.to)}`
        : `${formatMonth(dateRange.dateStart)} - ${formatMonth(dateRange.dateEnd)}`;

    const handlePresetChange = (value: Preset) => {
        if (value === 'all-time') {
            setSelectedRange({
                from: minMaxDateRange?.minDate ?? getFirstDayOfMonth(2015, 0),
                to: minMaxDateRange?.maxDate ?? new Date(),
            });
        } else if (value === 'this-year') {
            setSelectedRange({
                from: getFirstDayOfMonth(new Date().getFullYear(), 0),
                to: new Date(),
            });
        } else if (value === 'last-year') {
            setSelectedRange({
                from: getFirstDayOfMonth(new Date().getFullYear() - 1, 0),
                to: getLastDayOfMonth(new Date().getFullYear() - 1, 11),
            });
        } else if (value === 'custom') {
            setSelectedRange({
                from: minMaxDateRange?.minDate ?? getFirstDayOfMonth(2015, 0),
                to: minMaxDateRange?.maxDate ?? getLastDayOfMonth(new Date().getFullYear(), new Date().getMonth()),
            });
        }
    };

    const getPresetValue = () => {
        const now = new Date();
        const currentYear = now.getFullYear();

        if (selectedRange.from.getTime() === minMaxDateRange?.minDate.getTime() &&
            selectedRange.to.getTime() === minMaxDateRange?.maxDate.getTime()) {
            return PRESETS[0].value;
        }

        const thisYearStart = getFirstDayOfMonth(currentYear, 0);
        if (selectedRange.from.getTime() === thisYearStart.getTime() &&
            selectedRange.to.getTime() === now.getTime()) {
            return PRESETS[1].value;
        }

        const lastYearStart = getFirstDayOfMonth(currentYear - 1, 0);
        const lastYearEnd = getLastDayOfMonth(currentYear - 1, 11);
        if (selectedRange.from.getTime() === lastYearStart.getTime() &&
            selectedRange.to.getTime() === lastYearEnd.getTime()) {
            return PRESETS[2].value;
        }

        return PRESETS[3].value;
    };

    return (
        <div>
            <Credenza>
                <CredenzaTrigger asChild={true}>
                    <Button variant="outline" aria-label="Select date range" className="w-[200px] justify-between">
                        {displayText}
                        <CalendarRangeIcon className="size-4 text-muted-foreground" />
                    </Button>
                </CredenzaTrigger>

                <CredenzaContent className="max-w-xl">
                    <CredenzaHeader>
                        <CredenzaTitle>Select date range</CredenzaTitle>
                        <CredenzaDescription>
                            Choose a preset or select custom dates
                        </CredenzaDescription>
                    </CredenzaHeader>

                    <CredenzaBody className="space-y-4">
                        <RadioGroup className="grid grid-cols-4 gap-2" value={getPresetValue()} onValueChange={(value) => handlePresetChange(value as Preset)}>
                            {PRESETS.map((item) => (
                                <label
                                    key={item.value}
                                    className="relative flex cursor-pointer flex-col items-center gap-3 rounded-md border border-input px-2 py-3 text-center shadow-xs outline-none transition-[color,box-shadow] has-data-disabled:cursor-not-allowed has-data-[state=checked]:border-primary has-focus-visible:border-ring has-data-disabled:opacity-50 has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
                                >
                                    <RadioGroupItem
                                        id={item.value}
                                        value={item.value}
                                        className="sr-only after:absolute after:inset-0"
                                    />
                                    <p className="font-medium text-foreground text-sm leading-none">
                                        {item.label}
                                    </p>
                                </label>
                            ))}
                        </RadioGroup>

                        <div className="mt-2 grid grid-cols-2 gap-2">
                            <ButtonGroup>
                                <Select value={String(selectedRange.from.getMonth() + 1)} onValueChange={(value) => {
                                    const month = Number.parseInt(value) - 1;
                                    setSelectedRange({
                                        ...selectedRange,
                                        from: getFirstDayOfMonth(selectedRange.from.getFullYear(), month),
                                    });
                                }}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">January</SelectItem>
                                        <SelectItem value="2">February</SelectItem>
                                        <SelectItem value="3">March</SelectItem>
                                        <SelectItem value="4">April</SelectItem>
                                        <SelectItem value="5">May</SelectItem>
                                        <SelectItem value="6">June</SelectItem>
                                        <SelectItem value="7">July</SelectItem>
                                        <SelectItem value="8">August</SelectItem>
                                        <SelectItem value="9">September</SelectItem>
                                        <SelectItem value="10">October</SelectItem>
                                        <SelectItem value="11">November</SelectItem>
                                        <SelectItem value="12">December</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={String(selectedRange.from.getFullYear())} onValueChange={(value) => {
                                    const year = Number.parseInt(value);
                                    setSelectedRange({
                                        ...selectedRange,
                                        from: getFirstDayOfMonth(year, selectedRange.from.getMonth()),
                                    });
                                }}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2015">2015</SelectItem>
                                        <SelectItem value="2016">2016</SelectItem>
                                        <SelectItem value="2017">2017</SelectItem>
                                        <SelectItem value="2018">2018</SelectItem>
                                        <SelectItem value="2019">2019</SelectItem>
                                        <SelectItem value="2020">2020</SelectItem>
                                        <SelectItem value="2021">2021</SelectItem>
                                        <SelectItem value="2022">2022</SelectItem>
                                        <SelectItem value="2023">2023</SelectItem>
                                        <SelectItem value="2024">2024</SelectItem>
                                        <SelectItem value="2025">2025</SelectItem>
                                    </SelectContent>
                                </Select>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Select value={String(selectedRange.to.getMonth() + 1)} onValueChange={(value) => {
                                    const month = Number.parseInt(value) - 1;
                                    setSelectedRange({
                                        ...selectedRange,
                                        to: getLastDayOfMonth(selectedRange.to.getFullYear(), month),
                                    });
                                }}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">January</SelectItem>
                                        <SelectItem value="2">February</SelectItem>
                                        <SelectItem value="3">March</SelectItem>
                                        <SelectItem value="4">April</SelectItem>
                                        <SelectItem value="5">May</SelectItem>
                                        <SelectItem value="6">June</SelectItem>
                                        <SelectItem value="7">July</SelectItem>
                                        <SelectItem value="8">August</SelectItem>
                                        <SelectItem value="9">September</SelectItem>
                                        <SelectItem value="10">October</SelectItem>
                                        <SelectItem value="11">November</SelectItem>
                                        <SelectItem value="12">December</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={String(selectedRange.to.getFullYear())} onValueChange={(value) => {
                                    const year = Number.parseInt(value);
                                    setSelectedRange({
                                        ...selectedRange,
                                        to: getLastDayOfMonth(year, selectedRange.to.getMonth()),
                                    });
                                }}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2015">2015</SelectItem>
                                        <SelectItem value="2016">2016</SelectItem>
                                        <SelectItem value="2017">2017</SelectItem>
                                        <SelectItem value="2018">2018</SelectItem>
                                        <SelectItem value="2019">2019</SelectItem>
                                        <SelectItem value="2020">2020</SelectItem>
                                        <SelectItem value="2021">2021</SelectItem>
                                        <SelectItem value="2022">2022</SelectItem>
                                        <SelectItem value="2023">2023</SelectItem>
                                        <SelectItem value="2024">2024</SelectItem>
                                        <SelectItem value="2025">2025</SelectItem>
                                    </SelectContent>
                                </Select>
                            </ButtonGroup>
                        </div>
                    </CredenzaBody>

                    <CredenzaFooter>
                        <div className="flex w-full gap-2">
                            <CredenzaClose asChild={true}>
                                <Button variant="outline" className="flex-1" disabled={isPending}>
                                    Cancel
                                </Button>
                            </CredenzaClose>
                            <CredenzaClose asChild={true}>
                                <Button onClick={() => mutate(selectedRange)} className="flex-1" disabled={isPending}>
                                    {isPending && <Loader2 className="size-4 animate-spin" />}
                                    Apply
                                </Button>
                            </CredenzaClose>
                        </div>
                    </CredenzaFooter>
                </CredenzaContent>
            </Credenza>
        </div>
    );
};