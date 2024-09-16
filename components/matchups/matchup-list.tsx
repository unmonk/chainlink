"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import MatchupCard from "./matchup-card";
import { BackgroundGradient } from "../ui/background-gradient";
import { Doc } from "@/convex/_generated/dataModel";
import ActivePickCard, { UserPickWithMatchup } from "./active-pick";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  FaBasketballBall,
  FaBaseballBall,
  FaHockeyPuck,
  FaFootballBall,
} from "react-icons/fa";
import { GiBugNet } from "react-icons/gi";
import { MdSportsSoccer } from "react-icons/md";
import { getSportFromLeague } from "@/lib/utils";
const MatchupList = ({}) => {
  const matchups = useQuery(api.matchups.getActiveMatchups, {});
  const userPick = useQuery(api.picks.getUserActivePick, {});
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "available" | "chainBuilder">(
    "all"
  );

  const filteredMatchups = useMemo(() => {
    if (!matchups) return [];
    return matchups.filter((m) => {
      const leagueMatch = !selectedLeague || m.league === selectedLeague;
      const availableMatch =
        filter === "all" ||
        (filter === "available" && m.status === "STATUS_SCHEDULED");
      const chainBuilderMatch =
        filter === "all" || (filter === "chainBuilder" && m.featured === true);
      return leagueMatch && (availableMatch || chainBuilderMatch);
    });
  }, [matchups, selectedLeague, filter]);

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

  const sportGroups = useMemo(() => {
    if (!matchups) return {};
    const groups: { [key: string]: string[] } = {};
    matchups.forEach((m) => {
      const sport = getSportFromLeague(m.league);
      if (!groups[sport]) groups[sport] = [];
      if (!groups[sport].includes(m.league)) groups[sport].push(m.league);
    });
    return groups;
  }, [matchups]);

  return (
    <div className="flex flex-col">
      {userPickWithMatchup && userPickWithMatchup.matchup && (
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold my-2">My Pick</h3>
          <ActivePickCard pick={userPickWithMatchup} />
          <Separator orientation="horizontal" className="my-4" />
        </div>
      )}

      {/* Status Filters */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-2 mb-4">
        <Tabs
          value={filter}
          onValueChange={(value) =>
            setFilter(value as "all" | "available" | "chainBuilder")
          }
          className="flex justify-center text-xs"
        >
          <TabsList className="grid grid-cols-3 text-xs">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="available" className="text-xs">
              Available
            </TabsTrigger>
            <TabsTrigger value="chainBuilder" className="text-xs">
              Chain Builder
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* League Filters */}

        <Tabs defaultValue="all" className="flex justify-center">
          <TabsList className="">
            <TabsTrigger
              value="all"
              onClick={() => setSelectedLeague(null)}
              className="text-xs"
            >
              All
            </TabsTrigger>
            {Object.entries(sportGroups).map(([sport, leagues]) => (
              <TabsTrigger
                key={sport}
                value={sport}
                onClick={() => setSelectedLeague(leagues[0])}
                className="p-2"
                title={leagues.join(", ")}
              >
                {getSportIcon(sport)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="3xl:grid-cols-4 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3 flex-grow">
        {!matchups &&
          Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-96 self-center rounded-lg" />
          ))}
        {filteredMatchups.length > 0 &&
          filteredMatchups
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

const getSportIcon = (sport: string) => {
  switch (sport) {
    case "basketball":
      return <FaBasketballBall />;
    case "football":
      return <FaFootballBall />;
    case "baseball":
      return <FaBaseballBall />;
    case "hockey":
      return <FaHockeyPuck />;
    case "soccer":
      return <MdSportsSoccer />;
    case "lacrosse":
      return <GiBugNet />;
    default:
      return null;
  }
};
