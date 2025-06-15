
import { Card } from "@repo/ui/card";
import { NumberFlow } from "@repo/ui/components/number";
import { Skeleton } from "@repo/ui/skeleton";

import { getListeningSessionData } from "../data/listening-session";

const getMsToHoursAndMinutes = (ms: number) => {
    const hours = Math.floor(ms / 1000 / 60 / 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);

    return { hours, minutes };
};

type ListeningSessionCardProps = {
    userId: string;
    isDemo: boolean;
    data?: Awaited<ReturnType<typeof getListeningSessionData>>;
};

export const ListeningSessionCard = async ({ userId, isDemo, data }: ListeningSessionCardProps) => {
    if (!data) {
        data = await getListeningSessionData(userId, isDemo);
        if (!data) return null;
    }

    return (
        <Card className="col-span-full p-6">
            <h3 className="mb-4 font-semibold">Listening Sessions</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                    <p className="text-muted-foreground text-sm">Total Sessions</p>
                    {/* <p className="text-2xl font-bold">1,447</p> */}
                    <p className="font-bold text-2xl">
                        <NumberFlow
                            value={data.totalSessions}
                            format={{ notation: "standard" }}
                            locales="en-US"
                        />
                    </p>
                </div>
                <div>
                    <p className="text-muted-foreground text-sm">Average Session</p>
                    <p className="font-bold text-2xl">
                        <NumberFlow
                            value={Math.floor(data.averageSessionTime / 1000 / 60)}
                            format={{ notation: "standard" }}
                            locales="en-US"
                            suffix=" minutes"
                        />
                    </p>
                </div>
                <div>
                    <p className="text-muted-foreground text-sm">Longest Session</p>
                    {/* <p className="text-2xl font-bold">6 hours 54 minutes</p> */}
                    <p className="font-bold text-2xl">
                        <NumberFlow
                            value={getMsToHoursAndMinutes(data.longestSession).hours}
                            format={{ notation: "standard" }}
                            locales="en-US"
                            suffix=" hours "
                        />
                        <NumberFlow
                            value={getMsToHoursAndMinutes(data.longestSession).minutes}
                            format={{ notation: "standard" }}
                            locales="en-US"
                            suffix=" minutes"
                        />
                    </p>
                </div>
            </div>
        </Card>
    );
};

export const ListeningSessionCardSkeleton = () => {
    return (
        <Card className="col-span-full p-6">
            <h3 className="mb-4 font-semibold">Listening Sessions</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                    <p className="text-muted-foreground text-sm">Total Sessions</p>
                    <Skeleton className="mt-1 h-7 w-20" />
                </div>
                <div>
                    <p className="text-muted-foreground text-sm">Average Session</p>
                    <Skeleton className="mt-1 h-7 w-36" />
                </div>
                <div>
                    <p className="text-muted-foreground text-sm">Longest Session</p>
                    <Skeleton className="mt-1 h-7 w-48" />
                </div>
            </div>
        </Card>
    );
};
