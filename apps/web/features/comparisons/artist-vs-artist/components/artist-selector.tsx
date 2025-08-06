import { ArrowRightIcon, ChevronsUpDown } from "lucide-react";

import { getUser } from "@repo/auth";
import { Button, buttonVariants } from "@repo/ui/button";
import { ButtonGroup } from "@repo/ui/components/button-group";
import { cn } from "@repo/ui/lib/utils";

import { getTopArtists } from "../data/top-artists";
import { ArtistSelectorClient } from "./artist-selector-client";

type ArtistSelectorProps = {
    showWhenEmpty?: boolean;
}

export const ArtistSelector = async ({ showWhenEmpty = false }: ArtistSelectorProps) => {
    const { userId } = await getUser();

    const topArtists = await getTopArtists(userId);

    return <ArtistSelectorClient topArtists={topArtists} showWhenEmpty={showWhenEmpty} />;
};

export function ArtistSelectorSkeleton() {
    return (
        <ButtonGroup size="sm">
            <Button variant="outline" size="sm" className="w-auto min-w-[140px] justify-between text-xs">
                Select artist...
                <ChevronsUpDown className="size-4 text-muted-foreground" />
            </Button>
            <div className={cn(buttonVariants({ variant: "outline", size: "icon" }), "flex size-8! items-center justify-center p-0!")}>
                <ArrowRightIcon className="size-4 text-muted-foreground" />
            </div>
            <Button variant="outline" size="sm" className="w-auto min-w-[140px] justify-between text-xs">
                Select artist...
                <ChevronsUpDown className="size-4 text-muted-foreground" />
            </Button>
        </ButtonGroup>
    );
} 