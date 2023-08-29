"use client";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboardIcon,
  CalendarClockIcon,
  CalendarSearchIcon,
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
    name: "Schedule Jobs",
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
];

const AdminSidebar: FC<AdminSidebarProps> = ({ className }) => {
  const pathname = usePathname();
  return (
    <div className={cn("pb-12 w-1/5", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
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
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
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
                  <link.icon className="mr-2 h-4 w-4" />
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
  return (
    <div className={cn("flex flex-col px-2", className)}>
      <div className="flex flex-row">
        {ADMIN_LINKS.map((link) => (
          <Button key={link.name} variant="ghost" className="" asChild>
            <Link href={link.href}>
              <link.icon className="mr-2 h-4 w-4" />
              {link.name}
            </Link>
          </Button>
        ))}
      </div>
      <div className="flex flex-row">
        {GAME_INFO_LINKS.map((link) => (
          <Button key={link.name} variant="ghost" className="" asChild>
            <Link href={link.href}>
              <link.icon className="mr-2 h-4 w-4" />
              {link.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
