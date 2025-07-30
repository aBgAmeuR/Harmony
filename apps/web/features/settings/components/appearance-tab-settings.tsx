// biome-ignore-all lint/performance/noImgElement: this is a valid use case
'use client'

import { CheckIcon, } from "lucide-react";
import { useTheme } from "next-themes";

import { CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Label } from "@repo/ui/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";

import { useListLayout } from "~/lib/store";

const themeItems = [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
    { id: "system", label: "System" },
] as const;

const layoutItems = [
    { id: "list", label: "List" },
    { id: "grid", label: "Grid" },
] as const;

const getImageUrl = (theme: "light" | "dark" | "system", layout: "list" | "grid") => layout === "list" ? `images/ui-${theme}.png` : `images/ui-${theme}-grid.png`

export default function AppearanceTabSettings() {
    const { setTheme, theme } = useTheme();
    const { list_layout, setListLayout } = useListLayout();

    return (
        <div className="space-y-8 px-6">
            <CardHeader className="px-0">
                <CardTitle className="text-xl">Appearance</CardTitle>
                <CardDescription>Customize the visual theme and layout of your Harmony experience</CardDescription>
            </CardHeader>

            {/* Theme Selection */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="font-medium text-base">Color Theme</Label>
                    <p className="text-muted-foreground text-sm">Choose your preferred color scheme</p>
                </div>
                <RadioGroup
                    className="grid grid-cols-1 gap-4 sm:grid-cols-3"
                    value={theme ?? "system"}
                    onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
                >
                    {themeItems.map((item) => (
                        <label key={item.id} className="cursor-pointer">
                            <RadioGroupItem
                                id={item.id}
                                value={item.id}
                                className="peer sr-only after:absolute after:inset-0"
                            />
                            <div className="space-y-3">
                                <div className="relative overflow-hidden rounded-lg border-2 border-input transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-data-[state=checked]:border-primary peer-data-[state=checked]:shadow-md">
                                    <img
                                        src={getImageUrl(item.id, list_layout)}
                                        alt={item.label}
                                        width={120}
                                        height={90}
                                        className="w-full object-cover"
                                    />
                                </div>
                                <div className="flex items-center justify-center gap-2 peer-data-[state=unchecked]:text-muted-foreground">
                                    <CheckIcon
                                        size={16}
                                        className="text-primary peer-data-[state=unchecked]:hidden"
                                        aria-hidden="true"
                                    />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </div>
                            </div>
                        </label>
                    ))}
                </RadioGroup>
            </div>

            {/* Layout Selection */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="font-medium text-base">Default Layout</Label>
                    <p className="text-muted-foreground text-sm">Choose your preferred layout for tracks, albums, and artists</p>
                </div>
                <RadioGroup
                    className="grid max-w-md grid-cols-1 gap-4 sm:grid-cols-2"
                    value={list_layout ?? "list"}
                    onValueChange={(value) => setListLayout(value as "list" | "grid")}
                >
                    {layoutItems.map((item) => (
                        <label key={item.id} className="cursor-pointer">
                            <RadioGroupItem
                                id={item.id}
                                value={item.id}
                                className="peer sr-only after:absolute after:inset-0"
                            />
                            <div className="space-y-3">
                                <div className="relative overflow-hidden rounded-lg border-2 border-input transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-data-[state=checked]:border-primary peer-data-[state=checked]:shadow-md">
                                    <img
                                        src={getImageUrl(theme as "light" | "dark" | "system" ?? "system", item.id)}
                                        alt={item.label}
                                        width={120}
                                        height={90}
                                        className="w-full object-cover"
                                    />
                                </div>
                                <div className="flex items-center justify-center gap-2 peer-data-[state=unchecked]:text-muted-foreground">
                                    <CheckIcon
                                        size={16}
                                        className="text-primary peer-data-[state=unchecked]:hidden"
                                        aria-hidden="true"
                                    />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </div>
                            </div>
                        </label>
                    ))}
                </RadioGroup>
            </div>
        </div>
    );
}