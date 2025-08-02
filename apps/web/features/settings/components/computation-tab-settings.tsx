'use client'


import { Label } from "@repo/ui/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";

import { useComputationMethod } from "~/lib/store";

import { SettingsTabContent, SettingsTabHeader, SettingsTabLayout } from "./settings-tab-layout";

const computationMethods = [
    {
        id: "play_count",
        label: "Play Count",
        description: "Rankings based on the number of times you've played each track",
        disabled: false
    },
    {
        id: "time_played",
        label: "Time Played",
        description: "Rankings based on total listening time in minutes",
        disabled: false
    },
    {
        id: "custom",
        label: "Custom",
        description: "Advanced computation method (coming soon)",
        disabled: true
    },
] as const;

export default function ComputationTabSettings() {
    const { computation_method, setComputationMethod } = useComputationMethod();

    return (
        <SettingsTabLayout>
            <SettingsTabHeader title="Computation Method" description="Choose how your music statistics and rankings are calculated" />
            <SettingsTabContent>
                <Label className="mb-3 block font-medium text-base">Method</Label>
                <RadioGroup
                    className="flex flex-col gap-4"
                    value={computation_method ?? "play_count"}
                    onValueChange={(value) => setComputationMethod(value as "play_count" | "time_played" | "custom")}
                >
                    {computationMethods.map((method) => (
                        <label key={method.id} className={method.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}>
                            <div className="flex items-start gap-3 rounded-lg border border-input p-4 transition-colors hover:bg-accent/50">
                                <RadioGroupItem
                                    id={method.id}
                                    value={method.id}
                                    disabled={method.disabled}
                                    className="mt-0.5"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">{method.label}</span>
                                        {method.disabled && (
                                            <span className="rounded bg-muted px-2 py-0.5 text-muted-foreground text-xs">
                                                Coming Soon
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-muted-foreground text-xs">
                                        {method.description}
                                    </p>
                                </div>
                            </div>
                        </label>
                    ))}
                </RadioGroup>
                <p className="mt-4 text-muted-foreground text-sm">
                    This setting affects how all your top tracks, artists, and rankings are calculated throughout the app.
                </p>
            </SettingsTabContent>
        </SettingsTabLayout>
    );
}