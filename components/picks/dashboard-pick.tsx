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
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { CalendarRange, CircleArrowOutUpRightIcon } from "lucide-react";
import { matchupReward } from "@/convex/utils";
import AnimatedShinyText from "../ui/animated-shiny-text";

const DashboardActivePick = () => {
  const pick = useQuery(api.picks.getUserActivePickWithMatchup, {});
  const router = useRouter();
  const goToPlay = () => router.push("/play");

  //Todo loading skeleton
  if (!pick)
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>My Pick</CardTitle>
          <CardDescription>No Active Pick</CardDescription>
        </CardHeader>
        <CardContent className="p-4 flex flex-col items-center">
          <div
            className={cn(
              "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            )}
          >
            <Button
              variant={"ghost"}
              onClick={goToPlay}
              size="lg"
              className="rounded-full"
            >
              <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                <CircleArrowOutUpRightIcon
                  size={16}
                  className="mr-1 size-3 transition-transform duration-300 ease-in-out group-hover:-translate-x-0.5"
                />
                <span>Make Pick</span>{" "}
              </AnimatedShinyText>
            </Button>
          </div>
        </CardContent>
      </Card>
    );

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
              width={80}
              height={80}
              style={{
                maxWidth: "100%",
                height: "auto",
                objectFit: "cover",
              }}
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
              width={80}
              height={80}
              style={{
                maxWidth: "100%",
                height: "auto",
                objectFit: "cover",
              }}
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
              <p className="mx-2">-</p>
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
                <span className="text-foreground ml-1">
                  {pick.matchup.metadata?.statusDetails}
                </span>
              </>
            ) : (
              pick.matchup.status
            )}
          </Badge>
          <Badge className="text-xs" variant="outline">
            <span className="text-red-500">- {pick.matchup.cost} </span>
            <span className="mx-1">🔗</span>
            <span className="text-blue-500">
              + {matchupReward(pick.matchup.cost, pick.matchup.featured)}
            </span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardActivePick;
