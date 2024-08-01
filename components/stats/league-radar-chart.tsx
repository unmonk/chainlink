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

const chartData = [
  { league: "NFL", wins: 186, losses: 80 },
  { league: "UFL", wins: 305, losses: 200 },
  { league: "NBA", wins: 237, losses: 120 },
  { league: "WNBA", wins: 73, losses: 190 },
  { league: "NHL", wins: 209, losses: 130 },
  { league: "MLS", wins: 214, losses: 140 },
];

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
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>League Stats</CardTitle>
        <CardDescription>Showing wins and losses by league</CardDescription>
      </CardHeader>
      <CardContent className="pb-0 w-full">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={leagueData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey="league" />
            <PolarGrid />
            <Radar dataKey="wins" fill="var(--color-wins)" fillOpacity={0.6} />
            <Radar dataKey="losses" fill="var(--color-losses)" />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
