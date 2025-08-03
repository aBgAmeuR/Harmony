import type { Metadata } from "next";

import { ArtistSelector } from "~/features/comparisons/artist-vs-artist/components/artist-selector";
import { ComparisonContent } from "~/features/comparisons/artist-vs-artist/components/comparison-content";
import { ComparisonLayout } from "~/features/comparisons/common/components/comparison-layout";
import type { ComparisonConfig } from "~/features/comparisons/common/types";

export const metadata: Metadata = {
	title: "Artist vs Artist",
	description: "Compare your listening habits between two artists",
};

export default function ArtistVsArtistPage() {
	const config: ComparisonConfig = {
		type: 'artist-vs-artist',
		label1: '',
		label2: '',
		chartTitle: 'Artist Comparison Overview',
		chartDescription: 'Compare listening metrics between artists',
		lineChartTitle: 'Monthly Evolution',
		lineChartDescription: 'Showing the evolution of listening time over months',
	};

	return (
		<ComparisonLayout
			metadata={metadata}
			config={config}
			selector={<ArtistSelector />}
		>
			<ComparisonContent />
		</ComparisonLayout>
	);
}
