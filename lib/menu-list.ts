import { Logo } from "@/components/ui/logo";
import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Link,
  TrophyIcon,
  UserCheckIcon,
  ShieldAlertIcon,
  ListIcon,
  UserRound,
  CoinsIcon,
  ShirtIcon,
  ScrollTextIcon,
} from "lucide-react";

import { RiTeamLine } from "react-icons/ri";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getAdminMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin",
          label: "Admin",
          active: pathname.includes("/admin"),
          icon: ShieldAlertIcon,
          submenus: [
            {
              href: "/admin/matchups",
              label: "Matchups",
              active: pathname.includes("/admin/matchups"),
            },
            {
              href: "/admin/users",
              label: "Users",
              active: pathname.includes("/admin/users"),
            },

            {
              href: "/admin/announcements",
              label: "Announcements",
              active: pathname.includes("/admin/announcements"),
            },

            {
              href: "/admin/achievements",
              label: "Achievements",
              active: pathname.includes("/admin/achievements"),
            },
            {
              href: "/admin/actions",
              label: "Actions",
              active: pathname.includes("/admin/actions"),
            },
            {
              href: "/admin/quiz",
              label: "Challenge",
              active: pathname.includes("/admin/quiz"),
            },
            {
              href: "/admin/notifications",
              label: "Notifications",
              active: pathname.includes("/admin/notifications"),
            },
            {
              href: "/admin/squads",
              label: "Squads",
              active: pathname.includes("/admin/squads"),
            },
            {
              href: "/shop",
              label: "Shop",
              active: pathname.includes("/shop"),
            },
          ],
        },
      ],
    },
  ];
}

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: "/u",
          label: "My Profile",
          active: pathname.includes("/u/"),
          icon: UserRound,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "ChainLink",
      menus: [
        {
          href: "/play",
          label: "Play ChainLink",
          active: pathname.includes("/play"),
          icon: Link,
          submenus: [],
        },
        {
          href: "/picks",
          label: "My Picks",
          active: pathname.includes("/picks"),
          icon: UserCheckIcon,
          submenus: [],
        },
        {
          href: "/squads",
          label: "Squads",
          active: pathname.includes("/squads"),
          icon: RiTeamLine as LucideIcon,
          submenus: [],
        },
        {
          href: "/leaderboards",
          label: "Leaderboards",
          active: pathname.includes("/leaderboards"),
          icon: TrophyIcon,
          submenus: [],
        },
        {
          href: "/challenge",
          label: "Challenge",
          active: pathname.includes("/challenge"),
          icon: ScrollTextIcon,
          submenus: [],
        },
        {
          href: "/games",
          label: "Games",
          active: pathname.includes("/games"),
          icon: CoinsIcon,
          submenus: [
            {
              href: "/games/blackjack",
              label: "Blackjack",
              active: pathname.includes("/games/blackjack"),
            },
            {
              href: "/games/spin",
              label: "Spin",
              active: pathname.includes("/games/spin"),
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Other",
      menus: [
        {
          href: "/friends",
          label: "Friends",
          active: pathname.includes("/friends"),
          icon: Users,
          submenus: [],
        },
        {
          href: "/settings",
          label: "Settings",
          active: pathname.includes("/settings"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
