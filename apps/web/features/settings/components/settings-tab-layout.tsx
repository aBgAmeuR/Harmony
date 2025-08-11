import type { PropsWithChildren } from "react"

import { cn } from "@repo/ui/lib/utils"

export const SettingsTabLayout = ({ children }: PropsWithChildren) => {
    return (
        <div className="flex flex-col gap-4 px-0 md:px-6">
            {children}
        </div>
    )
}

export const SettingsTabHeader = ({ title, description }: { title: string, description: string }) => {
    return (
        <div className="flex flex-col gap-1.5">
            <h1 className="font-semibold text-xl leading-none">{title}</h1>
            <p className="text-muted-foreground text-sm">{description}</p>
        </div>
    )
}

export const SettingsTabContent = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
    return (
        <div className={cn("flex flex-col gap-1", className)}>
            {children}
        </div>
    )
}