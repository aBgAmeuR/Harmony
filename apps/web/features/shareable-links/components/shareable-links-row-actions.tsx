'use client'

import { Copy, ExternalLink, MoreHorizontal, TrashIcon } from "lucide-react";

import { Button } from "@repo/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@repo/ui/dropdown-menu";

import type { getShareableLinks } from "../data/shareable-links";


type ShareableLinksRowActionsProps = {
    link: Awaited<ReturnType<typeof getShareableLinks>>[0]
}

export function ShareableLinksRowActions({ link }: ShareableLinksRowActionsProps) {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => window.open(`/profile/${link.token}`, "_blank")}>
                        <ExternalLink size={16} className="opacity-60" aria-hidden="true" />
                        <span>Open Link</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => copyToClipboard(`${window.location.origin}/profile/${link.token}`)}>
                        <Copy
                            size={16}
                            className="opacity-60"
                            aria-hidden="true"
                        />
                        <span>Copy Link</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" className="cursor-pointer">
                    <TrashIcon size={16} aria-hidden="true" />
                    <span>Revoke Link</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}