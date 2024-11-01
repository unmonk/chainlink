"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import DashboardCoins from "@/components/coins/dashboard-coins";
import { DashboardChain } from "@/components/chains/dashboard-chain";
import DashboardActivePick from "@/components/picks/dashboard-pick";
import DashboardStats from "@/components/stats/dashboard-stats";
import DashboardSquads from "@/components/squads/dashboard-squads";
import DashboardAchievements from "@/components/achievements/dashboard-achievements";
import Image from "next/image";
import Link from "next/link";
import { ContentLayout } from "@/components/nav/content-layout";
import ProfileAchievements from "@/components/profile/profile-achievements";
import DashboardQuiz from "@/components/quiz/dashboard-quiz";

export default function Dashboard() {
  return (
    <ContentLayout title="Dashboard">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <DashboardActivePick />
              <DashboardCoins />
              <DashboardChain />
            </div>
            <DashboardStats />
            {/* <Tabs defaultValue="today">
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
          </Tabs> */}
          </div>
          <div className="gap-2 flex-col flex">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <div className="flex justify-center m-2">
                <DashboardAchievements />
              </div>
            </Card>
            {/* <DashboardSquads /> */}
            <DashboardQuiz />
            <Card className="">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Sponsors & Partners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 grid-rows-2 gap-1">
                  <div className="overflow-hidden rounded-md justify-self-center">
                    <Link href="https://www.theroseleague.com/" target="_blank">
                      <Image
                        src="/images/ad1.png"
                        className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"
                        alt="The Rose League"
                        width={250}
                        height={250}
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
                      />
                    </Link>
                  </div>
                  <div className="overflow-hidden rounded-md justify-self-center">
                    {/* <Image
                    src="/images/ad3.png"
                    className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"
                    alt="602 Pick'em"
                    width={250}
                    height={250}
                  /> */}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <CardDescription className="text-xs text-muted-foreground">
                  Interested in promoting your product or app with ChainLink?
                  Contact us{" "}
                  <a
                    href="mailto:admin@chainlink.st?subject=Advertising Inquiry"
                    className="text-accent-foreground hover:underline"
                  >
                    here{" "}
                  </a>
                </CardDescription>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </ContentLayout>
  );
}
