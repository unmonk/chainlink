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

export const DashboardChain = () => {
  const chain = useStoreChain();
  if (!chain) return null;
  return (
    <Card className="">
      <CardHeader className="pb-2">
        <CardTitle>My Chain</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Global Campaign
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-4 flex-grow">
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
        <CardDescription className="text-xs text-muted-foreground">
          Current Chain
        </CardDescription>

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
        <CardDescription className="text-xs text-muted-foreground">
          Best Chain
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-center px-2 py-2 bg-accent rounded-b-lg flex-wrap gap-1 ">
        <Badge className="bg-green-500 text-white text-nowrap">
          {chain.wins} Wins
        </Badge>
        <Badge className="bg-red-500 text-white text-nowrap">
          {chain.losses} Losses
        </Badge>
        <Badge className="bg-gray-500 text-white text-nowrap">
          {chain.pushes} Pushes
        </Badge>
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
