"use client"

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon, CheckIcon, CopyIcon, PlusIcon, } from "lucide-react";

import { Button } from "@repo/ui/button";
import { Calendar } from "@repo/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/dialog";
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { cn } from "@repo/ui/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import { Slider } from "@repo/ui/slider";
import { Spinner } from "@repo/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/tooltip";

import { createShareableLinkAction } from "../actions/shareable-links-actions";

function formatDate(date: Date | undefined) {
    if (!date) {
        return ""
    }

    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

export function CreateShareableLink() {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [sliderValue, setSliderValue] = useState<number>(0)
    const [copied, setCopied] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [shareableLink, setShareableLink] = useState<string | null>(null)

    const { mutate, isPending } = useMutation({
        mutationFn: createShareableLinkAction,
        onSuccess: (data) => {
            if (data?.success) {
                setShareableLink(data.shareableLink?.token ?? null)
            }
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const handleCopy = () => {
        if (inputRef.current) {
            navigator.clipboard.writeText(inputRef.current.value)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">
                    <PlusIcon className="h-4 w-4" />
                    Create Link
                </Button>
            </DialogTrigger>
            <DialogContent
            // onOpenAutoFocus={(e) => {
            //     e.preventDefault()
            //     // lastInputRef.current?.focus()
            // }}
            >
                <DialogHeader>
                    <DialogTitle className="text-left">Create New Shareable Link</DialogTitle>
                    <DialogDescription className="text-left">
                        Configure access controls for your profile link
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-5">
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <Label>{`Usage Limit: ${sliderValue === 0 ? "Unlimited" : sliderValue}`}</Label>
                            <Slider
                                className="grow"
                                value={[sliderValue]}
                                onValueChange={(value) => setSliderValue(value[0])}
                                min={0}
                                max={10}
                                step={1}
                                aria-label="Temperature"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label>
                                Expiration Date (optional)
                            </Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="w-full justify-between font-normal">
                                        {date ? formatDate(date) : "Select Expiration Date"}
                                        <CalendarIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            setDate(date)
                                            setOpen(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <Button type="button" size="sm" className="w-full" onClick={() => mutate({ usageLimit: sliderValue, expirationDate: date ?? null })} disabled={isPending}>
                        {isPending && <Spinner className="size-4" />}
                        Generate Link
                    </Button>
                </form>
                {shareableLink && (
                    <>
                        <hr className="my-1 border-t" />
                        <div className="*:not-first:mt-2">
                            <Label htmlFor="shareable-link">Your Shareable Link</Label>
                            <div className="relative">
                                <Input
                                    ref={inputRef}
                                    value={`https://originui.com/refer/${shareableLink}`}
                                    id="shareable-link"
                                    className="py-1 pe-9"
                                    type="text"
                                    readOnly
                                />
                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={handleCopy}
                                                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed"
                                                aria-label={copied ? "Copied" : "Copy to clipboard"}
                                                disabled={copied}
                                            >
                                                <div
                                                    className={cn(
                                                        "transition-all",
                                                        copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                                                    )}
                                                >
                                                    <CheckIcon
                                                        className="stroke-emerald-500"
                                                        size={16}
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                                <div
                                                    className={cn(
                                                        "absolute transition-all",
                                                        copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                                                    )}
                                                >
                                                    <CopyIcon size={16} aria-hidden="true" />
                                                </div>
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="px-2 py-1 text-xs">
                                            Copy to clipboard
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog >
    );
}