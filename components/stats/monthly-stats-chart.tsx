"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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
  { month: "January", wins: 186, losses: 80 },
  { month: "February", wins: 305, losses: 200 },
  { month: "March", wins: 237, losses: 120 },
  { month: "April", wins: 73, losses: 190 },
  { month: "May", wins: 209, losses: 130 },
  { month: "June", wins: 214, losses: 140 },
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

interface MonthlyStatsChartProps {
  monthlyData: { month: string; wins: number; losses: number }[];
}

export const MonthlyStatsChart: React.FC<MonthlyStatsChartProps> = ({
  monthlyData,
}) => {
  return monthlyData.length !== 0 ? null : (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Monthly Stats</CardTitle>
        <CardDescription>Wins and Losses last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
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
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="wins"
              type="monotone"
              stroke="var(--color-wins)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="losses"
              type="monotone"
              stroke="var(--color-losses)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
