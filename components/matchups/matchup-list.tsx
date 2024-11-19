"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import MatchupCard from "./matchup-card";
import { BackgroundGradient } from "../ui/background-gradient";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { useMemo, useState } from "react";
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
import { Card } from "../ui/card";
import BlurFade from "../ui/blur-fade";
import { BackgroundGradientSponsored } from "../ui/background-gradient-sponsored";
import MatchupSkeleton from "./matchup-skeleton";

const MatchupList = ({}) => {
  const matchups = useQuery(api.matchups.getActiveMatchups, {});
  const userPickWithMatchup = useQuery(api.picks.getUserActivePickWithMatchup);

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

  const currentTime = new Date().getTime();
  const minus8Hours = currentTime - 8 * 60 * 60 * 1000;
  const plus24Hours = currentTime + 24 * 60 * 60 * 1000;

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
      {userPickWithMatchup && (
        <div className="flex flex-col gap-4 items-center">
          <h3 className="text-lg font-semibold my-2">My Pick</h3>
          <MatchupCard
            matchup={userPickWithMatchup.matchupWithPicks}
            activePick={userPickWithMatchup.pick}
          />
          <Separator orientation="horizontal" className="my-4" />
        </div>
      )}

      {/* Status Filters - Always visible */}
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

        {/* League Filters - Always visible */}
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
        {!matchups
          ? Array.from({ length: 12 }).map((_, i) => (
              <MatchupSkeleton key={i} />
            ))
          : filteredMatchups.length > 0 &&
            filteredMatchups
              .filter(
                (m) => m._id !== userPickWithMatchup?.matchupWithPicks._id
              )
              .sort((a, b) => {
                if (a.status === "STATUS_POSTPONED") return 1;
                if (b.status === "STATUS_POSTPONED") return -1;
                return a.startTime - b.startTime;
              })
              .map((matchup, idx) => {
                if (matchup.featured) {
                  return (
                    <BlurFade
                      key={matchup._id}
                      delay={0.25 * idx * 0.01}
                      inView
                    >
                      {matchup.featuredType === "CHAINBUILDER" && (
                        <BackgroundGradient
                          key={matchup._id}
                          animate={true}
                          className="rounded-lg overflow-hidden shadow-lg"
                        >
                          <MatchupCard matchup={matchup} />
                        </BackgroundGradient>
                      )}
                      {matchup.featuredType === "SPONSORED" && (
                        <BackgroundGradientSponsored
                          key={matchup._id}
                          animate={true}
                          className="rounded-lg overflow-hidden shadow-lg"
                          color={matchup.metadata.sponsoredData.color}
                        >
                          <MatchupCard matchup={matchup} />
                        </BackgroundGradientSponsored>
                      )}
                    </BlurFade>
                  );
                } else {
                  return (
                    <BlurFade
                      key={matchup._id}
                      delay={0.25 * idx * 0.01}
                      inView
                    >
                      <MatchupCard matchup={matchup} />
                    </BlurFade>
                  );
                }
              })}
      </div>

      {/* Footer text */}
      <p className="text-center text-xs text-muted">
        {!matchups ? (
          <Skeleton className="h-4 w-64 mx-auto" />
        ) : matchups.length === 0 ? (
          "No matchups available"
        ) : (
          `${matchups.length} matchups | Window: ${new Date(
            minus8Hours
          ).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            weekday: "short",
          })} - ${new Date(plus24Hours).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            weekday: "short",
          })}`
        )}
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
