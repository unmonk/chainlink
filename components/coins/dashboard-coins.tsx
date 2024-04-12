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

const DashboardCoins = () => {
  const coins = useQuery(api.users.getCoins, {});
  const chain = useStoreChain();

  if (!coins) return null;
  if (!chain) return null;

  const percentage = (chain.cost / coins) * 100;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2 flex-grow">
        <CardTitle>Link Balance</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        <CardTitle className="text-3xl text-yellow-500">
          🔗 {coins?.toLocaleString("en-US")}
        </CardTitle>
        <div className="text-xs text-muted-foreground">
          {chain.cost < 0 ? "-" : "+"}
          {Math.abs(chain.cost)} this month ({percentage.toFixed(2)}%)
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCoins;
