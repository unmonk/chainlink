"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ACTIVE_LEAGUES, getLeagueColor } from "@/convex/utils";
import { AreaChart, Area } from "recharts";

interface LeagueWinsMonthlyChartProps {
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
}

export const LeagueWinsMonthlyChart: React.FC<LeagueWinsMonthlyChartProps> = ({
  leagueMonthlyStats,
}) => {
  if (!leagueMonthlyStats || leagueMonthlyStats.length === 0) return null;

  const chartConfig = ACTIVE_LEAGUES.reduce<ChartConfig>((acc, league) => {
    acc[league] = { label: league, color: getLeagueColor(league) };
    return acc;
  }, {});

  const transformedWinLossStats = leagueMonthlyStats.map((stat) => {
    const transformed: any = { month: stat.month };
    Object.entries(stat).forEach(([league, value]) => {
      if (league !== "month" && typeof value === "object") {
        transformed[`${league}_wins`] = value.wins;
        transformed[`${league}_losses`] = value.losses;
      }
    });
    return transformed;
  });
  return (
    <div className="absolute inset-x-0 bottom-0 h-full -z-10 opacity-20 overflow-hidden">
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={transformedWinLossStats}
          margin={{
            left: 12,
            right: 12,
          }}
          stackOffset="expand"
        >
          {/* <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            /> */}

          <defs>
            {Object.entries(chartConfig).map(([league, config]) => (
              <linearGradient
                key={`gradient-${league}`}
                id={`gradient-${league}-wins`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={config.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={config.color} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
          {Object.entries(chartConfig).map(([league, config]) => (
            <>
              <Area
                key={`${league}_wins`}
                type="monotone"
                dataKey={`${league}_wins`}
                name={`${league} Wins`}
                stroke={config.color}
                strokeWidth={1}
                fill={`url(#gradient-${league}-wins)`}
                stackId="1"
              />
            </>
          ))}
        </AreaChart>
      </ChartContainer>
    </div>
  );
};
