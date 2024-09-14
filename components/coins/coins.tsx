"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Skeleton } from "../ui/skeleton";

const Coins = () => {
  const user = useQuery(api.users.currentUser);
  const coins = user?.coins;

  return (
    <>
      {!coins && (
        <>
          🔗 <Skeleton className="h-8 w-16 m-0.5" />
        </>
      )}
      {coins && (
        <span className="text-cyan-600 text-nowrap">
          🔗 {coins.toLocaleString("en-US")}
        </span>
      )}
    </>
  );
};

export default Coins;
