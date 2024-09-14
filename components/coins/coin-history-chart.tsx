import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { parse } from "date-fns";

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
  coins: {
    label: "coins",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function CoinHistoryChart({
  chartData,
}: {
  chartData: {
    [month: string]: {
      coins: number;
    };
  };
}) {
  const chartDataArray = Object.entries(chartData).map(
    ([month, { coins }]) => ({
      month: parse(month, "yyyyMM", new Date()).toLocaleDateString("en-US", {
        month: "short",
      }),
      coins,
    })
  );

  return (
    <>
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={chartDataArray}
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
            tickFormatter={(value) => value}
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
