"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Skeleton } from "../ui/skeleton";

const Coins = () => {
  const user = useQuery(api.users.currentUser);
  const coins = user?.coins;

  return (
    <>
      {!coins ? (
        <Skeleton className="h-6 w-12 m-0.5" />
      ) : (
        <span className="text-cyan-600 text-nowrap text-sm md:text-base">
          🔗 {coins.toLocaleString("en-US")}
        </span>
      )}
    </>
  );
};

export default Coins;
