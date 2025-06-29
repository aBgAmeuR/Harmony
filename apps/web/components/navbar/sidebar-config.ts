import {
	ArrowRightLeft,
	Binary,
	CalendarRange,
	ChartNoAxesCombined,
	Github,
	type LucideIcon,
	Milestone,
	UsersRound,
} from "lucide-react";

import { AudioLinesIcon } from "@repo/ui/icons/audio-lines";
import { ChartLineIcon } from "@repo/ui/icons/chart-line";
import { Disc3Icon } from "@repo/ui/icons/disc-3";
import { HistoryIcon } from "@repo/ui/icons/history";
import { InfoIcon } from "@repo/ui/icons/info";
import { LayoutPanelTopIcon } from "@repo/ui/icons/layout-panel-top";
import { ListOrderedIcon } from "@repo/ui/icons/list-ordered";
import { PackageIcon } from "@repo/ui/icons/package";
import { TrendingUpIcon } from "@repo/ui/icons/trending-up";
import { TrendingUpDownIcon } from "@repo/ui/icons/trending-up-down";
import { UserIcon } from "@repo/ui/icons/user";

import { Icons } from "../icons";

export type SidebarItem = {
	title: string;
	url: string;
	icon: LucideIcon;
	items?: SidebarItem[];
	anotherUrl?: string;
	alwaysVisible?: boolean;
};

type SidebarConfig = {
	header: {
		name: string;
		Logo: React.ComponentType;
	};
	stats: SidebarItem[];
	package: SidebarItem[];
	advanced: SidebarItem[];
	settings: SidebarItem[];
	navSecondary: SidebarItem[];
};

export const data: SidebarConfig = {
	header: {
		name: "Harmony",
		Logo: Icons.logo,
	},
	stats: [
		{
			title: "Top",
			url: "/top",
			icon: ListOrderedIcon as LucideIcon,
			alwaysVisible: true,
			items: [
				{
					title: "Tracks",
					url: "/top/tracks",
					icon: AudioLinesIcon as LucideIcon,
					alwaysVisible: true,
				},
				{
					title: "Artists",
					url: "/top/artists",
					icon: UserIcon as LucideIcon,
					alwaysVisible: true,
				},
			],
		},
		{
			title: "Recently Played",
			url: "/recently-played",
			icon: HistoryIcon as LucideIcon,
			alwaysVisible: true,
		},
	],
	package: [
		{
			title: "Overview",
			url: "/overview",
			anotherUrl: "/",
			icon: LayoutPanelTopIcon as LucideIcon,
			alwaysVisible: true,
		},
		{
			title: "Rankings",
			url: "/rankings",
			icon: TrendingUpIcon as LucideIcon,
			items: [
				{
					title: "Tracks",
					url: "/rankings/tracks",
					icon: AudioLinesIcon as LucideIcon,
				},
				{
					title: "Albums",
					url: "/rankings/albums",
					icon: Disc3Icon as LucideIcon,
				},
				{
					title: "Artists",
					url: "/rankings/artists",
					anotherUrl: "/detail/artist/*",
					icon: UserIcon as LucideIcon,
				},
			],
		},
		{
			title: "Stats",
			url: "/stats",
			icon: ChartNoAxesCombined,
			items: [
				{
					title: "Numbers",
					url: "/stats/numbers",
					icon: Binary,
				},
				{
					title: "Listening Habits",
					url: "/stats/listening-habits",
					icon: ChartLineIcon as LucideIcon,
				},
				{
					title: "Activity",
					url: "/stats/activity",
					icon: TrendingUpDownIcon as LucideIcon,
				},
			],
		},
	],
	advanced: [
		{
			title: "Milestones",
			url: "/milestones",
			icon: Milestone,
		},
		{
			title: "Comparisons",
			url: "/comparisons",
			icon: ArrowRightLeft,
			items: [
				{
					title: "Year-over-Year",
					url: "/comparisons/year-over-year",
					icon: CalendarRange,
				},
				{
					title: "Artist vs Artist",
					url: "/comparisons/artist-vs-artist",
					icon: UsersRound,
				},
			],
		},
	],
	settings: [
		{
			title: "Package",
			url: "/settings/package",
			icon: PackageIcon as LucideIcon,
			alwaysVisible: true,
		},
		{
			title: "About",
			url: "/settings/about",
			icon: InfoIcon as LucideIcon,
		},
	],
	navSecondary: [
		{
			title: "Github",
			url: "https://github.com/aBgAmeuR/Harmony",
			icon: Github,
		},
	],
};
