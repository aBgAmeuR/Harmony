import { cn } from "@repo/ui/lib/utils";
import { Separator } from "@repo/ui/separator";

import { CardSkeleton } from "~/components/cards/music-item-card/skeleton";

type MusicLayoutSkeletonProps = {
    length?: number;
    layout?: "grid" | "list";
    showRank?: boolean;
};

export const MusicLayoutSkeleton = ({
    length = 50,
    layout = "list",
    showRank = true,
}: MusicLayoutSkeletonProps) => {
    return (
        <div className={cn(layout === "grid" ? "grid grid-cols-2 xs:grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7" : "flex flex-col")}>
            {Array.from({ length }).map((_, index) => (
                <div key={index}>
                    <CardSkeleton showRank={showRank} index={index} layout={layout} />
                    {layout === "list" && index < length - 1 && <Separator />}
                </div>
            ))}
        </div>
    );
};
