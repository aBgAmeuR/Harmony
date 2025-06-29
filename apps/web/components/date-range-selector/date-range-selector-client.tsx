'use client';

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CalendarRangeIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";

import { Button } from "@repo/ui/button";
import { ButtonGroup } from "@repo/ui/components/button-group";
import { Credenza, CredenzaBody, CredenzaClose, CredenzaContent, CredenzaDescription, CredenzaFooter, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from "@repo/ui/credenza";
import { Label } from "@repo/ui/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { Separator } from "@repo/ui/separator";
import { toast } from "@repo/ui/sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/tooltip"

import { DateUtils } from "~/lib/date-utils";

import { setDateRangeAction } from "./date-range-actions";
import { DateRangeSlider } from "./date-range-slider";
import { type PresetType, useDateRange } from "./use-date-range";

type DateRangeSelectorClientProps = {
    dateRange: { dateStart: Date; dateEnd: Date };
    minMaxDateRange?: { minDate: Date; maxDate: Date };
    isDemo: boolean;
};

export const DateRangeSelectorClient = ({ dateRange, minMaxDateRange, isDemo }: DateRangeSelectorClientProps) => {
    const loader = useTopLoader()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const { selectedDateRange, preset, selectedRange, setSelectedRange, setPreset, PRESETS } = useDateRange({ dateRange, minMaxDateRange });
    const { mutate, isPending } = useMutation({
        mutationFn: async () => await setDateRangeAction(selectedDateRange.from, preset === "custom" ? DateUtils.addMonths(selectedDateRange.to, 1) : selectedDateRange.to),
        onError: () => toast.error("Failed to update date range, please try again later"),
        onMutate: () => loader.start(),
        onSettled: () => {
            loader.done()
            router.refresh()
            setIsOpen(false)
        }
    });

    return (
        <div>
            <Credenza open={isOpen} onOpenChange={setIsOpen}>
                <CredenzaTrigger asChild={true}>
                    <Button variant="outline" aria-label="Select date range" className="w-[200px] justify-between">
                        {`${DateUtils.formatDate(dateRange.dateStart, "month-year-short")} - ${DateUtils.formatDate(dateRange.dateEnd, "month-year-short")}`}
                        <CalendarRangeIcon className="size-4 text-muted-foreground" />
                    </Button>
                </CredenzaTrigger>

                <CredenzaContent>
                    <CredenzaHeader className="gap-0">
                        <CredenzaTitle>Select date range</CredenzaTitle>
                        <CredenzaDescription>
                            Choose a preset or select custom dates
                        </CredenzaDescription>
                    </CredenzaHeader>

                    <CredenzaBody className="space-y-4">
                        <DateRangeSlider selectedDateRange={selectedDateRange} setDateRange={(range) => {
                            setPreset("custom")
                            setSelectedRange(range)
                        }} />
                        <h3 className="font-medium text-sm">Quick Select</h3>
                        <RadioGroup className="grid grid-cols-2 gap-2" value={preset} onValueChange={(value) => setPreset(value as PresetType)}>
                            {PRESETS.map((item) => (
                                <div key={item.value} className="relative flex w-full items-start gap-2 rounded-md border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary/50">
                                    <RadioGroupItem
                                        value={item.value}
                                        id={item.value}
                                        className="order-1 after:absolute after:inset-0"
                                    />
                                    <div className="grid grow gap-2">
                                        <Label htmlFor={item.value}>
                                            {item.label}
                                        </Label>
                                        <p className="text-muted-foreground text-xs">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>

                        {preset === 'custom' && (
                            <div className="rounded-md border border-input p-4 shadow-xs">
                                <h3 className="font-medium text-sm">Custom</h3>
                                <div className="mt-2 flex flex-col gap-4">
                                    <DateSelector
                                        label="From"
                                        selectedDate={selectedRange.from}
                                        onDateChange={(date) => setSelectedRange({ ...selectedRange, from: date })}
                                        isFromDate={true}
                                    />
                                    <DateSelector
                                        label="To"
                                        selectedDate={selectedRange.to}
                                        onDateChange={(date) => setSelectedRange({ ...selectedRange, to: date })}
                                        isFromDate={false}
                                    />
                                </div>
                            </div>
                        )}
                    </CredenzaBody>

                    <CredenzaFooter className="flex-col! gap-4">
                        <Separator className="my-2" />
                        <div className="flex w-full gap-2">
                            <CredenzaClose asChild={true}>
                                <Button variant="outline" className="flex-1" disabled={isPending}>
                                    Cancel
                                </Button>
                            </CredenzaClose>
                            {isDemo ? (
                                <Tooltip>
                                    <TooltipTrigger asChild={true}>
                                        <Button className="flex-1" disabled={true}>Apply</Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>This feature is not available in demo mode</p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <Button onClick={() => mutate()} className="flex-1" disabled={isPending}>
                                    {isPending && <Loader2 className="size-4 animate-spin" />}
                                    Apply
                                </Button>
                            )}
                        </div>
                    </CredenzaFooter>
                </CredenzaContent>
            </Credenza>
        </div >
    );
};

type DateSelectorProps = {
    label: string;
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    isFromDate?: boolean;
};

const DateSelector = ({ label, selectedDate, onDateChange, isFromDate = true }: DateSelectorProps) => {
    return (
        <div className="flex flex-col gap-2">
            <h4 className="font-medium text-muted-foreground text-sm">{label}</h4>
            <ButtonGroup>
                <Select value={String(selectedDate.getMonth() + 1)} onValueChange={(value) => {
                    const newDate = isFromDate
                        ? DateUtils.getFirstDayOfMonth(selectedDate.getFullYear(), Number.parseInt(value) - 1)
                        : DateUtils.getLastDayOfMonth(selectedDate.getFullYear(), Number.parseInt(value) - 1);
                    onDateChange(newDate);
                }}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {DateUtils.MONTHS.map((month, index) => (
                            <SelectItem key={index} value={String(index + 1)}>{month}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={String(selectedDate.getFullYear())} onValueChange={(value) => {
                    const newDate = isFromDate
                        ? DateUtils.getFirstDayOfMonth(Number.parseInt(value), selectedDate.getMonth())
                        : DateUtils.getLastDayOfMonth(Number.parseInt(value), selectedDate.getMonth());
                    onDateChange(newDate);
                }}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {DateUtils.YEARS_2015_TO_CURRENT.map((year, index) => (
                            <SelectItem key={index} value={year}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </ButtonGroup>
        </div>
    );
};
