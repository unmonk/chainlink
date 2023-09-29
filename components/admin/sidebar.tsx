"use client";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboardIcon,
  CalendarClockIcon,
  CalendarSearchIcon,
  BusIcon,
  CalendarDaysIcon,
  AwardIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface AdminSidebarProps {
  className?: string;
}

const ADMIN_LINKS = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboardIcon,
  },
  {
    name: "Daily Jobs",
    href: "/admin/crons",
    icon: CalendarClockIcon,
  },
];

const GAME_INFO_LINKS = [
  {
    name: "Active Picks",
    href: "/admin/picks",
    icon: CalendarSearchIcon,
  },
  {
    name: "Matchups",
    href: "/admin/matchups",
    icon: CalendarDaysIcon,
  },
  {
    name: "Squads",
    href: "/admin/squads",
    icon: BusIcon,
  },
  {
    name: "Achievements",
    href: "/admin/achievements",
    icon: AwardIcon,
  },
];

const AdminSidebar: FC<AdminSidebarProps> = ({ className }) => {
  const pathname = usePathname();
  return (
    <div className={cn("w-1/5 pb-12", className)}>
      <div className="py-4 space-y-4">
        <div className="px-3 py-2">
          <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
            Admin
          </h2>
          <div className="space-y-1">
            {ADMIN_LINKS.map((link) => (
              <Button
                key={link.name}
                variant={pathname === link.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={link.href}>
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
            Game Info
          </h2>
          <div className="space-y-1">
            {GAME_INFO_LINKS.map((link) => (
              <Button
                key={link.name}
                variant={pathname === link.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={link.href}>
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AdminMobileTopBarProps {
  className?: string;
}

export const AdminMobileTopBar: FC<AdminMobileTopBarProps> = ({
  className,
}) => {
  const pathname = usePathname();
  return (
    <div className={cn("w-5/6 flex flex-col gap-1 px-2", className)}>
      <div className="flex flex-row gap-1">
        {ADMIN_LINKS.map((link) => (
          <Button
            key={link.name}
            variant={pathname === link.href ? "secondary" : "outline"}
            className=""
            asChild
          >
            <Link href={link.href}>
              <link.icon className="w-4 h-4 mr-2" />
              {link.name}
            </Link>
          </Button>
        ))}
      </div>
      <div className="flex flex-row flex-wrap gap-1">
        {GAME_INFO_LINKS.map((link) => (
          <Button
            key={link.name}
            variant={pathname === link.href ? "secondary" : "outline"}
            className=""
            asChild
          >
            <Link href={link.href}>
              <link.icon className="w-4 h-4 mr-2" />
              {link.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
