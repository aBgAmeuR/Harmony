"use client"

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon, CheckIcon, CopyIcon, PlusIcon, } from "lucide-react";

import { Button } from "@repo/ui/button";
import { Calendar } from "@repo/ui/calendar"
import { Credenza, CredenzaClose, CredenzaContent, CredenzaDescription, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from "@repo/ui/credenza";
import { Label } from "@repo/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import { Slider } from "@repo/ui/slider";
import { Spinner } from "@repo/ui/spinner";

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
        if (shareableLink) {
            navigator.clipboard.writeText(`https://originui.com/refer/${shareableLink}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        }
    }

    return (
        <Credenza onOpenChange={() => setShareableLink(null)}>
            <CredenzaTrigger asChild>
                <Button variant="default" size="sm">
                    <PlusIcon className="size-4" />
                    Create Link
                </Button>
            </CredenzaTrigger>
            <CredenzaContent className="p-4 md:w-md">
                <CredenzaHeader>
                    <CredenzaTitle className="text-left">Create New Shareable Link</CredenzaTitle>
                    <CredenzaDescription className="text-left">
                        Configure access controls for your profile link
                    </CredenzaDescription>
                </CredenzaHeader>

                <form className="w-full space-y-5">
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
                                        modifiers={{ disabled: (date) => date < new Date() }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    {shareableLink ? (
                        <CredenzaClose asChild>
                            <Button type="button" size="sm" className="w-full" onClick={handleCopy}>
                                Copy and close
                            </Button>
                        </CredenzaClose>
                    ) : (
                        <Button type="button" size="sm" className="w-full" onClick={() => mutate({ usageLimit: sliderValue, expirationDate: date ?? null })} disabled={isPending}>
                            {isPending && <Spinner className="size-4" />}
                            Generate Link
                        </Button>
                    )}
                </form>
                {shareableLink && (
                    <>
                        <hr className="my-4 border-t md:my-1" />
                        <div className="w-full *:not-first:mt-2">
                            <Label htmlFor="shareable-link">Your Shareable Link</Label>
                            <Button variant="outline" size="sm" className="grid w-full grid-cols-12 justify-between gap-2 font-normal" onClick={handleCopy} disabled={copied}>
                                <p className="col-span-11 min-w-0 max-w-full truncate text-left">{`https://originui.com/refer/${shareableLink}`}</p>
                                <div className="col-span-1 flex items-center justify-end">
                                    {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
                                </div>
                            </Button>
                        </div>
                    </>
                )}
            </CredenzaContent>
        </Credenza >
    );
}