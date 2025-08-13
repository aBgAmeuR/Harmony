export default function Comparisons() {
    return (
        <div className="absolute inset-0 p-3">
            <div className="h-full w-full rounded-lg border border-foreground/10 bg-card/60 p-3 backdrop-blur">
                <div className="mb-2 font-semibold text-xs">Comparisons</div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md border border-foreground/10 p-2 text-2xs">
                        Artist vs Artist
                    </div>
                    <div className="rounded-md border border-foreground/10 p-2 text-2xs">
                        Year vs Year
                    </div>
                </div>
            </div>
        </div>
    );
}


