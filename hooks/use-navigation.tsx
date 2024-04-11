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
  const [isExploreActive, setIsExploreActive] = useState(false);
  const [isNotificationsActive, setIsNotificationsActive] = useState(false);
  const [isMessagesActive, setIsMessagesActive] = useState(false);

  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbStore[]>([]);

  useEffect(() => {
    setIsDashboardActive(false);
    setIsExploreActive(false);
    setIsNotificationsActive(false);
    setIsMessagesActive(false);

    switch (pathname) {
      case "/dashboard":
        setIsDashboardActive(true);
        setBreadcrumb([{ label: "Dashboard", href: "/dashboard" }]);
        break;
      case "/play":
        setIsExploreActive(true);
        setBreadcrumb([
          { label: "Dashboard", href: "/dashboard" },
          { label: "Play", href: "/play" },
        ]);
        break;
      case "/picks":
        setIsNotificationsActive(true);
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
      default:
        // Handle any other cases here
        break;
    }
  }, [pathname]);

  return {
    isDashboardActive,
    isExploreActive,
    isNotificationsActive,
    isMessagesActive,
    breadcrumb,
  };
};

export default useNavigation;
