import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboardIcon,
  CalendarClockIcon,
  CalendarSearchIcon,
} from "lucide-react";
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
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Admin
          </h2>
          <div className="space-y-1">
            {ADMIN_LINKS.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                className="w-full justify-start"
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.name}
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
                variant="ghost"
                className="w-full justify-start"
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
