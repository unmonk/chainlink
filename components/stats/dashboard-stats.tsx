import { useQuery } from "convex/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { api } from "@/convex/_generated/api";
import { leagueLogos } from "@/convex/utils";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { LeagueRadarChart } from "./league-radar-chart";
import { MonthlyStatsChart } from "./monthly-stats-chart";
import { LeaguePieChart } from "./league-pie-chart";

const DashboardStats = () => {
  const user = useQuery(api.users.currentUser, {});
  const leagueChartData: {
    league: string;
    wins: number;
    losses: number;
    pushes: number;
  }[] = [];
  const monthlyChartData: {
    month: string;
    wins: number;
    losses: number;
    pushes: number;
    winRate: number;
  }[] = [];
  let totalWins = 0;
  let totalLosses = 0;
  let totalPushes = 0;

  if (user?.monthlyStats) {
    // Create an object to store aggregated monthly stats
    const monthlyStats: Record<
      string,
      {
        winRate: number;
        wins: number;
        losses: number;
        pushes: number;
      }
    > = {};

    // Aggregate stats by month and league from user.monthlyStats
    const leagueStats: Record<
      string,
      { wins: number; losses: number; pushes: number }
    > = {};

    Object.entries(user.monthlyStats).forEach(([month, monthStats]) => {
      if (typeof monthStats === "object" && monthStats !== null) {
        // Aggregate monthly stats
        monthlyStats[month] = {
          wins: (monthStats as any).wins || 0,
          losses: (monthStats as any).losses || 0,
          pushes: (monthStats as any).pushes || 0,
          winRate: (monthStats as any).winRate || 0,
        };

        //count total wins, losses, pushes
        totalWins += (monthStats as any).wins || 0;
        totalLosses += (monthStats as any).losses || 0;
        totalPushes += (monthStats as any).pushes || 0;

        // Aggregate league stats
        if ("statsByLeague" in monthStats) {
          const statsByLeague = (monthStats as any).statsByLeague;

          Object.entries(statsByLeague).forEach(([league, stats]) => {
            if (typeof stats === "object" && stats !== null) {
              if (!leagueStats[league]) {
                leagueStats[league] = { wins: 0, losses: 0, pushes: 0 };
              }
              leagueStats[league].wins += (stats as any).wins || 0;
              leagueStats[league].losses += (stats as any).losses || 0;
              leagueStats[league].pushes += (stats as any).pushes || 0;
            }
          });
        }
      }
    });

    // Convert leagueStats to an array for LeagueRadarChart
    Object.keys(leagueStats).forEach((league) => {
      leagueChartData.push({
        league,
        wins: leagueStats[league].wins,
        losses: leagueStats[league].losses,
        pushes: leagueStats[league].pushes,
      });
    });

    // Convert monthlyStats to an array for MonthlyStatsChart
    Object.keys(monthlyStats).forEach((month) => {
      monthlyChartData.push({
        month,
        wins: monthlyStats[month].wins,
        losses: monthlyStats[month].losses,
        pushes: monthlyStats[month].pushes,
        winRate: monthlyStats[month].winRate,
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stats</CardTitle>
        <CardDescription>All-Time Statistics</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center px-2 py-2 flex-wrap gap-1">
        {!user && (
          <Skeleton className="h-8 w-16 inline-flex items-center rounded-full border px-2.5 py-0.5" />
        )}
        {user && (
          <Badge className="bg-green-500 text-white text-nowrap">
            {totalWins} Wins
          </Badge>
        )}
        {!user && (
          <Skeleton className="h-8 w-16 inline-flex items-center rounded-full border px-2.5 py-0.5" />
        )}
        {user && (
          <Badge className="bg-red-500 text-white text-nowrap">
            {totalLosses} Losses
          </Badge>
        )}
        {!user && (
          <Skeleton className="h-8 w-16 inline-flex items-center rounded-full border px-2.5 py-0.5" />
        )}
        {user && (
          <Badge className="bg-gray-500 text-white text-nowrap">
            {totalPushes} Pushes
          </Badge>
        )}
      </CardContent>
      <CardContent className="grid gap-2 grid-cols-1">
        <LeagueRadarChart leagueData={leagueChartData} />
      </CardContent>
    </Card>
  );
};

export default DashboardStats;
