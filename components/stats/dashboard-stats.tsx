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
import Image from "next/legacy/image";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { LeagueRadarChart } from "./league-radar-chart";
import { MonthlyStatsChart } from "./monthly-stats-chart";
import { formatDate } from "date-fns";
import { LeaguePieChart } from "./league-pie-chart";
import { ChartConfig } from "../ui/chart";
import { parseISO } from "date-fns";

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
  }[] = [];

  if (user?.stats) {
    // Create an object to store aggregated league stats
    const leagueStats: Record<
      string,
      { wins: number; losses: number; pushes: number }
    > = {};
    // Aggregate stats by league from user.stats.statsByLeague
    Object.entries(user.stats.statsByLeague).forEach(([league, stats]) => {
      if (typeof stats === "object" && stats !== null) {
        leagueStats[league] = {
          wins: (stats as any).wins || 0,
          losses: (stats as any).losses || 0,
          pushes: (stats as any).pushes || 0,
        };
      }
    });

    // Convert aggregated league stats to chart data format
    leagueChartData.push(
      ...Object.entries(leagueStats).map(([league, stats]) => ({
        league,
        ...stats,
      }))
    );
  }

  if (user?.monthlyStats) {
    // Create an object to store aggregated monthly stats
    const monthlyStats: Record<
      string,
      { wins: number; losses: number; pushes: number }
    > = {};

    // Aggregate stats by month from user.monthlyStats
    Object.entries(user.monthlyStats).forEach(([month, stats]) => {
      if (typeof stats === "object" && stats !== null) {
        monthlyStats[month] = {
          wins: (stats as any).wins || 0,
          losses: (stats as any).losses || 0,
          pushes: (stats as any).pushes || 0,
        };
      }
    });

    // Convert aggregated monthly stats to chart data format
    monthlyChartData.push(
      ...Object.entries(monthlyStats).map(([month, stats]) => ({
        month,
        ...stats,
      }))
    );
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
            {user.stats.wins} Wins
          </Badge>
        )}
        {!user && (
          <Skeleton className="h-8 w-16 inline-flex items-center rounded-full border px-2.5 py-0.5" />
        )}
        {user && (
          <Badge className="bg-red-500 text-white text-nowrap">
            {user.stats.losses} Losses
          </Badge>
        )}
        {!user && (
          <Skeleton className="h-8 w-16 inline-flex items-center rounded-full border px-2.5 py-0.5" />
        )}
        {user && (
          <Badge className="bg-gray-500 text-white text-nowrap">
            {user.stats.pushes} Pushes
          </Badge>
        )}
      </CardContent>
      <CardContent className="grid gap-2 grid-cols-1">
        <LeagueRadarChart leagueData={leagueChartData} />
      </CardContent>
      <CardContent>
        <MonthlyStatsChart monthlyData={monthlyChartData} />
      </CardContent>
      <CardContent>
        <div className="flex flex-col gap-2 border rounded-lg p-2">
          <h3 className="text-2xl mt-2 text-center font-semibold">
            Stats By League
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Total results by league
          </p>
          <div className="grid gap-2 grid-cols-4 mt-1 items-center">
            {!user &&
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-lg " />
              ))}
            {user &&
              Object.keys(user.stats.statsByLeague)
                .sort((a, b) => {
                  const totalA =
                    user.stats.statsByLeague[a].wins +
                    user.stats.statsByLeague[a].losses +
                    user.stats.statsByLeague[a].pushes;
                  const totalB =
                    user.stats.statsByLeague[b].wins +
                    user.stats.statsByLeague[b].losses +
                    user.stats.statsByLeague[b].pushes;
                  return totalB - totalA; // Sort in descending order
                })
                .map((league) => (
                  <div
                    key={league}
                    className="flex flex-col items-center rounded-lg bg-accent text-center p-1 w-full h-full"
                  >
                    <span className="sr-only">{league}</span>
                    <Image
                      src={
                        leagueLogos[league] ? leagueLogos[league] : "/logo.svg "
                      }
                      alt={league}
                      width={50}
                      height={50}
                    />
                    <div className="flex justify-center px-1 py-2 flex-nowrap text-xs sm:text-sm md:text-base">
                      {user.stats.statsByLeague[league].wins} -{" "}
                      {user.stats.statsByLeague[league].losses} -{" "}
                      {user.stats.statsByLeague[league].pushes}
                    </div>
                    <p className="text-xs font-light text-muted-foreground">
                      {league}
                    </p>
                  </div>
                ))}
          </div>
        </div>
      </CardContent>
      <CardContent>
        <LeaguePieChart leagueChartData={leagueChartData} />
      </CardContent>
    </Card>
  );
};

export default DashboardStats;
