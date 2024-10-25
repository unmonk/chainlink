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
} from "lucide-react";

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
              href: "/shop",
              label: "Shop",
              active: pathname.includes("/shop"),
            },
            {
              href: "/admin/matchups",
              label: "Matchups",
              active: pathname.includes("/admin/matchups"),
            },
            {
              href: "/admin/achievements",
              label: "Achievements",
              active: pathname.includes("/admin/achievements"),
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
          href: "/leaderboards",
          label: "Leaderboards",
          active: pathname.includes("/leaderboards"),
          icon: TrophyIcon,
          submenus: [],
        },
        {
          href: "/spin",
          label: "Spin",
          active: pathname.includes("/spin"),
          icon: CoinsIcon,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Other",
      menus: [
        {
          href: "/u",
          label: "My Profile",
          active: pathname.includes("/u"),
          icon: UserRound,
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
