import { ThemeImage } from "../../theme-image";

export default function MusicInsights() {
    return (
        <div className="absolute inset-0 p-3">
            <div className="h-full w-full overflow-hidden rounded-lg border border-foreground/10 bg-background">
                <ThemeImage
                    lightSrc="/images/ranking-light.png"
                    darkSrc="/images/ranking-dark.png"
                    alt="Top songs, artists, albums"
                    height={320}
                    width={600}
                    className="h-full w-full object-cover"
                />
            </div>
        </div>
    );
}


