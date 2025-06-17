import { LinkButton } from "@repo/ui/components/link-button";
import { cn } from "@repo/ui/lib/utils";
import { Skeleton } from "@repo/ui/skeleton";
import type { PropsWithChildren } from "react";
import { Icons } from "~/components/icons";

type DetailHeaderProps = PropsWithChildren<{
    imgUrl?: string;
    title: string;
    subtitle?: string;
    hrefUrl: string;
    imgRadius: "rounded-full" | "rounded-md";
}>

export const DetailHeader = ({ imgUrl, title, subtitle, hrefUrl, children, imgRadius }: DetailHeaderProps) => {
    return (
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end">
            <img
                src={imgUrl || "/placeholder.svg"}
                alt={title}
                className={cn("size-32 shadow-lg md:size-40", imgRadius)}
            />
            <div className="flex-1">
                <div className="mb-2 flex flex-col">
                    {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
                    <div className="flex items-center gap-4">
                        <h1 className="font-bold text-3xl md:text-4xl">{title}</h1>
                        <LinkButton
                            href={hrefUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                            variant="outline"
                        >
                            <Icons.spotify className="size-4" />
                            <span className="hidden sm:inline">Open in Spotify</span>
                        </LinkButton>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                    {children}
                </div>
            </div>
        </div>
    )
}

type DetailHeaderStatProps = {
    label: string;
    value: string | number;
}

export const DetailHeaderStat = ({ label, value }: DetailHeaderStatProps) => {
    return (
        <div>
            <p className="text-muted-foreground text-sm">{label}</p>
            <h4>{value}</h4>
        </div>
    )
}

type DetailHeaderSkeletonProps = PropsWithChildren<{
    showSubtitle?: boolean;
    imgRadius: "rounded-full" | "rounded-md";
}>

export const DetailHeaderSkeleton = ({ children, showSubtitle = false, imgRadius }: DetailHeaderSkeletonProps) => {
    return (
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end">
            <Skeleton className={cn("size-32 shadow-lg md:size-40", imgRadius)} />
            <div className="flex-1">
                <div className="mb-2 flex flex-col">
                    {showSubtitle && <Skeleton className="my-0.5 h-6 w-24" />}
                    <div className="flex items-center gap-4">
                        <Skeleton className="my-0.5 h-8 w-60" />
                        <LinkButton
                            href="#"
                            size="sm"
                            variant="outline"
                            disabled={true}
                        >
                            <Icons.spotify className="size-4" />
                            <span className="hidden sm:inline">Open in Spotify</span>
                        </LinkButton>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                    {children}
                </div>
            </div>
        </div>
    )
}

export const DetailHeaderStatSkeleton = ({ label }: { label: string }) => {
    return (
        <div>
            <p className="text-muted-foreground text-sm">{label}</p>
            <Skeleton className="my-0.5 h-6 w-24" />
        </div>
    );
}