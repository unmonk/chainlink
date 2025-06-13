"use client";

import { api } from "@/convex/_generated/api";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Skeleton } from "../ui/skeleton";

export const UserChain = () => {
  const { isAuthenticated } = useConvexAuth();
  const chain = useQuery(api.chains.getUserActiveChain, {});
  const createChain = useMutation(api.chains.createActiveChain);
  if (chain === null && isAuthenticated) {
    createChain();
  }
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="flex flex-row items-center justify-center">
        <div className="flex flex-row gap-1 md:gap-2 items-center justify-center text-nowrap overflow-auto">
          {!chain && <Skeleton className="h-4 w-4 m-0 md:m-1" />}
          {chain && (
            <p className={`${streakColor(chain.chain)} tracking-tight`}>
              {streakLetter(chain.chain)}
              {Math.abs(chain.chain)}
            </p>
          )}
          {!chain && (
            <>
              <Skeleton className="h-4 w-4 m-0 md:m-1" /> -{" "}
              <Skeleton className="h-4 w-4 m-0 md:m-1" />
              - <Skeleton className="h-4 w-4 m-0 md:m-1" />
            </>
          )}
          {chain && (
            <p className="font-mono text-xs md:text-sm tracking-tight">
              {chain.wins} - {chain.losses} - {chain.pushes}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export const streakLetter = (chain: number) => {
  if (chain === 0) {
    return "W";
  }
  if (chain > 0) {
    return "W";
  }
  return "L";
};

export const streakColor = (chain: number) => {
  if (chain === 0) {
    return "text-lg text-gray-500 text-nowrap";
  }
  if (chain > 0) {
    return "text-green-500 text-nowrap text-lg";
  }
  return "text-red-500 text-nowrap text-lg";
};
