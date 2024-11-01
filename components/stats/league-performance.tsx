"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Line,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format } from "date-fns";
import { ACTIVE_LEAGUES, getLeagueColor } from "@/convex/utils";

type LeagueMonthlyPerformanceChartProps = {
  leagueMonthlyStats: {
    month: string;
    [league: string]:
      | string
      | {
          wins: number;
          losses: number;
          winRate: number;
          totalPicks: number;
        };
  }[];
};

export function LeagueMonthlyPerformanceChart({
  leagueMonthlyStats,
}: LeagueMonthlyPerformanceChartProps) {
  if (!leagueMonthlyStats || leagueMonthlyStats.length === 0) return null;

  const transformedStats = leagueMonthlyStats.map((stat) => {
    const transformed: any = { month: stat.month };
    Object.entries(stat).forEach(([league, value]) => {
      if (league !== "month" && typeof value === "object") {
        transformed[league] = value.totalPicks;
      }
    });
    return transformed;
  });

  const chartConfig = ACTIVE_LEAGUES.reduce<ChartConfig>((acc, league) => {
    acc[league] = { label: league, color: getLeagueColor(league) };
    return acc;
  }, {});

  return (
    <div className="grid gap-6 grid-cols-1">
      <Card className="bg-background/20">
        <CardHeader className="items-center">
          <CardTitle>Monthly League Preference</CardTitle>
          <CardDescription>
            Showing number of picks for each league for the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={transformedStats}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />

              {/* <defs>
              {Object.entries(chartConfig).map(([league, config], index) => (
                <linearGradient
                  id={`fill${league}`}
                  key={`fill${league}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={config.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={config.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs> */}
              {Object.entries(chartConfig).map(([league, config], index) => {
                return (
                  <Bar
                    key={league}
                    dataKey={league}
                    type="natural"
                    fill={config.color}
                    fillOpacity={0.4}
                    radius={index === 0 ? [0, 0, 4, 4] : [4, 4, 0, 0]}
                    stroke={config.color}
                    stackId="a"
                  />
                );
              })}
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
