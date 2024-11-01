"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/components/nav/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import useStoreUserEffect from "@/hooks/use-store-user";
import { SignedIn } from "@clerk/nextjs";

export default function DashboardWrapper2({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const userStore = useStoreUserEffect();

  if (!sidebar) return null;

  return (
    <SignedIn>
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)]  transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <p className="text-xs text-muted text-center">Chainlink 2024</p>
      </footer>
    </SignedIn>
  );
}
