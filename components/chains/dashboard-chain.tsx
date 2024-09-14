import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { streakColor, streakLetter } from "./user-chain";
import { Badge } from "../ui/badge";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "../ui/skeleton";

export const DashboardChain = () => {
  const { isAuthenticated } = useConvexAuth();
  const chain = useQuery(api.chains.getUserActiveChain, {});
  const createChain = useMutation(api.chains.createActiveChain);
  if (chain === null) {
    createChain();
  }

  if (chain === null) {
    return <Skeleton className="h-8 w-16 m-0.5" />;
  }

  return (
    <Card className="flex flex-col">
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
        <div className="mt-auto flex flex-col items-center">
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
        </div>
        <div className="mt-auto flex flex-col items-center">
          {isAuthenticated && chain && (
            <Badge
              className={cn(
                "mb-2 px-3 py-1 text-white font-bold rounded-full",
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
          <CardDescription className="text-xs text-muted-foreground mt-auto">
            Best Chain
          </CardDescription>
        </div>
        <div className="mt-auto flex flex-row flex-nowrap">
          {isAuthenticated && chain && (
            <Badge className="border border-input bg-background  text-foreground text-nowrap">
              W: {chain.wins}
            </Badge>
          )}
          {!isAuthenticated && (
            <Skeleton className="h-8 w-16 inline-flex bg-background items-center rounded-full border px-2.5 py-0.5" />
          )}
          -
          {isAuthenticated && chain && (
            <Badge className="border border-input bg-background  text-foreground text-nowrap">
              L: {chain.losses}
            </Badge>
          )}
          {!isAuthenticated && (
            <Skeleton className="h-8 w-16 inline-flex bg-background items-center rounded-full border px-2.5 py-0.5" />
          )}
          -
          {isAuthenticated && chain && (
            <Badge className="border border-input bg-background text-foreground text-nowrap">
              P: {chain.pushes}
            </Badge>
          )}
          {!isAuthenticated && (
            <Skeleton className="h-8 w-16 inline-flex bg-background  items-center rounded-full border px-2.5 py-0.5" />
          )}
        </div>
      </CardContent>
      {/* <CardFooter className="flex justify-center px-2 py-2 bg-accent rounded-b-lg flex-nowrap gap-1 "></CardFooter> */}
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
