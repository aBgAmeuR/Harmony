import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Switch } from "@repo/ui/switch";

import type { MusicItemCardProps } from "~/components/cards/music-item-card/type";
import { MusicList } from "~/components/lists/music-list";

type TopItemsCardProps = {
    title: string;
    label: string;
    data: MusicItemCardProps['item'][]
    switch: {
        label1: string;
        label2: string;
        checked: boolean;
        onCheckedChange: (checked: boolean) => void;
    }
};

export const TopItemsCard = ({ title, label, data, switch: { label1, label2, checked, onCheckedChange } }: TopItemsCardProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>{title}</CardTitle>
                <div className="flex items-center gap-3">
                    <span className={`font-medium text-sm ${!checked ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {label1}
                    </span>
                    <Switch
                        checked={!checked}
                        onCheckedChange={(checked) => onCheckedChange(!checked)}
                    />
                    <span className={`font-medium text-sm ${checked ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {label2}
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <MusicList
                    data={data}
                    config={{
                        label,
                        showRank: true,
                        layout: "list"
                    }}
                />
            </CardContent>
        </Card>

    );
};