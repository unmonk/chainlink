"use client";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  Label,
  LabelList,
  Pie,
  XAxis,
  PieChart,
  YAxis,
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { getSportFromLeague } from "@/lib/utils";

export function LeaguePieChart({
  leagueChartData,
}: {
  leagueChartData: {
    league: string;
    wins: number;
    losses: number;
    pushes: number;
  }[];
}) {
  const getLeagueColor = (league: string): string => {
    switch (league) {
      case "NFL":
        return "hsla(0, 78%, 34%, 1)"; // Red
      case "COLLEGE-FOOTBALL":
        return "hsla(0, 78%, 50%, 1)"; // Red
      case "NBA":
        return "hsla(15, 78%, 50%, 1)"; // Orange
      case "MBB":
        return "hsla(15, 78%, 70%, 1)"; //Light Orange
      case "WNBA":
        return "hsla(15, 78%, 60%, 1)"; // Orange
      case "WBB":
        return "hsla(320, 78%, 63%, 1)"; //Light Pink
      case "MLB":
        return "hsla(229, 78%, 38%, 1)"; // Blue
      case "NHL":
        return "hsla(0, 0%, 40%, 1)"; // grey
      case "MLS":
        return "hsla(115, 78%, 44%, 1)"; //Green
      case "NWSL":
        return "hsla(115, 78%, 30%, 1)"; //Green
      case "EPL":
        return "hsla(115, 78%, 20%, 1)"; //Green
      case "UFL":
        return "hsla(0, 78%, 56%, 1)"; // Red
      case "ARG":
        return "hsla(115, 78%, 550%, 1)"; //Green
      case "TUR":
        return "hsla(115, 78%, 60%, 1)"; //Green
      case "RPL":
        return "hsla(115, 78%, 75%, 1)"; //Green
      default:
        return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
    }
  };

  const chartData = leagueChartData
    .map((data) => ({
      ...data,
      picks: data.wins + data.losses + data.pushes,
      label: data.league,
      fill: getLeagueColor(data.league),
      sport: getSportFromLeague(data.league),
    }))
    .sort((a, b) => {
      const sportOrder = [
        "football",
        "baseball",
        "hockey",
        "soccer",
        "basketball",
        "lacrosse",
        "other",
      ];
      return sportOrder.indexOf(a.sport) - sportOrder.indexOf(b.sport);
    });

  const pieChartConfig: ChartConfig = Object.fromEntries(
    leagueChartData.map((data) => [
      data.league,
      {
        label: data.league,
        color: getLeagueColor(data.league),
      },
    ])
  );

  const totalPicks = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.picks, 0);
  }, [chartData]);

  return (
    <>
      <Card className="flex flex-col bg-transparent border-none">
        <CardHeader className="items-center pb-0">
          <CardTitle>Picks Distribution</CardTitle>
          <CardDescription>Picks by League</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={pieChartConfig}
            className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="label" />}
              />

              <Pie
                data={chartData}
                dataKey="picks"
                label
                nameKey="label"
                innerRadius={60}
                strokeWidth={5}
                fillOpacity={0.85}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalPicks.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total Picks
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="leading-none text-muted-foreground">
            Showing total picks distribution across leagues
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
