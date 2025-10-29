import { GetDemoBtn } from "../get-demo-btn";
import { GetStartedBtn } from "./get-started-btn";

export const ClosingCTASection = () => {
    const isMaintenance = process.env.APP_MAINTENANCE === "true";

    return (
        <>
            <div className="relative mx-auto flex w-full max-w-5xl flex-col justify-between border-x ">
                <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t" />
                <div className="border-b px-2 py-8">
                    <h2 className="text-center font-bold text-2xl">
                        Unlock Your Musical Journey
                    </h2>
                    <p className="text-center text-muted-foreground">
                        Turn your listening history into insights you'll love.
                    </p>
                </div>
                <div className="flex items-center justify-center gap-2 bg-secondary/80 p-4 dark:bg-secondary/40">
                    <GetStartedBtn variant="gradient" size="lg" className="border-foreground/80 from-foreground/90 to-foreground px-4 text-secondary hover:border-foreground hover:from-foreground hover:to-foreground">Get Started</GetStartedBtn>
                    {!isMaintenance ? (
                        <GetDemoBtn label="View Demo" />
                    ) : null}
                </div>
                <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b" />
            </div>
            <div className="mx-auto w-full max-w-5xl border-x h-20">
            </div>
        </>
    );
}
