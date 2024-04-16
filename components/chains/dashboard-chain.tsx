import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import useStoreChain from "@/hooks/use-active-chain";
import { streakColor, streakLetter } from "./user-chain";
import { Badge } from "../ui/badge";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "../ui/skeleton";

export const DashboardChain = () => {
  const { isAuthenticated } = useConvexAuth();
  const chain = useQuery(api.chains.getUserActiveChain, {});

  return (
    <Card className="">
      <CardHeader className="pb-2">
        <CardTitle>My Chain</CardTitle>
        <CardDescription className="text-xs text-muted-foreground whitespace-nowrap">
          Global Game:
          {isAuthenticated && chain && (
            <> {chain.wins + chain.losses + chain.pushes} picks </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-4 flex-grow">
        {isAuthenticated && chain && (
          <Badge
            className={cn(
              "mb-2 px-3 py-1 text-white font-bold rounded-full",
              streakColorBackground(chain.chain)
            )}
            variant="secondary"
          >
            {streakLetter(chain.chain)}
            {Math.abs(chain.chain)}
          </Badge>
        )}
        {!isAuthenticated && (
          <Skeleton className="h-8 w-16 inline-flex items-center rounded-full border px-2.5 py-0.5" />
        )}
        <CardDescription className="text-xs text-muted-foreground">
          Current Chain
        </CardDescription>
        {isAuthenticated && chain && (
          <Badge
            className={cn(
              "mb-2 px-3 py-1 text-white font-bold rounded-full mt-2",
              streakColorBackground(chain.best)
            )}
            variant="secondary"
          >
            {streakLetter(chain.best)}
            {Math.abs(chain.best)}
          </Badge>
        )}
        {!isAuthenticated && (
          <Skeleton className="h-8 w-16 inline-flex items-center rounded-full border px-2.5 py-0.5" />
        )}
        <CardDescription className="text-xs text-muted-foreground">
          Best Chain
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-center px-2 py-2 bg-accent rounded-b-lg flex-nowrap gap-1 ">
        {isAuthenticated && chain && (
          <Badge className="border border-input bg-background  text-foreground text-nowrap">
            {chain.wins}
          </Badge>
        )}
        {!isAuthenticated && (
          <Skeleton className="h-8 w-16 inline-flex bg-background items-center rounded-full border px-2.5 py-0.5" />
        )}
        -
        {isAuthenticated && chain && (
          <Badge className="border border-input bg-background  text-foreground text-nowrap">
            {chain.losses}
          </Badge>
        )}
        {!isAuthenticated && (
          <Skeleton className="h-8 w-16 inline-flex bg-background items-center rounded-full border px-2.5 py-0.5" />
        )}
        -
        {isAuthenticated && chain && (
          <Badge className="border border-input bg-background text-foreground text-nowrap">
            {chain.pushes}
          </Badge>
        )}
        {!isAuthenticated && (
          <Skeleton className="h-8 w-16 inline-flex bg-background  items-center rounded-full border px-2.5 py-0.5" />
        )}
      </CardFooter>
    </Card>
  );
};

export const streakColorBackground = (chain: number) => {
  if (chain === 0) {
    return "bg-gray-500";
  }
  if (chain > 0) {
    return "bg-green-600";
  }
  return "bg-red-600";
};
