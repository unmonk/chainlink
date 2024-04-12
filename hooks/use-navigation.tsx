"use client";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

type BreadcrumbStore = {
  label: string;
  href: string;
};

const useNavigation = () => {
  const pathname = usePathname();
  const [isDashboardActive, setIsDashboardActive] = useState(false);
  const [isPlayActive, setIsPlayActive] = useState(false);
  const [isSettingsActive, setIsSettingsActive] = useState(false);
  const [isMessagesActive, setIsMessagesActive] = useState(false);

  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbStore[]>([]);

  useEffect(() => {
    setIsDashboardActive(false);
    setIsSettingsActive(false);
    setIsPlayActive(false);
    setIsMessagesActive(false);

    switch (pathname) {
      case "/dashboard":
        setIsDashboardActive(true);
        setBreadcrumb([{ label: "Dashboard", href: "/dashboard" }]);
        break;
      case "/play":
        setIsPlayActive(true);
        setBreadcrumb([
          { label: "Dashboard", href: "/dashboard" },
          { label: "Play", href: "/play" },
        ]);
        break;
      case "/picks":
        setBreadcrumb([
          { label: "Dashboard", href: "/dashboard" },
          { label: "Picks", href: "/picks" },
        ]);
        break;
      case "/leaderboards":
        setIsMessagesActive(true);
        setBreadcrumb([
          { label: "Dashboard", href: "/dashboard" },
          { label: "Leaderboards", href: "/leaderboards" },
        ]);
        break;
      case "/settings":
      case "/settings/notifications":
        setIsSettingsActive(true);
        setBreadcrumb([
          { label: "Dashboard", href: "/dashboard" },
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
    isPlayActive,
    isMessagesActive,
    breadcrumb,
  };
};

export default useNavigation;
