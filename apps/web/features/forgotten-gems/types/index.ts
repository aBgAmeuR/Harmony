export interface ForgottenGem {
	// Track info
	spotifyId: string;
	name: string;
	artists: string[];
	albumName: string;
	image: string;
	spotifyUrl: string;
	durationMs: number;

	// Analytics
	totalPlays: number;
	totalMsPlayed: number;
	averagePlayDuration: number;
	completionRate: number;
	affinityScore: number;

	// Temporal data
	firstPlayed: Date;
	lastPlayed: Date;
	daysSinceLastPlayed: number;
	peakPeriod: {
		start: Date;
		end: Date;
		playsInPeriod: number;
	};

	// Recommendation reason
	reason:
		| "high_completion"
		| "repeat_behavior"
		| "peak_period"
		| "long_sessions";
	reasonScore: number;
}

export interface ForgottenGemsConfig {
	// Time thresholds
	minDaysSinceLastPlayed: number; // default: 90
	maxDaysSinceLastPlayed: number; // default: 365 * 2
	lookbackPeriodDays: number; // default: 365

	// Year selection (new)
	selectedYear?: number; // specific year to analyze
	yearRange?: {
		start: number;
		end: number;
	}; // range of years

	// Quality thresholds
	minTotalPlays: number; // default: 3
	minCompletionRate: number; // default: 0.7 (70%)
	minAffinityScore: number; // default: 100000 (ms)

	// Results
	maxResults: number; // default: 50
}

export interface TrackPlayData {
	spotifyId: string;
	timestamp: Date;
	msPlayed: number;
	skipped: boolean | null;
	reasonEnd: string;
}

// New interface for year options
export interface YearOption {
	year: number;
	trackCount: number;
	label: string;
}
