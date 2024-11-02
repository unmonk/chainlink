import { Doc, Id } from "@/convex/_generated/dataModel";
import { Card, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { matchupReward } from "@/convex/utils";
import { MatchupWithPickCounts } from "@/convex/matchups";
import Link from "next/link";
import { Logo } from "../ui/logo";
import { cn } from "@/lib/utils";

const MatchupCard = ({ matchup }: { matchup: MatchupWithPickCounts }) => {
  return (
    <Card className="rounded-t-none flex flex-col h-full">
      <MatchupCardHeader matchup={matchup as Doc<"matchups">} />
      <CardTitle className="text-lg px-1 font-bold flex-1 flex items-start pt-2">
        {matchup.title}
      </CardTitle>
      <MatchupCardButtons matchup={matchup} />
    </Card>
  );
};

export default MatchupCard;

const MatchupCardButtons = ({
  matchup,
}: {
  matchup: MatchupWithPickCounts;
}) => {
  const currentlyWinning =
    matchup.awayTeam.score === matchup.homeTeam.score
      ? null
      : matchup.awayTeam.score > matchup.homeTeam.score
        ? matchup.awayTeam.id
        : matchup.homeTeam.id;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-3 items-center text-center">
        <p className="text-balance text-sm font-semibold">
          {matchup.awayTeam.name}
        </p>
        <p className="text-primary text-sm"></p>

        <p className="text-balance text-sm font-semibold">
          <span className="text-primary text-xs font-extralight">@</span>
          {matchup.homeTeam.name}
        </p>
      </div>
      <div className="grid grid-cols-6 items-center text-center py-1">
        <div className="col-span-2">
          <MatchupPickButton
            name={matchup.awayTeam.name}
            image={matchup.awayTeam.image}
            id={matchup.awayTeam.id}
            disabled={
              matchup.status !== "STATUS_SCHEDULED" &&
              matchup.status !== "STATUS_POSTPONED"
            }
            winnerId={matchup.winnerId}
            matchupId={matchup._id}
            currentlyWinning={currentlyWinning}
          />
        </div>
        {(matchup.status === "STATUS_SCHEDULED" ||
          matchup.status === "STATUS_POSTPONED") && (
          <>
            <div className="col-span-1 flex items-center justify-center px-1">
              <div className="h-2 w-full rounded-full bg-foreground/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-100 via-yellow-500 to-red-500"
                  style={{
                    width: `${(matchup.awayPicks / (matchup.homePicks + matchup.awayPicks || 1)) * 100}%`,
                    transition: "width 0.3s ease-in-out",
                  }}
                />
              </div>
            </div>

            <div className="col-span-1 flex items-center justify-center px-1">
              <div className="h-2 w-full rounded-full bg-foreground/10">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-blue-100 via-yellow-500 to-red-500"
                  style={{
                    width: `${(matchup.homePicks / (matchup.homePicks + matchup.awayPicks || 1)) * 100}%`,
                    transition: "width 0.3s ease-in-out",
                    marginLeft: "auto",
                  }}
                />
              </div>
            </div>
          </>
        )}
        {matchup.status !== "STATUS_SCHEDULED" &&
          matchup.status !== "STATUS_POSTPONED" && (
            <div className="flex flex-col col-span-1">
              <p
                className={
                  matchup.status === "STATUS_FINAL" &&
                  matchup.winnerId === matchup.awayTeam.id
                    ? "text-center col-span-1 bg-primary font-bold rounded-sm mx-1"
                    : currentlyWinning === matchup.awayTeam.id
                      ? "text-center col-span-1 bg-accent/90 rounded-sm mx-1 border-2 border-accent-foreground/30"
                      : "text-center col-span-1 bg-accent/50 rounded-sm mx-1"
                }
              >
                {matchup.status !== "STATUS_SCHEDULED" &&
                matchup.status !== "STATUS_POSTPONED" ? (
                  <span
                    className={
                      currentlyWinning === matchup.awayTeam.id
                        ? "font-bold"
                        : ""
                    }
                  >
                    {matchup.awayTeam.score}
                  </span>
                ) : (
                  ""
                )}
                <div className="col-span-1 flex items-center justify-center px-1">
                  <div className="h-2 w-full rounded-full bg-foreground/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-100 via-yellow-500 to-red-500"
                      style={{
                        width: `${(matchup.awayPicks / (matchup.homePicks + matchup.awayPicks || 1)) * 100}%`,
                        transition: "width 0.3s ease-in-out",
                      }}
                    />
                  </div>
                </div>
              </p>
              <p className="text-xs text-foreground/50 min-h-4">
                {Math.round(
                  (matchup.awayPicks /
                    (matchup.homePicks + matchup.awayPicks || 1)) *
                    100
                ) > 0
                  ? `${Math.round(
                      (matchup.awayPicks /
                        (matchup.homePicks + matchup.awayPicks || 1)) *
                        100
                    )}%`
                  : ""}
              </p>
            </div>
          )}
        {matchup.status !== "STATUS_SCHEDULED" &&
          matchup.status !== "STATUS_POSTPONED" && (
            <div className="flex flex-col col-span-1">
              <p
                className={
                  matchup.status === "STATUS_FINAL" &&
                  matchup.winnerId === matchup.homeTeam.id
                    ? "text-center col-span-1 bg-primary font-bold rounded-sm mx-1"
                    : currentlyWinning === matchup.homeTeam.id
                      ? "text-center col-span-1 bg-accent/90 rounded-sm mx-1 border-2 border-accent-foreground/30"
                      : "text-center col-span-1 bg-accent/50 rounded-sm mx-1"
                }
              >
                {matchup.status !== "STATUS_SCHEDULED" &&
                matchup.status !== "STATUS_POSTPONED" ? (
                  <span
                    className={
                      currentlyWinning === matchup.homeTeam.id
                        ? "font-bold"
                        : ""
                    }
                  >
                    {matchup.homeTeam.score}
                  </span>
                ) : (
                  " "
                )}
                <div className="col-span-1 flex items-center justify-center px-1">
                  <div className="h-2 w-full rounded-full bg-foreground/10 opacity-80">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-blue-100 via-yellow-500 to-red-500"
                      style={{
                        width: `${(matchup.homePicks / (matchup.homePicks + matchup.awayPicks || 1)) * 100}%`,
                        transition: "width 0.3s ease-in-out",
                        marginLeft: "auto",
                      }}
                    />
                  </div>
                </div>
              </p>
              <p className="text-xs text-foreground/50 min-h-4">
                {Math.round(
                  (matchup.homePicks /
                    (matchup.homePicks + matchup.awayPicks || 1)) *
                    100
                ) > 0
                  ? `${Math.round(
                      (matchup.homePicks /
                        (matchup.homePicks + matchup.awayPicks || 1)) *
                        100
                    )}%`
                  : ""}
              </p>
            </div>
          )}

        <div className="col-span-2">
          <MatchupPickButton
            name={matchup.homeTeam.name}
            image={matchup.homeTeam.image}
            id={matchup.homeTeam.id}
            disabled={
              matchup.status !== "STATUS_SCHEDULED" &&
              matchup.status !== "STATUS_POSTPONED"
            }
            winnerId={matchup.winnerId}
            matchupId={matchup._id}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 items-center text-center p-2 min-h-12 mt-auto bg-background/20 border-t border-border">
        <p className="text-sm">
          {matchup.featured && matchup.featuredType === "CHAINBUILDER" && (
            <span className="text-primary">Chain Builder🖇️</span>
          )}
          {matchup.featured && matchup.featuredType === "SPONSORED" && (
            <span
              className={cn(`text-${matchup.metadata.sponsoredData.color}-500`)}
            >
              Sponsored
            </span>
          )}
        </p>
        <div className="flex flex-col items-center justify-center">
          {(matchup.status === "STATUS_SCHEDULED" ||
            matchup.status === "STATUS_POSTPONED") && (
            <p className="text-light text-xs text-nowrap">
              Wager: 🔗
              <span className="text-cyan-500">{matchup.cost}</span>
            </p>
          )}
          <p className="text-light text-xs text-nowrap">
            Reward: 🔗
            <span className="text-cyan-500">
              {matchupReward(matchup.cost, matchup.featured)}
            </span>
          </p>
        </div>
        <p
          className={
            matchup.status === "STATUS_SCHEDULED" ||
            matchup.status === "STATUS_POSTPONED"
              ? "font-extralight text-light text-sm"
              : matchup.status === "STATUS_FINAL" ||
                  matchup.status === "STATUS_FINAL_OT" ||
                  matchup.status === "STATUS_FINAL_PEN"
                ? "font-bold font-sans"
                : "text-red-500 animate-pulse"
          }
        >
          {matchup.status === "STATUS_SCHEDULED" ||
          matchup.status === "STATUS_POSTPONED"
            ? ""
            : matchup.status === "STATUS_FINAL" ||
                matchup.status === "STATUS_FINAL_OT" ||
                matchup.status === "STATUS_FINAL_PEN"
              ? displayWinner(matchup)
              : "Locked"}
        </p>
      </div>
      {matchup.featured &&
        matchup.featuredType === "SPONSORED" &&
        matchup.metadata.sponsoredData && (
          <Link href={matchup.metadata.sponsoredData.url}>
            <div className="flex flex-row justify-center items-center text-center p-2 min-h-12 mt-auto bg-background/20 border-t border-border text-sm">
              <p className="flex flex-row justify-center items-center gap-1">
                {matchup.metadata.sponsoredData.description}
              </p>
              <Image
                src={matchup.metadata.sponsoredData.image}
                alt={matchup.metadata.sponsoredData.name}
                width={24}
                height={24}
                className="ml-1 items-center justify-center self-center"
              />
            </div>
          </Link>
        )}
    </div>
  );
};

