"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import MatchupCard from "./matchup-card";
import { BackgroundGradient } from "../ui/background-gradient";
import { Doc } from "@/convex/_generated/dataModel";
import ActivePickCard, { UserPickWithMatchup } from "./active-pick";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

const MatchupList = ({}) => {
  const matchups = useQuery(api.matchups.getActiveMatchups, {});
  const userPick = useQuery(api.picks.getUserActivePick, {});

  const userPickWithMatchup = userPick as UserPickWithMatchup;
  //get the matchup for the user's active pick from matchups array by id
  if (userPickWithMatchup && matchups) {
    const matchup = matchups.find(
      (matchup) => matchup._id === userPickWithMatchup.matchupId
    );
    if (!matchup) {
      console.error("Matchup not found for user's active pick");
    } else {
      userPickWithMatchup.matchup = matchup;
    }
  }
  const currentTime = new Date().getTime();
  const minus6Hours = currentTime - 6 * 60 * 60 * 1000;
  const plus18Hours = currentTime + 18 * 60 * 60 * 1000;

  return (
    <div className="flex flex-col">
      {userPickWithMatchup && userPickWithMatchup.matchup && (
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold my-2">My Pick</h3>
          <ActivePickCard pick={userPickWithMatchup} />
          <Separator orientation="horizontal" className="my-4" />
        </div>
      )}
      <div className="3xl:grid-cols-4 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3 flex-grow">
        {!matchups &&
          Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-96 self-center rounded-lg" />
          ))}
        {matchups &&
          matchups.length > 0 &&
          matchups
            .filter((m) => m._id !== userPickWithMatchup?.matchupId)
            .sort((a, b) => {
              if (a.status === "STATUS_POSTPONED") return 1;
              if (b.status === "STATUS_POSTPONED") return -1;
              return a.startTime - b.startTime;
            })
            .map((matchup) => {
              if (matchup.featured) {
                return (
                  <BackgroundGradient
                    key={matchup._id}
                    animate={true}
                    className="rounded-lg overflow-hidden shadow-lg"
                  >
                    <MatchupCard matchup={matchup} />
                  </BackgroundGradient>
                );
              } else {
                return <MatchupCard key={matchup._id} matchup={matchup} />;
              }
            })}
      </div>
      <p className="text-center text-xs text-muted">
        {matchups && matchups.length === 0 && "No matchups available"}
        {!matchups && "Loading matchups"}
        {matchups &&
          matchups.length > 0 &&
          `${matchups.length} matchups | Window: ${new Date(
            minus6Hours
          ).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            weekday: "short",
          })} - ${new Date(plus18Hours).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            weekday: "short",
          })}`}
      </p>
    </div>
  );
};

export default MatchupList;
