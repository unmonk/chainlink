import { useQuery } from "convex/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { formatDistance } from "date-fns";

const DashboardActivePick = () => {
  const pick = useQuery(api.picks.getUserActivePickWithMatchup, {});

  //Todo loading skeleton
  if (!pick) return null;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>My Pick</CardTitle>
        <CardDescription className="text-sm">
          {pick.matchup.league === "COLLEGE-FOOTBALL"
            ? "CFB"
            : pick.matchup.league}{" "}
          - {pick.matchup.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex flex-col items-center">
        <div className="grid grid-cols-2 items-center w-full gap-2">
          <div
            className={cn(
              "flex items-center space-x-2 rounded-md p-1",
              pick.matchup.awayTeam.id === pick.pick.pick.id && "bg-accent"
            )}
          >
            <Image
              src={pick.matchup.awayTeam.image}
              alt={pick.matchup.awayTeam.name}
              className="rounded-lg aspect-square"
              objectFit="cover"
              width={80}
              height={80}
            />
            <div className="flex flex-col text-sm leading-none">
              <span className="font-medium">{pick.matchup.awayTeam.name}</span>
            </div>
          </div>
          <div
            className={cn(
              "flex items-center space-x-2 rounded-md justify-end p-1",
              pick.matchup.homeTeam.id === pick.pick.pick.id && "bg-accent"
            )}
          >
            <div className="flex flex-col text-sm leading-none text-right">
              <span className="font-medium">{pick.matchup.homeTeam.name}</span>
            </div>
            <Image
              src={pick.matchup.homeTeam.image}
              alt={pick.matchup.homeTeam.name}
              className="rounded-lg aspect-square"
              objectFit="cover"
              width={80}
              height={80}
            />
          </div>
        </div>
        {pick.matchup.status !== "STATUS_SCHEDULED" &&
          pick.matchup.status !== "STATUS_POSTPONED" && (
            <div className="flex items-center space-x-2 mt-4">
              <div className="flex flex-col items-center space-y-1">
                <span className="text-2xl font-semibold">
                  {pick.matchup.awayTeam.score}
                </span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <span className="text-2xl font-semibold">
                  {pick.matchup.homeTeam.score}
                </span>
              </div>
            </div>
          )}
        <div className="flex items-center space-x-2 mt-4">
          {pick.matchup.featured && (
            <Badge className="text-xs bg-green-600" variant="default">
              Chain Builder
            </Badge>
          )}
          <Badge className="text-xs" variant="outline">
            {pick.matchup.status === "STATUS_SCHEDULED" ? (
              `Starts in:   ${formatDistance(
                new Date(pick.matchup.startTime),
                new Date(),
                {
                  includeSeconds: true,
                }
              )}`
            ) : pick.matchup.metadata?.statusDetails ? (
              <>
                <p className="text-xs text-gray-800 dark:text-gray-300  font-light">
                  last update:
                </p>
                <span className="text-foreground">
                  {pick.matchup.metadata?.statusDetails}
                </span>
              </>
            ) : (
              pick.matchup.status
            )}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardActivePick;
