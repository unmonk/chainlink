"use client";
import { useQuery } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "../ui/skeleton";
import { CoinHistoryChart } from "@/components/coins/coin-history-chart";
import { formatDate, subMonths } from "date-fns";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

const DashboardCoins = () => {
  const user = useQuery(api.users.currentUser);
  const lastMonth = formatDate(subMonths(new Date(), 1), "yyyyMM");
  const lastMonthsCoins = user?.monthlyStats[lastMonth]?.coins;

  const coinDifference = user?.coins ? user.coins - lastMonthsCoins : 0;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2 flex-grow">
        <CardTitle>Link Balance</CardTitle>
      </CardHeader>
      {user && <CoinHistoryChart chartData={user.monthlyStats} />}
      <SignedOut>
        <CardContent className="mb-2 py-2">
          <CardTitle className="md:text-2xl text-xl text-cyan-600 text-nowrap opacity-50">
            🔗 10,000
          </CardTitle>
          <div className="text-xs text-muted-foreground opacity-50">
            +1000 mtd (10.00%)
            <TrendingUpIcon className="w-4 h-4 inline-block" />
          </div>
        </CardContent>
        <div className="flex justify-center pb-4">
          <SignInButton mode="modal">
            <Button variant="outline" size="sm">
              Sign in to track your Links
            </Button>
          </SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
        {!user && (
          <CardContent className="mb-2">
            <Skeleton className="h-8 w-16 m-0.5" />
            <Skeleton className="h-4 w-20" />
          </CardContent>
        )}
      </SignedIn>
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