export const displayWinner = (matchup: Doc<"matchups">) => {
  if (matchup.winnerId === matchup.awayTeam.id) {
    return `🏆${matchup.awayTeam.name}`;
  }
  if (matchup.winnerId === matchup.homeTeam.id) {
    return `🏆${matchup.homeTeam.name}`;
  } else {
    return "Push";
  }
};

const MatchupPickButton = ({
  name,
  image,
  id,
  disabled,
  matchupId,
  winnerId,
  currentlyWinning,
}: {
  name: string;
  image: string;
  id: string;
  disabled: boolean;
  matchupId: Id<"matchups">;
  winnerId?: string;
  currentlyWinning?: string | null;
}) => {
  const makePick = useMutation(api.picks.makePick);

  const handleClick = async () => {
    if (disabled) return;
    try {
      await makePick({
        matchupId,
        pick: {
          id,
          name,
          image,
        },
      });
      //top of page
      window.scrollTo(0, 0);
    } catch (e: any) {
      const errorMessage =
        // Check whether the error is an application error
        e instanceof ConvexError
          ? // Access data and cast it to the type we expect
            (e.data as string)
          : // Must be some developer error,
            // and prod deployments will not
            // reveal any more information about it
            // to the client
            "Unexpected error occurred";

      if (errorMessage === "USER_NOT_FOUND") {
        toast.error("Please sign in to make a pick");
      }
      if (errorMessage === "EXISTING_PICK_FOUND") {
        toast.error("You already have an active pick");
      }
      if (errorMessage === "INSUFFICIENT_FUNDS") {
        toast.error("You do not have enough Links to make this pick");
      }
      if (errorMessage === "MATCHUP_LOCKED") {
        toast.error("This matchup is locked");
      } else {
        console.log(errorMessage);
      }
    }
  };

  return (
    <Button
      variant={"outline"}
      className={
        winnerId === id
          ? "border-primary border relative aspect-square h-5/6 w-5/6 overflow-hidden"
          : currentlyWinning === id
            ? "border-accent-foreground/50 border-4 relative aspect-square h-5/6 w-5/6 overflow-hidden"
            : "relative aspect-square h-5/6 w-5/6 overflow-hidden"
      }
      disabled={disabled}
      onClick={handleClick}
    >
      <Image
        src={image}
        alt={name}
        className="hover:scale-110 transition-transform duration-300 ease-in-out"
        sizes={"100%"}
        width={100}
        priority={true}
        height={100}
        style={{
          maxWidth: "100%",
          height: "auto",
          width: "100%",
        }}
      />
    </Button>
  );
};

