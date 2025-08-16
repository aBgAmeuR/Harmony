import Image from "next/image";
import Balancer from "react-wrap-balancer";

import { InteractiveComparisonsSection } from "./interactive-comparisons";

export const FeaturesSection = () => {
    return (
        <section className="mx-auto w-full max-w-5xl px-6">
            <div className="relative flex flex-col items-start justify-start gap-6 py-8 md:py-16">
                <div className="z-10 flex flex-col gap-4 self-stretch pt-8 md:pt-14">
                    <h2 className="w-full max-w-[655px] font-semibold text-4xl text-foreground leading-tight">
                        Powerful Music Analytics
                    </h2>
                    <Balancer className="w-full max-w-[600px] font-medium text-lg text-muted-foreground leading-relaxed md:text-xl">
                        Analytics beyond Wrapped. Private, open-source, and minimal permissions.
                    </Balancer>
                </div>

                <div className="mask-fade-all">
                    <Image src="/images/listening-history-min.jpg" alt="Feature 2" width={1280} height={661} className="h-auto w-full" />
                </div>

                <div className="grid w-full grid-cols-2 gap-4 divide-x-1 border-border border-y-1">
                    <div className="flex flex-col gap-6 py-12 pr-12">
                        <div className="flex flex-col gap-1">
                            <h3 className="font-medium text-2xl">
                                Rankings
                            </h3>
                            <p className="text-muted-foreground">
                                Detailed rankings with multiple sort modes and change tracking.
                            </p>
                        </div>
                        <div className="[--mask-bottom:linear-gradient(to_bottom,var(--mask-visible)_50%,var(--mask-invisible)_100%)] [--mask-invisible:rgba(0,0,0,0)] [--mask-right:linear-gradient(to_right,var(--mask-visible)_60%,var(--mask-invisible)_100%)] [--mask-visible:rgba(0,0,0,1)] [-webkit-mask-composite:source-in] [-webkit-mask-image:var(--mask-bottom),var(--mask-right)] [mask-composite:intersect] [mask-image:var(--mask-bottom),var(--mask-right)]">
                            <Image src="/images/top-tracks-min.jpg" alt="Feature 2" width={704} height={638} className="h-auto w-full" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 py-12 pl-12">
                        <div className="flex flex-col gap-1">
                            <h3 className="font-medium text-2xl">
                                Advanced Statistics
                            </h3>
                            <p className="text-muted-foreground">
                                Deep-dive charts and breakdowns with time-of-day analysis.
                            </p>
                        </div>
                        <div className="mask-fade-bottom-right">
                            <Image src="/images/advanced-statistics-min.jpg" alt="Feature 2" width={995} height={947} className="h-auto w-full" />
                        </div>
                    </div>
                </div>

                <InteractiveComparisonsSection />
            </div>
        </section>
    )
};