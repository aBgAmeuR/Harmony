import { Calendar, Copy, ExternalLink, MoreHorizontal, Trash2, Users } from "lucide-react";

import { getUser } from "@repo/auth";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/dropdown-menu";
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

const getStatusBadge = (link: Awaited<ReturnType<typeof getShareableLinks>>[0]) => {
    if (link.revoked) return <Badge variant="secondary">Revoked</Badge>
    if (link.usageLimit !== Number.POSITIVE_INFINITY && link.usageCount >= link.usageLimit)
        return <Badge variant="destructive">Limit Reached</Badge>
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) return <Badge variant="destructive">Expired</Badge>
    return <Badge variant="default">Active</Badge>
}

const getUsagePercentage = (usageCount: number, usageLimit: number) => {
    if (usageLimit === Number.POSITIVE_INFINITY) return 0
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
                        <TableHead>Status</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((link) => (
                        <TableRow key={link.id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                                        /profile/{link.token.substring(0, 8)}...
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        // onClick={() => copyToClipboard(`${window.location.origin}/profile/${link.token}`)}
                                        className="h-6 w-6 p-0"
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(link)}</TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="h-3 w-3" />
                                        <span>
                                            {link.usageLimit === Number.POSITIVE_INFINITY
                                                ? `${link.usageCount} uses (Infinite)`
                                                : `${link.usageCount}/${link.usageLimit} uses`}
                                        </span>
                                    </div>
                                    {!link.revoked && link.usageLimit !== Number.POSITIVE_INFINITY && (
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
                            <TableCell>
                                <span className="text-muted-foreground text-sm">{DateUtils.formatDate(link.createdAt ?? new Date(), "full")}</span>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            // onClick={() => window.open(`/profile/${link.token}`, "_blank")}
                                            disabled={link.revoked}
                                        >
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Open Link
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                        // onClick={() => copyToClipboard(`${window.location.origin}/profile/${link.token}`)}
                                        >
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copy Link
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            // onClick={() => handleRevokeLink(link.id)}
                                            disabled={link.revoked}
                                            className="text-destructive"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Revoke Link
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export function ShareableLinksTableSkeleton() {
    return (
        <p>Loading...</p>
    );
}