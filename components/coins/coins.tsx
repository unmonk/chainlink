"use client";
import { api } from "@/convex/_generated/api";
import useStoreUserEffect from "@/hooks/use-store-user";
import { useQuery } from "convex/react";

const Coins = () => {
  const coins = useQuery(api.users.getCoins, {});
  return (
    <p className="text-yellow-500 text-nowrap">
      🔗 {coins?.toLocaleString("en-US")}
    </p>
  );
};

export default Coins;
