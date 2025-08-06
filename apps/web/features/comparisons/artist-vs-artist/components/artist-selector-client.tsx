"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { ArrowRightIcon, Check, ChevronsUpDown } from "lucide-react";

import type { Artist } from "@repo/spotify/types";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Button, buttonVariants } from "@repo/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@repo/ui/command";
import { ButtonGroup } from "@repo/ui/components/button-group";
import { cn } from "@repo/ui/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";

import { artist1Atom, artist2Atom } from "../hooks/use-artists-data";

type ArtistComboboxProps = {
    value?: string;
    onSelect: (id: string) => void;
    options: Artist[];
};

function ArtistCombobox({ value, onSelect, options }: ArtistComboboxProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    // const { data: searchOptions = [], isLoading } = useQuery({
    //     queryKey: ["artists", search],
    //     queryFn: async () => searchArtistsAction(search, 10),
    //     staleTime: 1000 * 60,
    // });
    const isLoading = false;
    const selectedArtist = options.find((a) => a.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-auto min-w-[140px] justify-between text-xs"
                    aria-label="Select artist"
                >
                    {selectedArtist ? (
                        <span className="flex items-center gap-2">
                            <Avatar className="size-4">
                                <AvatarImage src={selectedArtist.images?.[0]?.url} alt={selectedArtist.name} />
                                <AvatarFallback>{selectedArtist.name[0].slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{selectedArtist.name}</span>
                        </span>
                    ) : "Select artist..."}
                    <ChevronsUpDown className="size-4 text-muted-foreground" />
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
                                    className="justify-between text-sm"
                                >
                                    <span className="flex items-center gap-2">
                                        <Avatar className="size-4">
                                            <AvatarImage src={artist.images?.[0]?.url} alt={artist.name} />
                                            <AvatarFallback>{artist.name[0].slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span className="line-clamp-1 break-all">{artist.name}</span>
                                    </span>
                                    <Check
                                        className={cn(
                                            "size-4",
                                            value === artist.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

type ArtistSelectorClientProps = {
    topArtists: Artist[];
    showWhenEmpty?: boolean;
}

export function ArtistSelectorClient({ topArtists, showWhenEmpty = false }: ArtistSelectorClientProps) {
    const [artist1, setArtist1] = useAtom(artist1Atom);
    const [artist2, setArtist2] = useAtom(artist2Atom);

    if (!showWhenEmpty && (!artist1 || !artist2)) return null;

    return (
        <ButtonGroup size="sm">
            <ArtistCombobox
                value={artist1 ?? undefined}
                onSelect={(id) => setArtist1(id)}
                options={topArtists}
            />
            <div className={cn(buttonVariants({ variant: "outline", size: "icon" }), "flex size-8! items-center justify-center p-0!")}>
                <ArrowRightIcon className="size-4 text-muted-foreground" />
            </div>
            <ArtistCombobox
                value={artist2 ?? undefined}
                onSelect={(id) => setArtist2(id)}
                options={topArtists}
            />
        </ButtonGroup>
    );
}

