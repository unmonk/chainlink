import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { leagueLogos } from "@/convex/utils";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { LeagueRadarChart } from "./league-radar-chart";
import { MonthlyStatsChart } from "./monthly-stats-chart";
import { LeaguePieChart } from "./league-pie-chart";
import { Skeleton } from "../ui/skeleton";
import { Doc } from "@/convex/_generated/dataModel";
import NumberTicker from "../ui/number-ticker";

interface UserStatsProps {
  user: Doc<"users">;
}

const UserStats = ({ user }: UserStatsProps) => {
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

  const ratio = totalWins / (totalWins + totalLosses);
  const winRate = ratio * 100;

  return (
    <Card className="bg-background/20">
      <CardHeader>
        <CardTitle className="text-center">{user?.name}&apos;s Stats</CardTitle>
        <CardDescription className="text-center text-xl font-bold">
          <NumberTicker value={winRate} decimalPlaces={2} direction="up" />% Win
          Rate
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center px-2 py-2 flex-wrap gap-1">
        {!user && (
          <Skeleton className="h-8 w-16 inline-flex items-center rounded-full border px-2.5 py-0.5" />
        )}
        {user && (
          <Badge className="bg-green-500 text-white text-nowrap">
            <NumberTicker value={totalWins} direction="up" /> Wins
          </Badge>
        )}
        {!user && (
          <Skeleton className="h-8 w-16 inline-flex items-center rounded-full border px-2.5 py-0.5" />
        )}
        {user && (
          <Badge className="bg-red-500 text-white text-nowrap">
            <NumberTicker value={totalLosses} direction="up" /> Losses
          </Badge>
        )}
        {!user && (
          <Skeleton className="h-8 w-16 inline-flex items-center rounded-full border px-2.5 py-0.5" />
        )}
        {user && (
          <Badge className="bg-gray-500 text-white text-nowrap">
            <NumberTicker value={totalPushes} direction="up" /> Pushes
          </Badge>
        )}
      </CardContent>
      <CardContent className="grid gap-2 grid-cols-1">
        <LeagueRadarChart leagueData={leagueChartData} />
      </CardContent>
      <CardContent>
        <div className="flex flex-col gap-2 border rounded-lg p-2">
          <h3 className="text-2xl mt-2 text-center font-semibold">
            League Stats
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Breakdown of performance across different leagues
          </p>
          <div className="grid gap-2 grid-cols-4 mt-1 items-center">
            {!user &&
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-lg " />
              ))}
            {user &&
              Object.entries(
                Object.values(user.monthlyStats).reduce<
                  Record<
                    string,
                    { wins: number; losses: number; pushes: number }
                  >
                >((acc, monthStats) => {
                  Object.entries(
                    //@ts-ignore
                    monthStats.statsByLeague as Record<
                      string,
                      { wins: number; losses: number; pushes: number }
                    >
                  ).forEach(([league, stats]) => {
                    if (!acc[league]) {
                      acc[league] = { wins: 0, losses: 0, pushes: 0 };
                    }
                    acc[league].wins += stats.wins;
                    acc[league].losses += stats.losses;
                    acc[league].pushes += stats.pushes;
                  });
                  return acc;
                }, {})
              )
                .sort(([, statsA], [, statsB]) => {
                  const totalA = statsA.wins + statsA.losses + statsA.pushes;
                  const totalB = statsB.wins + statsB.losses + statsB.pushes;
                  return totalB - totalA; // Sort in descending order
                })
                .map(([league, stats]) => (
                  <div
                    key={league}
                    className="flex flex-col items-center rounded-lg bg-accent/40 text-center p-1 w-full h-full"
                  >
                    <span className="sr-only">{league}</span>
                    <Image
                      src={leagueLogos[league] ?? "/logo.svg"}
                      alt={league}
                      width={50}
                      height={50}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                      }}
                    />
                    <div className="flex justify-center px-1 py-2 flex-nowrap text-xs sm:text-sm md:text-base">
                      {stats.wins} - {stats.losses} - {stats.pushes}
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
        <MonthlyStatsChart monthlyData={monthlyChartData} />
      </CardContent>

      <CardContent>
        <LeaguePieChart leagueChartData={leagueChartData} />
      </CardContent>
    </Card>
  );
};

export default UserStats;
