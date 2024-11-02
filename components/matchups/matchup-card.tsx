import { Doc, Id } from "@/convex/_generated/dataModel";
import { Card, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { matchupReward } from "@/convex/utils";

const MatchupCard = ({ matchup }: { matchup: Doc<"matchups"> }) => {
  return (
    <Card className="rounded-t-none flex flex-col h-full">
      <MatchupCardHeader matchup={matchup} />
      <CardTitle className="text-lg px-1 font-bold flex-1 flex items-start pt-2">
        {matchup.title}
      </CardTitle>
      <MatchupCardButtons matchup={matchup} />
    </Card>
  );
};

export default MatchupCard;

const MatchupCardButtons = ({ matchup }: { matchup: Doc<"matchups"> }) => {
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
          />
        </div>
        {(matchup.status === "STATUS_SCHEDULED" ||
          matchup.status === "STATUS_POSTPONED") && (
          <p className="col-span-2"></p>
          // <div className="col-span-2 bg-accent/40 flex flex-col items-center justify-center rounded-sm p-2 mx-auto ">
          //   <span className="text-primary text-center text-xs font-bold">
          //     Locks in:
          //   </span>
          //   <Logo size={50} />{" "}
          //   <span className="text-primary text-center text-xs font-bold">
          //     {formatDistance(new Date(matchup.startTime), new Date(), {
          //       includeSeconds: true,
          //     })}
          //   </span>
          // </div>
        )}
        {matchup.status !== "STATUS_SCHEDULED" &&
          matchup.status !== "STATUS_POSTPONED" && (
            <p
              className={
                matchup.status === "STATUS_FINAL" &&
                matchup.winnerId === matchup.awayTeam.id
                  ? "text-center col-span-1 bg-primary font-bold rounded-sm mx-1"
                  : "text-center col-span-1 bg-accent rounded-sm mx-1"
              }
            >
              {matchup.status !== "STATUS_SCHEDULED" &&
              matchup.status !== "STATUS_POSTPONED"
                ? matchup.awayTeam.score
                : ""}
            </p>
          )}
        {matchup.status !== "STATUS_SCHEDULED" &&
          matchup.status !== "STATUS_POSTPONED" && (
            <p
              className={
                matchup.status === "STATUS_FINAL" &&
                matchup.winnerId === matchup.homeTeam.id
                  ? "text-center col-span-1 bg-primary font-bold rounded-sm mx-1"
                  : "text-center col-span-1 bg-accent rounded-sm mx-1"
              }
            >
              {matchup.status !== "STATUS_SCHEDULED" &&
              matchup.status !== "STATUS_POSTPONED"
                ? matchup.homeTeam.score
                : " "}
            </p>
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
        <p className="text-primary text-sm">
          {matchup.featured && "Chain Builder🖇️"}
        </p>
        <div className="flex flex-col items-center justify-center">
          {(matchup.status === "STATUS_SCHEDULED" ||
            matchup.status === "STATUS_POSTPONED") && (
            <p className="text-light text-xs text-nowrap">
              Wager: 🔗
              <span className="text-yellow-500">{matchup.cost}</span>
            </p>
          )}
          <p className="text-light text-xs text-nowrap">
            Reward: 🔗
            <span className="text-yellow-500">
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
}: {
  name: string;
  image: string;
  id: string;
  disabled: boolean;
  matchupId: Id<"matchups">;
  winnerId?: string;
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
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Button
      variant={"outline"}
      className={
        winnerId === id
          ? "border-primary border relative aspect-square h-5/6 w-5/6 overflow-hidden"
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
