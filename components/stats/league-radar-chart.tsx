"use client";

import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  wins: {
    label: "wins",
    color: "hsl(var(--chart-5))",
  },
  losses: {
    label: "losses",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface LeagueRadarChartProps {
  leagueData: { league: string; wins: number; losses: number }[];
}

export const LeagueRadarChart: React.FC<LeagueRadarChartProps> = ({
  leagueData,
}) => {
  if (leagueData.length === 0) {
    return null;
  }

  return (
    <Card className="bg-background/20">
      <CardHeader className="items-center pb-4">
        <CardTitle>League Radar</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="pb-0 w-full">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-full"
        >
          <RadarChart data={leagueData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey="league" />
            <PolarGrid />
            <Radar dataKey="wins" fill="var(--color-wins)" fillOpacity={0.6} />
            <Radar
              dataKey="losses"
              fill="var(--color-losses)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
