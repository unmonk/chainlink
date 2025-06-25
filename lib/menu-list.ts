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
  GemIcon,
  GalleryVerticalEnd,
  BellRingIcon,
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
      groupLabel: "Admin",
      menus: [
        {
          href: "/admin/matchups",
          label: "Matchups",
          active: pathname.includes("/admin/matchups"),
          icon: GalleryVerticalEnd,
          submenus: [
            {
              href: "/admin/matchups",
              label: "All Matchups",
              active: pathname === "/admin/matchups",
            },
            {
              href: "/admin/picks",
              label: "Picks",
              active: pathname === "/admin/picks",
            },
            {
              href: "/admin/matchups/create",
              label: "Create Matchup",
              active: pathname.includes("/admin/matchups/create"),
            },
            {
              href: "/admin/matchups/find",
              label: "Find Matchup",
              active: pathname.includes("/admin/matchups/find"),
            },
          ],
        },
        {
          href: "/admin/announcements",
          label: "Announcements",
          active: pathname.includes("/admin/announcements"),
          icon: ScrollTextIcon,
          submenus: [
            {
              href: "/admin/announcements",
              label: "All Announcements",
              active: pathname === "/admin/announcements",
            },
            {
              href: "/admin/announcements/create",
              label: "Create Announcement",
              active: pathname.includes("/admin/announcements/create"),
            },
          ],
        },
        {
          href: "/admin/sponsors",
          label: "Sponsors",
          active: pathname.includes("/admin/sponsors"),
          icon: GemIcon,
          submenus: [
            {
              href: "/admin/sponsors",
              label: "All Sponsors",
              active: pathname === "/admin/sponsors",
            },
            {
              href: "/admin/sponsors/create",
              label: "Create Sponsor",
              active: pathname.includes("/admin/sponsors/create"),
            },
            {
              href: "/admin/sponsors/featured",
              label: "Featured Sponsors",
              active: pathname.includes("/admin/sponsors/featured"),
            },
          ],
        },
        {
          href: "/admin/achievements",
          label: "Achievements",
          active: pathname.includes("/admin/achievements"),
          icon: TrophyIcon,
          submenus: [
            {
              href: "/admin/achievements",
              label: "All Achievements",
              active: pathname === "/admin/achievements",
            },
            {
              href: "/admin/achievements/create",
              label: "Create Achievement",
              active: pathname.includes("/admin/achievements/create"),
            },
            {
              href: "/admin/achievements/award",
              label: "Award Achievement",
              active: pathname.includes("/admin/achievements/award"),
            },
          ],
        },
        {
          href: "/admin/quiz",
          label: "Challenges",
          active: pathname.includes("/admin/quiz"),
          icon: ScrollTextIcon,
          submenus: [],
        },
        {
          href: "/admin/users",
          label: "Users",
          active: pathname.includes("/admin/users"),
          icon: Users,
          submenus: [],
        },
        {
          href: "/admin/squads",
          label: "Squads",
          active: pathname.includes("/admin/squads"),
          icon: RiTeamLine as LucideIcon,
          submenus: [],
        },

        {
          href: "/admin/notifications",
          label: "Notifications",
          active: pathname.includes("/admin/notifications"),
          icon: BellRingIcon,
          submenus: [],
        },
        {
          href: "/admin/actions",
          label: "Actions",
          active: pathname.includes("/admin/actions"),
          icon: ShieldAlertIcon,
          submenus: [],
        },
        {
          href: "/admin/shop",
          label: "Shop",
          active: pathname.includes("/admin/shop"),
          icon: CoinsIcon,
          submenus: [],
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
          signedIn: false,
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
