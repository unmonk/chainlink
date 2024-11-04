"use client";

import DashboardCoins from "@/components/dashboard/dashboard-coins";
import { DashboardChain } from "@/components/dashboard/dashboard-chain";
import DashboardActivePick from "@/components/dashboard/dashboard-pick";
import DashboardStats from "@/components/dashboard/dashboard-stats";
import DashboardAchievements from "@/components/dashboard/dashboard-achievements";
import { ContentLayout } from "@/components/nav/content-layout";
import DashboardQuiz from "@/components/dashboard/dashboard-quiz";
import DashboardAnnouncements from "@/components/dashboard/dashboard-announcements";
import DashboardAdsSponsors from "@/components/dashboard/dashboard-ads-sponsors";

export default function Dashboard() {
  return (
    <ContentLayout title="Dashboard">
      <main className="grid w-full grid-cols-1 gap-4 lg:grid-cols-4 lg:grid-rows-6">
        <div className="lg:col-span-3 lg:row-span-1">
          <DashboardActivePick />
        </div>
        <div className="lg:col-span-1 lg:row-span-1 flex flex-col gap-4 h-full">
          <DashboardChain />
          <DashboardCoins />
        </div>

        <DashboardAnnouncements />

        <div className="lg:col-span-4 lg:row-span-2">
          <DashboardStats />
        </div>
        <div className="lg:col-span-2 lg:row-span-1 flex flex-col gap-4 h-full">
          <DashboardAchievements />
          <DashboardQuiz />
        </div>
        <div className="lg:col-span-1 lg:row-span-1 flex flex-col gap-4 h-full"></div>
        <div className="lg:col-span-1 lg:row-span-1">
          <DashboardAdsSponsors />
        </div>
      </main>
    </ContentLayout>
  );
}
