"use client";

import type { MusicItemCardProps } from "~/components/cards/music-item-card/type";
import { useListLayout } from "~/lib/store";

import { MusicList, type MusicListConfig } from "../music-list";

type MusicLayoutProps = {
    data: Array<MusicItemCardProps["item"]> | null;
    config: MusicListConfig;
};

export const MusicLayout = ({ data, config }: MusicLayoutProps) => {
    const listLayout = useListLayout((state) => state.list_layout);

    return <MusicList data={data} config={{ ...config, layout: config.layout ?? listLayout }} />
};