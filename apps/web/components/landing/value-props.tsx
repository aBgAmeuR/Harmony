import { BarChart2, Github, Shield } from "lucide-react";

import { Card, } from "@repo/ui/card";
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
] as const;

export const ValuePropsSection = () => {
    return (
        <section className="bg-card px-6 py-16 sm:py-20">
            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
                {items.map((item, index) => (
                    <Card
                        key={index}
                        className={cn(
                            "h-full animate-appear border-foreground/10 p-4 opacity-0 md:p-6",
                            item.delay,
                        )}
                    >
                        <div className="mb-2 inline-flex size-9 items-center justify-center rounded-full bg-emerald-500/10">
                            <item.icon className="size-4 text-emerald-500" strokeWidth={1.5} />
                        </div>
                        <h3 className="mb-1 font-semibold text-lg">{item.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {item.description}
                        </p>
                    </Card>
                ))}
            </div>
        </section>
    );
}


