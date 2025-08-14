import { Lock, Settings, Shield, } from "lucide-react";

import {
    Timeline,
    TimelineContent,
    TimelineHeader,
    TimelineIndicator,
    TimelineItem,
    TimelineSeparator,
    TimelineTitle,
} from "@repo/ui/timeline";

const items = [
    {
        id: 1,
        title: "Read-only Access",
        description:
            "Harmony never modifies your library or playback. We only read your data to provide insights.",
        icon: Shield,
    },
    {
        id: 2,
        title: "Minimal Scopes",
        description:
            "We only request the permissions you explicitly grant, and we never store your personal information except your package that you provided to us.",
        icon: Lock,
    },
    {
        id: 3,
        title: "Control at Any Time",
        description:
            "Revoke access from your Spotify Apps settings and/or delete your Harmony account. Data is cleared immediately.",
        icon: Settings,
    }
]

export function PrivacySecurity() {
    return (
        <section className="w-full px-6 py-16">
            <div className="mx-auto max-w-xl">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 font-bold text-3xl">Privacy & Security</h2>
                    <p className="text-lg text-muted-foreground">
                        Transparent data handling with multiple layers of protection
                    </p>
                </div>

                <Timeline defaultValue={3}>
                    {items.map((item) => (
                        <TimelineItem
                            key={item.id}
                            step={item.id}
                            className="group-data-[orientation=vertical]/timeline:ms-10"
                        >
                            <TimelineHeader>
                                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                                <TimelineTitle className="mt-0.5">{item.title}</TimelineTitle>
                                <TimelineIndicator className="group-data-[orientation=vertical]/timeline:-left-7 flex size-6 items-center justify-center border-none bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground">
                                    <item.icon size={14} />
                                </TimelineIndicator>
                            </TimelineHeader>
                            <TimelineContent>
                                {item.description}
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            </div>
        </section>
    );
}

