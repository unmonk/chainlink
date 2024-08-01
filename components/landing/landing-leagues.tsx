"use client";
import { Radar } from "lucide-react";
import { ACTIVE_LEAGUES, leagueLogos, leagueNames } from "@/convex/utils";
import Image from "next/image";
import OrbitingCircles from "../ui/orbital";
import { LeagueBeam } from "../ui/beams";
import { Timeline } from "react-twitter-widgets";

export const LandingLeagues = () => {
  return (
    <section id="leagues">
      {/* <div className="relative flex h-[450px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-transparent md:shadow-xl">
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-green-300 bg-clip-text text-center text-5xl leading-none text-transparent font-light dark:from-green-500 dark:to-black">
          Our Leagues
        </span>
        {ACTIVE_LEAGUES.map((league) => (
          <OrbitingCircles
            key={league}
            className="size-[30px] border-none bg-transparent"
            duration={randomInt(10, 30)}
            delay={randomInt(0, 30)}
            radius={randomInt(50, 250)}
            reverse={randomTrueFalse()}
          >
            <Image
              src={leagueLogos[league]}
              width={45}
              height={45}
              alt={league}
            />
            <p className="text-xs">{leagueNames[league]}</p>
          </OrbitingCircles>
        ))}
      </div> */}
      <div className="flex flex-col md:flex-row">
        <LeagueBeam />
        <div className="w-1/2 items-center justify-center p-14 rounded-lg">
          <Timeline
            dataSource={{
              sourceType: "profile",
              screenName: "ChainLink_st",
            }}
            options={{
              height: "400",
              width: "400",
              theme: "dark",
            }}
          />
        </div>
      </div>
    </section>
  );
};

const randomTrueFalse = () => Math.random() < 0.5;
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);
