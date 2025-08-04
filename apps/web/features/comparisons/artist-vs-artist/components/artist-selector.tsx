"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";

import { Button, buttonVariants } from "@repo/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@repo/ui/command";
import { cn } from "@repo/ui/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { Skeleton } from "@repo/ui/skeleton";

import { searchArtistsAction } from "../actions/search-artists-action";
import { getTopArtistsAction } from "../actions/top-artists-action";

export const artist1Atom = atom<string | null>(null);
export const artist2Atom = atom<string | null>(null);

type ArtistComboboxProps = {
    value?: string;
    onSelect: (id: string) => void;
};

function ArtistCombobox({ value, onSelect }: ArtistComboboxProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const { data: options = [], isLoading } = useQuery({
        queryKey: ["artists", search],
        queryFn: async () => {
            if (search) {
                return searchArtistsAction(search, 10);
            } else {
                return getTopArtistsAction();
            }
        },
        staleTime: 1000 * 60,
    });

    const selectedArtist = options.find((a) => a.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {selectedArtist ? selectedArtist.name : "Select artist..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search artist..." value={search} onValueChange={setSearch} />
                    <CommandList>
                        {isLoading ? (
                            <CommandEmpty>Loading...</CommandEmpty>
                        ) : (
                            <CommandEmpty>No artist found.</CommandEmpty>
                        )}
                        <CommandGroup>
                            {options.map((artist) => (
                                <CommandItem
                                    key={artist.id}
                                    value={artist.name}
                                    onSelect={() => {
                                        onSelect(artist.id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === artist.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {artist.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export function ArtistSelector() {
    const [artist1, setArtist1] = useAtom(artist1Atom);
    const [artist2, setArtist2] = useAtom(artist2Atom);
    const queryClient = useQueryClient();

    return (
        <div className="flex items-center">
            <ArtistCombobox
                value={artist1 ?? undefined}
                onSelect={(id) => {
                    setArtist1(id);
                    queryClient.invalidateQueries({ queryKey: ["artistMetrics", artist1] });
                }}
            />
            <div
                className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "flex size-9 items-center justify-center"
                )}
            >
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <ArtistCombobox
                value={artist2 ?? undefined}
                onSelect={(id) => {
                    setArtist2(id);
                    queryClient.invalidateQueries({ queryKey: ["artistMetrics", artist2] });
                }}
            />
        </div>
    );
}

export function ArtistSelectorSkeleton() {
    return <Skeleton className="h-9 w-[420px]" />;
} 