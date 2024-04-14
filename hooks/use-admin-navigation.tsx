"use client";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

type BreadcrumbStore = {
  label: string;
  href: string;
};

const useAdminNavigation = () => {
  const pathname = usePathname();
  const [isDashboardActive, setIsDashboardActive] = useState(false);
  const [isMatchupsActive, setIsMatchupsActive] = useState(false);
  const [isSettingsActive, setIsSettingsActive] = useState(false);
  const [isMessagesActive, setIsMessagesActive] = useState(false);

  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbStore[]>([]);

  useEffect(() => {
    setIsDashboardActive(false);
    setIsSettingsActive(false);
    setIsMatchupsActive(false);
    setIsMessagesActive(false);

    switch (pathname) {
      case "/admin":
        setIsDashboardActive(true);
        setBreadcrumb([{ label: "Admin Dashboard", href: "/admin" }]);
        break;
      case "/admin/matchups":
        setIsMatchupsActive(true);
        setBreadcrumb([
          { label: "Admin", href: "/admin" },
          { label: "Matchups", href: "/admin/matchups" },
        ]);
        break;
      case "/picks":
        setBreadcrumb([
          { label: "Admin", href: "/admin" },
          { label: "Picks", href: "/picks" },
        ]);
        break;
      case "/leaderboards":
        setIsMessagesActive(true);
        setBreadcrumb([
          { label: "Admin", href: "/admin" },
          { label: "Leaderboards", href: "/leaderboards" },
        ]);
        break;
      case "/settings":
      case "/settings/notifications":
        setIsSettingsActive(true);
        setBreadcrumb([
          { label: "Admin", href: "/admin" },
          { label: "Settings", href: "/settings" },
        ]);
        break;
      default:
        // Handle any other cases here
        break;
    }
  }, [pathname]);

  return {
    isDashboardActive,
    isSettingsActive,
    isMatchupsActive,
    isMessagesActive,
    breadcrumb,
  };
};

export default useAdminNavigation;
