export default function ShareLinks() {
    return (
        <div className="absolute inset-0 p-3">
            <div className="h-full w-full rounded-lg border border-foreground/10 bg-card/60 p-3 backdrop-blur">
                <div className="mb-2 font-semibold text-xs">Share Links</div>
                <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between rounded-md border border-foreground/10 p-2">
                            <div className="truncate text-2xs">https://harmony.app/profile/xxxxxx</div>
                            <button className="rounded-md border border-foreground/10 px-2 py-1 text-2xs">Copy</button>
                        </div>
                    ))}
                </div>
                <div className="mt-3 text-right">
                    <button className="rounded-md bg-primary px-3 py-1 text-2xs text-primary-foreground">New link</button>
                </div>
            </div>
        </div>
    );
}


