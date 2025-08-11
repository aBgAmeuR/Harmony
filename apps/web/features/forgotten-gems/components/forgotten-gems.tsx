import { getUser } from "@repo/auth";
import { Skeleton } from "@repo/ui/skeleton";

import { LayoutDescription, LayoutTitle } from "~/components/layouts/layout";
import { MusicLayoutSkeleton } from "~/components/lists/music-layout/skeleton";
import { SelectListLayoutSkeleton } from "~/features/stats/components/select-list-layout";

import { getForgottenGems } from "../data/forgotten-gems-service";
import { ForgottenGemsClient } from "./forgotten-gems-client";

export const ForgottenGems = async () => {
    const { userId } = await getUser();
    const forgottenGems = await getForgottenGems(userId);

    return <ForgottenGemsClient forgottenGems={forgottenGems} />;
};

export const ForgottenGemsSkeleton = () => {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <LayoutTitle>Forgotten Gems</LayoutTitle>
                    <LayoutDescription>Rediscover tracks you loved but haven't played recently</LayoutDescription>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                    <Skeleton className="h-8 w-[131px] rounded-md" />
                    <Skeleton className="h-8 w-[175px] rounded-md" />
                    <SelectListLayoutSkeleton />
                </div>
            </div>
            <MusicLayoutSkeleton />
        </div>
    );
};
