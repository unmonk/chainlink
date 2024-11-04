"use client";
import { useQuery } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "../ui/skeleton";
import { CoinHistoryChart } from "@/components/coins/coin-history-chart";
import { formatDate, subMonths } from "date-fns";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

const DashboardCoins = () => {
  const user = useQuery(api.users.currentUser);
  if (!user) return null;
  const lastMonth = formatDate(subMonths(new Date(), 1), "yyyyMM");
  const lastMonthsCoins = user?.monthlyStats[lastMonth]?.coins;

  const coinDifference = user.coins - lastMonthsCoins;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2 flex-grow">
        <CardTitle>Link Balance</CardTitle>
      </CardHeader>
      {user && <CoinHistoryChart chartData={user.monthlyStats} />}
      {!user && (
        <CardContent className="mb-2">
          <Skeleton className="h-8 w-16 m-0.5" />
          <Skeleton className="h-4 w-20" />
        </CardContent>
      )}
      {user && (
        <CardContent className="mb-2 py-2">
          <CardTitle className="md:text-2xl text-xl text-cyan-600 text-nowrap">
            🔗 {user.coins?.toLocaleString("en-US")}
          </CardTitle>
          <div className="text-xs text-muted-foreground ">
            {!Number.isNaN(coinDifference) && (
              <>
                {coinDifference < 0 ? "-" : "+"}
                {Math.abs(coinDifference)} mtd (
                {((coinDifference / user.coins) * 100).toFixed(2)}%)
              </>
            )}
            {!Number.isNaN(coinDifference) && coinDifference < 0 && (
              <TrendingDownIcon className="w-4 h-4 inline-block" />
            )}
            {!Number.isNaN(coinDifference) && coinDifference > 0 && (
              <TrendingUpIcon className="w-4 h-4 inline-block" />
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DashboardCoins;
