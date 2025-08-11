import { cookies } from "next/headers";

import { MusicListSkeleton } from "../music-list/skeleton";

type MusicLayoutSkeletonProps = Omit<React.ComponentProps<typeof MusicListSkeleton>, "layout">;

export const MusicLayoutSkeleton = async (props: MusicLayoutSkeletonProps) => {
    const cookieStore = await cookies();
    const listLayout = cookieStore.get("list-layout|state|list_layout")?.value;

    return <MusicListSkeleton layout={listLayout === "grid" ? "grid" : "list"} {...props} />;
};