"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import MatchupCard from "./matchup-card";
import { BackgroundGradient } from "../ui/background-gradient";
import { Doc } from "@/convex/_generated/dataModel";
import ActivePickCard, { UserPickWithMatchup } from "./active-pick";
import { Separator } from "../ui/separator";

const MatchupList = ({}) => {
  const matchups = useQuery(api.matchups.getActiveMatchups, {});
  const userPick = useQuery(api.picks.getUserActivePick, {});

  const userPickWithMatchup = userPick as UserPickWithMatchup;
  //get the matchup for the user's active pick from matchups array by id
  if (userPickWithMatchup && matchups) {
    const matchup = matchups.find(
      (matchup) => matchup._id === userPickWithMatchup.matchupId
    );
    if (!matchup) return null;
    userPickWithMatchup.matchup = matchup;
  }

  return (
    <div>
      {userPickWithMatchup && userPickWithMatchup.matchup && (
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold my-2">My Pick</h3>
          <ActivePickCard pick={userPickWithMatchup} />
          <Separator orientation="horizontal" className="my-4" />
        </div>
      )}
      <div className="3xl:grid-cols-4 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {matchups &&
          matchups.map((matchup) => {
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
    </div>
  );
};

export default MatchupList;
