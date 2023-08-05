import { AwardIcon, LayoutDashboardIcon, User2Icon } from "lucide-react";
export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "ChainLink",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Play",
      href: "/dashboard",
    },
  ],
  navMenuItems: [
    {
      label: "Dashboard",
      href: "/dashboard",
      Icon: LayoutDashboardIcon,
    },

    {
      label: "Leaderboards",
      href: "/leaderboards",
      Icon: AwardIcon,
    },
    {
      label: "Profile",
      href: "/profile",
      Icon: User2Icon,
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui-docs-v2.vercel.app",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
