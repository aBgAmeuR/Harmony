import {
  ArrowRightLeft,
  AudioLines,
  Binary,
  CalendarRange,
  ChartLine,
  ChartNoAxesCombined,
  Disc3,
  Info,
  LayoutDashboard,
  Milestone,
  Package,
  TrendingUp,
  TrendingUpDown,
  UserRoundPen,
  UsersRound
} from "lucide-react";

import { Icons } from "../icons";

export const data = {
  header: {
    name: "Harmony",
    Logo: Icons.logo
  },
  stats: [
    {
      title: "Overview",
      url: "/overview",
      icon: LayoutDashboard
    },
    {
      title: "Rankings",
      url: "/rankings",
      icon: TrendingUp,
      isActive: true,
      items: [
        {
          title: "Tracks",
          url: "/rankings/tracks",
          icon: AudioLines
        },
        {
          title: "Albums",
          url: "/rankings/albums",
          icon: Disc3
        },
        {
          title: "Artists",
          url: "/rankings/artists",
          icon: UserRoundPen
        }
      ]
    },
    {
      title: "Stats",
      url: "/stats",
      icon: ChartNoAxesCombined,
      isActive: true,
      items: [
        {
          title: "Numbers",
          url: "/stats/numbers",
          icon: Binary
        },
        {
          title: "Listening Habits",
          url: "/stats/listening-habits",
          icon: ChartLine
        },
        {
          title: "Activity",
          url: "/stats/activity",
          icon: TrendingUpDown
        }
      ]
    }
  ],
  advanced: [
    {
      title: "Milestones",
      url: "/milestones",
      icon: Milestone
    },
    {
      title: "Comparisons",
      url: "/comparisons",
      icon: ArrowRightLeft,
      isActive: true,
      items: [
        {
          title: "Year-over-Year",
          url: "/comparisons/year-over-year",
          icon: CalendarRange
        },
        {
          title: "Artist vs Artist",
          url: "/comparisons/artist-vs-artist",
          icon: UsersRound
        }
      ]
    }
  ],
  settings: [
    {
      title: "Package",
      url: "/settings/package",
      icon: Package
    },
    {
      title: "About",
      url: "/settings/about",
      icon: Info
    }
  ]
};