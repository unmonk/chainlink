"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
  { month: "January", coins: 186, mobile: 80 },
  { month: "February", coins: 305, mobile: 200 },
  { month: "March", coins: 237, mobile: 120 },
  { month: "April", coins: 73, mobile: 190 },
  { month: "May", coins: 209, mobile: 130 },
  { month: "June", coins: 214, mobile: 140 },
];

const chartConfig = {
  coins: {
    label: "coins",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function CoinHistoryChart() {
  return (
    <>
      <ChartContainer config={chartConfig}>
        <AreaChart
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
          <defs>
            <linearGradient id="fillcoins" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-coins)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-coins)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>

          <Area
            dataKey="coins"
            type="natural"
            fill="url(#fillcoins)"
            fillOpacity={0.4}
            stroke="var(--color-coins)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </>
  );
}
