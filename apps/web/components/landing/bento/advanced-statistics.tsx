export default function AdvancedStatistics() {
    return (
        <div className="absolute inset-0 flex items-center justify-center p-3">
            <div className="h-[260px] w-[340px] rounded-lg border border-foreground/10 bg-card/60 p-4 backdrop-blur">
                <div className="mb-3 font-semibold text-xs">Advanced Statistics</div>
                <div className="grid h-[180px] grid-cols-2 gap-3">
                    <div className="rounded-md border border-foreground/10 p-3">
                        <div className="mb-1 text-2xs text-muted-foreground">Time of day</div>
                        <div className="flex h-16 items-end gap-1">
                            {[4, 8, 12, 16, 12, 10, 6].map((h, i) => (
                                <div key={i} className="w-3 rounded-sm bg-primary/70" style={{ height: `${h * 4}px` }} />
                            ))}
                        </div>
                    </div>
                    <div className="rounded-md border border-foreground/10 p-3">
                        <div className="mb-1 text-2xs text-muted-foreground">Longest streak</div>
                        <div className="font-semibold text-lg">14 days</div>
                    </div>
                    <div className="rounded-md border border-foreground/10 p-3">
                        <div className="mb-1 text-2xs text-muted-foreground">Genres</div>
                        <div className="text-2xs">Indie • Electronic • Pop</div>
                    </div>
                    <div className="rounded-md border border-foreground/10 p-3">
                        <div className="mb-1 text-2xs text-muted-foreground">Skips</div>
                        <div className="font-semibold text-lg">3.1%</div>
                    </div>
                </div>
            </div>
        </div>
    );
}


