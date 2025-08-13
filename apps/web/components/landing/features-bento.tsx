import AdvancedStatistics from "./bento/advanced-statistics";
import Comparisons from "./bento/comparisons";
import ForgottenGems from "./bento/forgotten-gems";
import ListeningHistory from "./bento/listening-history";
import MusicInsights from "./bento/music-insights";
import RecentlyPlayed from "./bento/recently-played";
import ShareLinks from "./bento/share-links";

type BentoCardProps = {
    title: string;
    description: string;
    Component: React.ComponentType;
};

const BentoCard = ({ title, description, Component }: BentoCardProps) => (
    <div className="relative flex flex-col items-start justify-start overflow-hidden rounded-2xl border border-foreground/10">
        <div className="absolute inset-0 rounded-2xl bg-white/5 backdrop-blur-sm dark:bg-white/5" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />
        <div className="relative z-10 self-stretch p-6">
            <p className="text-lg leading-7">
                {title}
                <br />
                <span className="text-muted-foreground">{description}</span>
            </p>
        </div>
        <div className="-mt-1 relative z-10 h-72 w-full">
            <Component />
        </div>
    </div>
);

export function FeaturesBento() {
    const cards = [
        { title: "Music Insights", description: "Most-played tracks, artists, and albums with clean visuals.", Component: MusicInsights },
        { title: "Listening History", description: "Timeline and trends of your listening habits over any period.", Component: ListeningHistory },
        { title: "Advanced Statistics", description: "Deep-dive charts and breakdowns with time-of-day analysis.", Component: AdvancedStatistics },
        // { title: "Rankings", description: "Detailed rankings with multiple sort modes and change tracking.", Component: Rankings },
        { title: "Recently Played", description: "Real-time view of what's been on repeat with live updates.", Component: RecentlyPlayed },
        { title: "Comparisons", description: "Compare artists and years to spot shifts in your taste.", Component: Comparisons },
        { title: "Forgotten Gems", description: "Resurface favorites you haven't played in a while.", Component: ForgottenGems },
        { title: "Share Links", description: "Create secure, time-limited, read-only links to your profile.", Component: ShareLinks },
    ] as const;

    return (
        <section className="w-full px-5">
            <div className="relative flex flex-col items-start justify-start gap-6 py-8 md:py-16">
                <div className="-rotate-[33.39deg] absolute top-[614px] left-[80px] z-0 h-[938px] w-[547px] origin-top-left bg-primary/10 blur-[130px]" />
                <div className="z-10 flex flex-col items-center justify-center gap-4 self-stretch py-8 md:py-14">
                    <h2 className="w-full max-w-[655px] text-center font-semibold text-4xl text-foreground leading-tight md:text-6xl md:leading-[66px]">
                        Powerful Music Analytics
                    </h2>
                    <p className="w-full max-w-[600px] text-center font-medium text-lg text-muted-foreground leading-relaxed md:text-xl">
                        Continuous analytics that go beyond Wrapped. Private by design with minimal permissions. Open-source and self-hostable.
                    </p>
                </div>

                <div className="z-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {cards.map((card) => (
                        <BentoCard key={card.title} {...card} />
                    ))}
                </div>
            </div>
        </section>
    );
}


