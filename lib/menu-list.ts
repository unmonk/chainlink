import {
  Users,
  Settings,
  LayoutGrid,
  LucideIcon,
  Link,
  TrophyIcon,
  UserCheckIcon,
  ShieldAlertIcon,
  UserRound,
  CoinsIcon,
  ScrollTextIcon,
  UserPlusIcon,
} from "lucide-react";
import { MdDatasetLinked } from "react-icons/md";

import { RiTeamLine } from "react-icons/ri";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  signedIn?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
  signedIn?: boolean;
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
              href: "/admin/picks",
              label: "Picks",
              active: pathname.includes("/admin/picks"),
            },
            {
              href: "/admin/matchups/find",
              label: "Find Matchup",
              active: pathname.includes("/admin/matchups/find"),
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
              href: "/admin/sponsors",
              label: "Sponsors",
              active: pathname.includes("/admin/sponsors"),
            },
            {
              href: "/admin/shop",
              label: "Shop",
              active: pathname.includes("/admin/shop"),
            },
            {
              href: "/admin/users",
              label: "Users",
              active: pathname.includes("/admin/users"),
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
          signedIn: false,
        },
        {
          href: "/u",
          label: "My Profile",
          active: pathname.includes("/u/"),
          icon: UserRound,
          submenus: [],
          signedIn: true,
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
          signedIn: false,
        },
        {
          href: "/picks",
          label: "My Picks",
          active: pathname.includes("/picks"),
          icon: UserCheckIcon,
          submenus: [],
          signedIn: true,
        },
        {
          href: "/squads",
          label: "Squads",
          active: pathname.includes("/squads"),
          icon: RiTeamLine as LucideIcon,
          submenus: [],
          signedIn: false,
        },
        {
          href: "/leaderboards",
          label: "Leaderboards",
          active: pathname.includes("/leaderboards"),
          icon: TrophyIcon,
          submenus: [],
          signedIn: false,
        },
        {
          href: "/challenge",
          label: "Challenge",
          active: pathname.includes("/challenge"),
          icon: ScrollTextIcon,
          submenus: [],
          signedIn: false,
        },
        {
          href: "/shop",
          label: "Link Shop",
          active: pathname.includes("/shop"),
          icon: MdDatasetLinked as LucideIcon,
          submenus: [],
          signedIn: true,
        },
        {
          href: "/games",
          label: "Games",
          active: pathname.includes("/games"),
          icon: CoinsIcon,
          signedIn: true,
          submenus: [
            {
              href: "/games/blackjack",
              label: "Blackjack",
              active: pathname.includes("/games/blackjack"),
              signedIn: true,
            },
            {
              href: "/games/spin",
              label: "Spin",
              active: pathname.includes("/games/spin"),
              signedIn: true,
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
          signedIn: true,
          submenus: [],
        },
        {
          href: "/settings",
          label: "Settings",
          active: pathname.includes("/settings"),
          icon: Settings,
          submenus: [],
          signedIn: true,
        },
      ],
    },
  ];
}
