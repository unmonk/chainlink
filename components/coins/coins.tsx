"use client";
import { api } from "@/convex/_generated/api";
import useStoreUserEffect from "@/hooks/use-store-user";
import { useQuery } from "convex/react";
import { Skeleton } from "../ui/skeleton";

const Coins = () => {
  const coins = useQuery(api.users.getCoins, {});
  return (
    <>
      {!coins && (
        <>
          🔗 <Skeleton className="h-8 w-16 m-0.5" />
        </>
      )}
      {coins && (
        <p className="text-cyan-600 text-nowrap">
          🔗 {coins.toLocaleString("en-US")}
        </p>
      )}
    </>
  );
};

export default Coins;
