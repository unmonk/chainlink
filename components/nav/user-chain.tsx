import { api } from "@/convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import { Skeleton } from "../ui/skeleton";

const UserChain = () => {
  const chain = useQuery(api.chains.getUserActiveChain, {});
  const createActiveChain = useAction(api.chains.createActiveChain);

  return (
    <>
      <div className="flex flex-row items-center justify-center">
        {!chain && <Skeleton className="h-4 w-26" />}
        {chain && (
          <div className="flex flex-row gap-4 items-center justify-center text-nowrap overflow-auto">
            <p className={streakColor(chain.chain)}>
              {streakLetter(chain.chain)} {chain.chain}
            </p>
            <p className="font-mono">
              {chain.wins} - {chain.losses} - {chain.pushes}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default UserChain;

const streakLetter = (chain: number) => {
  if (chain === 0) {
    return "";
  }
  if (chain > 0) {
    return "W";
  }
  return "L";
};

const streakColor = (chain: number) => {
  if (chain === 0) {
    return "text-lg text-gray-500 text-nowrap";
  }
  if (chain > 0) {
    return "text-green-500 text-nowrap text-lg";
  }
  return "text-red-500 text-nowrap text-lg";
};
