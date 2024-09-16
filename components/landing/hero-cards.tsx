"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check, LightbulbIcon, Linkedin } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Logo } from "../ui/logo";
import { matchupReward } from "@/convex/utils";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { BackgroundGradient } from "../ui/background-gradient";

export const HeroCards = () => {
  //const matchups = useQuery(api.matchups.getHomepageMatchups, {});
  const matchups = [
    {
      active: false,
      awayTeam: {
        id: "7",
        image: "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/den.png",
        name: "Broncos",
        score: 20,
      },
      cost: 0,
      featured: false,
      gameId: "401671664",
      homeTeam: {
        id: "26",
        image: "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/sea.png",
        name: "Seahawks",
        score: 26,
      },
      league: "NFL",
      metadata: { network: "CBS", statusDetails: "Final" },
      startTime: 1725825900000,
      status: "STATUS_FINAL",
      title: "Who will win? Broncos @ Seahawks",
      type: "SCORE",
      typeDetails: "GREATER_THAN",
      updatedAt: 1725837867747,
      winnerId: "26",
    },
    {
      active: true,
      awayTeam: {
        id: "183",
        image: "https://a.espncdn.com/i/teamlogos/soccer/500/183.png",
        name: "Columbus Crew",
        score: 0,
      },
      cost: 0,
      featured: false,
      gameId: "693007",
      homeTeam: {
        id: "18267",
        image: "https://a.espncdn.com/i/teamlogos/soccer/500/18267.png",
        name: "FC Cincinnati",
        score: 0,
      },
      league: "MLS",
      metadata: { network: "MLS Season Pass" },
      startTime: 1726356600000,
      status: "STATUS_SCHEDULED",
      title: "Who will win? Columbus Crew @ FC Cincinnati",
      type: "SCORE",
      typeDetails: "GREATER_THAN",
    },
    {
      active: false,
      awayTeam: {
        id: "7",
        image: "https://a.espncdn.com/i/teamlogos/mlb/500/scoreboard/kc.png",
        name: "Royals",
        score: 5,
      },
      cost: 0,
      featured: false,
      gameId: "401570638",
      homeTeam: {
        id: "10",
        image: "https://a.espncdn.com/i/teamlogos/mlb/500/scoreboard/nyy.png",
        name: "Yankees",
        score: 0,
      },
      league: "MLB",
      metadata: { network: "MLB.TV", statusDetails: "Final" },
      startTime: 1726009500000,
      status: "STATUS_FINAL",
      title: "Who will win? Royals @ Yankees",
      type: "SCORE",
      typeDetails: "GREATER_THAN",
      updatedAt: 1726018827969,
      winnerId: "7",
    },
  ];

  return (
    <div className="hidden lg:flex flex-row flex-nowrap gap-2">
      <div className="hidden xl:flex flex-col w-1/2 h-full items-center justify-center gap-4">
        <Card className=" drop-shadow-xl shadow-black/10 dark:shadow-white/10 w-full">
          {!matchups && <Skeleton className="w-full h-12" />}
          <CardHeader className="flex flex-row items-center gap-4 pb-2 font-bold text-lg text-nowrap">
            {matchups && matchups[0].title}
          </CardHeader>

          <CardContent>
            <div className="flex flex-row items-center justify-between gap-2">
              <div className="flex flex-row items-center gap-4 bg-accent rounded-lg p-2">
                {!matchups && (
                  <Skeleton className="w-full h-1/2 rounded-lg p-2" />
                )}
                {matchups && (
                  <>
                    <Avatar>
                      <AvatarImage src={matchups[0].awayTeam.image} />
                      <AvatarFallback>
                        {matchups[0].awayTeam.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <h3>{matchups[0].awayTeam.name}</h3>
                  </>
                )}
              </div>
              <div className="flex flex-row items-center gap-4 bg-accent rounded-lg p-2">
                {!matchups && (
                  <Skeleton className="w-full h-1/2 rounded-lg p-2" />
                )}
                {matchups && (
                  <>
                    <Avatar>
                      <AvatarImage src={matchups[0].homeTeam.image} />
                      <AvatarFallback>
                        {matchups[0].homeTeam.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <h3>{matchups[0].homeTeam.name}</h3>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="drop-shadow-xl shadow-black/10 dark:shadow-white/10 w-full">
          {!matchups && <Skeleton className="w-full h-12" />}
          <CardHeader className="flex flex-row items-center gap-4 pb-2 font-bold text-lg text-nowrap">
            {matchups && matchups[1].title}
          </CardHeader>

          <CardContent>
            <div className="flex flex-row items-center justify-between gap-2">
              <div className="flex flex-row items-center gap-4  bg-accent rounded-lg p-2">
                {!matchups && (
                  <Skeleton className="w-full h-1/2 rounded-lg p-2" />
                )}
                {matchups && (
                  <>
                    <Avatar>
                      <AvatarImage src={matchups[1].awayTeam.image} />
                      <AvatarFallback>
                        {matchups[1].awayTeam.name[1]}
                      </AvatarFallback>
                    </Avatar>
                    <h3>{matchups[1].awayTeam.name}</h3>
                  </>
                )}
              </div>
              <div className="flex flex-row items-center gap-4 bg-accent rounded-lg p-2">
                {!matchups && (
                  <Skeleton className="w-full h-1/2 rounded-lg p-2" />
                )}
                {matchups && (
                  <>
                    <Avatar>
                      <AvatarImage src={matchups[1].homeTeam.image} />
                      <AvatarFallback>
                        {matchups[1].homeTeam.name[1]}
                      </AvatarFallback>
                    </Avatar>
                    <h3>{matchups[1].homeTeam.name}</h3>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col w-1/2 h-full items-center justify-center self-center">
        <BackgroundGradient animate={true} className="rounded-lg  shadow-lg">
          <Card className=" w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
            <CardHeader className="mt-2 flex justify-center items-center pb-2">
              <Logo className="absolute grayscale-[0%] -top-12 rounded-full w-24 h-24 aspect-square object-cover z-20" />
              <div className="flex flex-row items-center justify-center gap-4">
                {!matchups && <Skeleton className="w-9 h-9 rounded-full" />}
                {matchups && (
                  <Image
                    src={matchups[2].awayTeam.image}
                    alt={matchups[2].awayTeam.name}
                    width={50}
                    height={50}
                    style={{
                      maxWidth: "100%",
                      height: "auto"
                    }} />
                )}
                {!matchups && <Skeleton className="w-9 h-9 rounded-full" />}
                {matchups && (
                  <Image
                    src={matchups[2].homeTeam.image}
                    alt={matchups[2].homeTeam.name}
                    width={50}
                    height={50}
                    style={{
                      maxWidth: "100%",
                      height: "auto"
                    }} />
                )}
              </div>

              {!matchups && <Skeleton className="w-full h-12" />}
              <CardTitle className="text-center">
                {matchups && matchups[2].title}
              </CardTitle>
              {!matchups && <Skeleton className="w-full h-12" />}
              <CardDescription className="font-normal text-yellow-500">
                {matchups && (
                  <>Reward: 🔗{matchupReward(matchups[2].cost, true)}</>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center pb-2">
              <p className="font-bold text-lg text-primary">ChainBuilder</p>
              <p>
                ChainBuilder picks will net you additional links for wins. Build
                your chain today.
              </p>
            </CardContent>
          </Card>
        </BackgroundGradient>
      </div>
    </div>
  );
};
