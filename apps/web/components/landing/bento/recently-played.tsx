export default function RecentlyPlayed() {
    return (
        <div className="absolute inset-0 p-3">
            <div className="h-full w-full rounded-lg border border-foreground/10 bg-card/60 p-3 backdrop-blur">
                <div className="mb-2 font-semibold text-xs">Recently Played</div>
                <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="aspect-square w-full rounded-md bg-muted" />
                    ))}
                </div>
            </div>
        </div>
    );
}


