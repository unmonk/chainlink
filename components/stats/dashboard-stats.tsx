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
import { formatDate } from "date-fns";

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

  if (user?.monthlyStats) {
    // Create an object to store aggregated league stats
    const leagueStats: Record<
      string,
      { wins: number; losses: number; pushes: number }
    > = {};

    Object.keys(user.monthlyStats).forEach((month) => {
      console.log(user.monthlyStats[month], month);
      if (!user.monthlyStats[month]) return;

      monthlyChartData.push({
        month: month,
        wins: user.monthlyStats[month].wins,
        losses: user.monthlyStats[month].losses,
        pushes: user.monthlyStats[month].pushes,
      });

      if (!user.monthlyStats[month].statsByLeague) return;

      Object.entries(user.monthlyStats[month].statsByLeague).forEach(
        ([league, stats]) => {
          if (!leagueStats[league]) {
            leagueStats[league] = { wins: 0, losses: 0, pushes: 0 };
          }
          if (typeof stats === "object" && stats !== null) {
            leagueStats[league].wins +=
              "wins" in stats ? (stats.wins as number) : 0;
            leagueStats[league].losses +=
              "losses" in stats ? (stats.losses as number) : 0;
            leagueStats[league].pushes +=
              "pushes" in stats ? (stats.pushes as number) : 0;
          }
        }
      );
    });

    // Convert aggregated league stats to chart data format
    leagueChartData.push(
      ...Object.entries(leagueStats).map(([league, stats]) => ({
        league,
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
        <MonthlyStatsChart monthlyData={monthlyChartData} />
      </CardContent>
      <CardContent>
        <h3 className="text-lg mt-2">Stats By League</h3>
        <div className="grid gap-2 grid-cols-4 mt-1 items-center">
          {!user &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-lg " />
            ))}
          {user &&
            Object.keys(user.stats.statsByLeague).map((league) => (
              <div
                key={league}
                className="flex flex-col items-center rounded-lg bg-accent text-center p-1 w-full h-full"
              >
                <span className="sr-only">{league}</span>
                <Image
                  src={leagueLogos[league] ? leagueLogos[league] : "/logo.svg "}
                  alt={league}
                  width={50}
                  height={50}
                />
                <div className="flex justify-center px-1 py-2 flex-nowrap text-xs sm:text-sm md:text-base">
                  {/* <Badge className="bg-green-500 text-white text-nowrap">
                    {user.stats.statsByLeague[league].wins} Wins
                  </Badge>
                  <Badge className="bg-red-500 text-white text-nowrap">
                  {user.stats.statsByLeague[league].losses} Losses
                  </Badge>
                  <Badge className="bg-gray-500 text-white text-nowrap">
                  {user.stats.statsByLeague[league].pushes} Pushes
                </Badge> */}
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
      </CardContent>
    </Card>
  );
};

export default DashboardStats;
