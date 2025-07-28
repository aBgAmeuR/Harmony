import { Calendar, MoreHorizontal, Users } from "lucide-react";

import { getUser } from "@repo/auth";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { Skeleton } from "@repo/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui/table";

import { DateUtils } from "~/lib/date-utils";

import { getShareableLinks } from "../data/shareable-links";
import CopyButton from "./copy-button";
import { CreateShareableLink } from "./create-shareable-link";
import { ShareableLinksRowActions } from "./shareable-links-row-actions";

const getStatusBadge = (link: Awaited<ReturnType<typeof getShareableLinks>>[0]) => {
    type Status = "active" | "expired" | "revoked" | "limit-reached"
    let status: Status = "active"
    if (link.revoked) status = "revoked"
    if (link.usageLimit !== 0 && link.usageCount >= link.usageLimit) status = "limit-reached"
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) status = "expired"
    const colorMap: Record<Status, string> = {
        active: "bg-emerald-500",
        expired: "bg-amber-500",
        revoked: "bg-red-500",
        "limit-reached": "bg-red-500",
    }
    const statusMap: Record<Status, string> = {
        active: "Active",
        expired: "Expired",
        revoked: "Revoked",
        "limit-reached": "Limit Reached",
    }
    return (
        <Badge variant="outline" className="gap-1.5">
            <span
                className={cn("size-1.5 rounded-full", colorMap[status])}
                aria-hidden="true"
            ></span>
            {statusMap[status]}
        </Badge>
    )
}

const getUsagePercentage = (usageCount: number, usageLimit: number) => {
    return Math.min((usageCount / usageLimit) * 100, 100)
}

export async function ShareableLinksTable() {
    const { userId } = await getUser()
    const data = await getShareableLinks(userId)

    return (
        <div className="overflow-hidden rounded-md border bg-background">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead>Link</TableHead>
                        <TableHead className="w-[150px]">Status</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead className="hidden w-[150px] md:table-cell">Created</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-12 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <span className="text-lg">No shareable links found.</span>
                                    <CreateShareableLink />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((link) => (
                            <TableRow key={link.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                                            /profile/{link.token.substring(0, 12)}...
                                        </code>
                                        <CopyButton text={`/profile/${link.token}`} variant="ghost" className="size-6 p-0" />
                                    </div>
                                </TableCell>
                                <TableCell>{getStatusBadge(link)}</TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="h-3 w-3" />
                                            <span>
                                                {link.usageLimit === 0
                                                    ? `${link.usageCount} uses`
                                                    : `${link.usageCount}/${link.usageLimit} uses`}
                                            </span>
                                        </div>
                                        {!link.revoked && link.usageLimit !== 0 && (
                                            <div className="h-1.5 w-full rounded-full bg-muted">
                                                <div
                                                    className="h-1.5 rounded-full bg-primary transition-all"
                                                    style={{
                                                        width: `${getUsagePercentage(link.usageCount, link.usageLimit)}%`,
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {link.expiresAt ? (
                                        <div className="flex items-center gap-1 text-sm">
                                            <Calendar className="h-3 w-3" />
                                            <span>{DateUtils.formatDate(link.expiresAt, "full")}</span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">Never</span>
                                    )}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <span className="text-muted-foreground text-sm">{DateUtils.formatDate(link.createdAt ?? new Date(), "full")}</span>
                                </TableCell>
                                <TableCell>
                                    <ShareableLinksRowActions link={link} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

export function ShareableLinksTableSkeleton() {
    return (
        <div className="overflow-hidden rounded-md border bg-background">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead>Link</TableHead>
                        <TableHead className="w-[150px]">Status</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead className="hidden w-[150px] md:table-cell">Created</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Skeleton className="h-6 w-full" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-6 w-full" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-6 w-full" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-6 w-full" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <Skeleton className="h-6 w-full" />
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}