export const MatchupCardHeader = ({
  matchup,
}: {
  matchup: Doc<"matchups">;
}) => {
  const headerColor = (status: string) => {
    switch (status) {
      case "STATUS_SCHEDULED":
        return "bg-secondary";
      case "STATUS_IN_PROGRESS":
      case "STATUS_HALFTIME":
      case "STATUS_FIRST_HALF":
      case "STATUS_SECOND_HALF":
      case "STATUS_END_PERIOD":
        return "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-300 dark:from-sky-800";
      case "STATUS_FINAL":
      case "STATUS_FINAL_OT":
      case "STATUS_FINAL_PEN":
        return "to-bg-tertiary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-200 dark:from-gray-400";
      case "STATUS_POSTPONED":
      case "STATUS_CANCELED":
      case "STATUS_SUSPENDED":
      case "STATUS_RAIN_DELAY":
      case "STATUS_DELAY":
        return "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-300  dark:from-amber-600";
      default:
        return "bg-secondary";
    }
  };

  const getNetwork = (metadata: any) => {
    if (metadata?.network && metadata.network !== "N/A") {
      return ` - ${metadata.network}`;
    }
    return "";
  };
  return (
    <div className={headerColor(matchup.status)}>
      <div className="grid grid-cols-2 p-1.5">
        <div className="text-start flex flex-row items-center gap-1">
          <div className="text-sm font-semibold">
            {matchup.league === "COLLEGE-FOOTBALL" ? "CFB" : matchup.league}
          </div>
          <div className="text-xs font-extralight">
            {getNetwork(matchup.metadata)}
          </div>
        </div>
        <div className="text-right text-xs font-semibold text-nowrap overflow-hidden">
          {matchup.status === "STATUS_SCHEDULED" ||
          matchup.status === "STATUS_POSTPONED" ? (
            <p className="text-xs text-gray-800 dark:text-gray-300  font-light">
              locks at:{" "}
              {new Date(matchup.startTime).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                day: "numeric",
                month: "short",
              })}
            </p>
          ) : (
            <div className="">
              {matchup.metadata?.statusDetails ? (
                <>
                  <p className="text-xs text-gray-800 dark:text-gray-300  font-light">
                    last update:
                  </p>
                  <span className="text-foreground">
                    {matchup.metadata?.statusDetails}
                  </span>
                </>
              ) : (
                matchup.status
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
