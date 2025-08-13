export default function ForgottenGems() {
    return (
        <div className="absolute inset-0 p-3">
            <div className="h-full w-full rounded-lg border border-foreground/10 bg-card/60 p-3 backdrop-blur">
                <div className="mb-2 flex items-center justify-between">
                    <div className="font-semibold text-xs">Forgotten Gems</div>
                    <div className="text-2xs text-muted-foreground">✨ Rediscover</div>
                </div>
                <div className="space-y-2">
                    {[
                        { name: "Midnight City", artist: "M83", top: true },
                        { name: "Somebody Else", artist: "The 1975", top: false },
                        { name: "Electric Feel", artist: "MGMT", top: true },
                    ].map((t, i) => (
                        <div key={i} className="flex items-center justify-between rounded-md border border-foreground/10 p-2">
                            <div className="min-w-0">
                                <div className="truncate font-medium text-xs">
                                    {t.name} {t.top ? <span className="text-2xs text-yellow-500">★</span> : null}
                                </div>
                                <div className="truncate text-2xs text-muted-foreground">{t.artist}</div>
                            </div>
                            <button className="rounded-full bg-primary px-2 py-1 text-2xs text-primary-foreground">Play</button>
                        </div>
                    ))}
                </div>
                <div className="mt-3 text-center">
                    <button className="rounded-md border border-foreground/10 px-3 py-1 text-2xs">Create Playlist</button>
                </div>
            </div>
        </div>
    );
}


