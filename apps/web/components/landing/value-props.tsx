import { BarChart2, Github, Rocket, Shield } from "lucide-react";

import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { cn } from "@repo/ui/lib/utils";

const items = [
    {
        title: "Powerful insights",
        description:
            "Go beyond Wrapped with continuous analytics, rich rankings, and clear trends across your listening.",
        icon: BarChart2,
        delay: "delay-200",
    },
    {
        title: "Privacy-first",
        description:
            "Read-only permissions. Revoke access or delete your account anytime.",
        icon: Shield,
        delay: "delay-300",
    },
    {
        title: "Open-source & self-hostable",
        description:
            "GPL-3.0 licensed. Deploy on Vercel in minutes or bring your own infrastructure with Docker.",
        icon: Github,
        delay: "delay-400",
    },
    {
        title: "Fast & modern",
        description:
            "Built with Next.js 16, React 19, Tailwind, and Drizzle for a snappy, accessible experience.",
        icon: Rocket,
        delay: "delay-500",
    },
] as const;

export function ValueProps() {
    return (
        <section className="bg-card px-4 py-16 sm:py-20">
            <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {items.map((item, index) => (
                    <Card
                        key={index}
                        className={cn(
                            "h-full animate-appear border-foreground/10 opacity-0",
                            item.delay,
                        )}
                    >
                        <CardHeader className="pb-2">
                            <div className="inline-flex size-9 items-center justify-center rounded-full bg-emerald-500/10">
                                <item.icon className="size-4 text-emerald-500" strokeWidth={1.5} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <h3 className="mb-1 font-semibold text-lg">{item.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}


