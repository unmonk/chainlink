"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import DashboardCoins from "@/components/coins/dashboard-coins";
import { DashboardChain } from "@/components/chains/dashboard-chain";
import DashboardActivePick from "@/components/picks/dashboard-pick";
import DashboardStats from "@/components/stats/dashboard-stats";
import DashboardSquads from "@/components/squads/dashboard-squads";
import DashboardAchievements from "@/components/achievements/dashboard-achievements";

export default function Dashboard() {
  return (
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <DashboardCoins />
            <DashboardChain />
            <DashboardActivePick />
          </div>
          <DashboardStats />
          <Tabs defaultValue="today">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="today">
              <Card>
                <CardHeader className="px-7">
                  <CardTitle>Picks made in the last 24 hours</CardTitle>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="gap-2 flex-col flex">
          <Card className="min-h-96">Ads</Card>
          <DashboardAchievements />
          <DashboardSquads />
        </div>
      </main>
    </div>
  );
}