"use client";
import { useQuery } from "convex/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import useStoreChain from "@/hooks/use-active-chain";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "../ui/skeleton";

const DashboardCoins = () => {
  const coins = useQuery(api.users.getCoins, {});
  const chain = useQuery(api.chains.getUserActiveChain, {});

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2 flex-grow">
        <CardTitle>Link Balance</CardTitle>
      </CardHeader>
      {!chain && !coins && (
        <CardContent className="mb-2">
          <Skeleton className="h-8 w-16 m-0.5" />
          <Skeleton className="h-4 w-20" />
        </CardContent>
      )}
      {chain && coins && (
        <CardContent className="mb-2">
          <CardTitle className="text-3xl text-yellow-500">
            🔗 {coins?.toLocaleString("en-US")}
          </CardTitle>
          <div className="text-xs text-muted-foreground">
            {chain.cost < 0 ? "-" : "+"}
            {Math.abs(chain.cost)} this month (
            {((chain.cost / coins) * 100).toFixed(2)}%)
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DashboardCoins;
