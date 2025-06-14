"use client";

import AddToHomeScreen from "@/components/addtohome/add-to-home";
import DashboardWrapper2 from "@/components/nav/dashboard-wrapper2";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="absolute -z-20 h-full w-full bg-[radial-gradient(#bbf7d0_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#052e16_1px,transparent_1px)]"></div>
        <AddToHomeScreen />
        <DashboardWrapper2>{children}</DashboardWrapper2>
      </div>
    </>
  );
}
