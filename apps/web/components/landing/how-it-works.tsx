import { ChartNoAxesColumn, CloudUploadIcon, ZapIcon } from "lucide-react"

export const HowItWorksSection = () => {
    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
            <div className="flex flex-col gap-2 text-center">
                <h3 className="font-medium text-3xl">How it works</h3>
                <p className="text-lg text-muted-foreground">
                    Get started with Harmony in just a few simple steps
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <ZapIcon className="size-8 text-primary" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h4 className="font-semibold text-xl">Connect Spotify</h4>
                        <p className="text-muted-foreground">
                            Sign in with secure OAuth and grant read-only access
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <CloudUploadIcon className="size-8 text-primary" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h4 className="font-semibold text-xl">Optional import</h4>
                        <p className="text-muted-foreground">
                            Upload your "Extended streaming history" ZIP for richer, long-term insights
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <ChartNoAxesColumn className="size-8 text-primary" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h4 className="font-semibold text-xl">Explore</h4>
                        <p className="text-muted-foreground">
                            Harmony refreshes data automatically and updates your charts
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}