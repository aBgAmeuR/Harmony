'use client';

import { atom, useAtom } from 'jotai';
import { ArrowRightIcon } from "lucide-react";

import { buttonVariants } from "@repo/ui/button";
import { ButtonGroup } from "@repo/ui/components/button-group";
import { cn } from "@repo/ui/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";

type YearSelectorProps = {
    availableYears: number[];
}

export const year1Atom = atom(new Date().getFullYear());
export const year2Atom = atom(new Date().getFullYear() - 1);

export const YearSelector = ({ availableYears }: YearSelectorProps) => {
    const [year1, setYear1] = useAtom(year1Atom);
    const [year2, setYear2] = useAtom(year2Atom);

    return (
        <ButtonGroup>
            <Select value={year1?.toString()} onValueChange={(v) => setYear1(parseInt(v))}>
                <SelectTrigger size='sm'>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {availableYears.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                            {y}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className={cn(buttonVariants({ variant: "outline", size: "icon" }), "flex size-8! items-center justify-center p-0!")}>
                <ArrowRightIcon className="size-4 text-muted-foreground" />
            </div>
            <Select value={year2?.toString()} onValueChange={(v) => setYear2(parseInt(v))}>
                <SelectTrigger size='sm'>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {availableYears.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                            {y}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </ButtonGroup>
    );
};

export const YearSelectorSkeleton = () => {
    const year1 = new Date().getFullYear();
    const year2 = new Date().getFullYear() - 1;

    return (
        <ButtonGroup>
            <Select value={year1.toString()}>
                <SelectTrigger size='sm'>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={year1.toString()}>
                        {year1}
                    </SelectItem>
                </SelectContent>
            </Select>
            <div className={cn(buttonVariants({ variant: "outline", size: "icon" }), "flex size-8! items-center justify-center p-0!")}>
                <ArrowRightIcon className="size-4 text-muted-foreground" />
            </div>
            <Select value={year2.toString()}>
                <SelectTrigger size='sm'>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={year2.toString()}>
                        {year2}
                    </SelectItem>
                </SelectContent>
            </Select>
        </ButtonGroup>
    );
};