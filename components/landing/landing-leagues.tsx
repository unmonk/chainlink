"use client";
import { Radar } from "lucide-react";
import { ACTIVE_LEAGUES, leagueLogos, leagueNames } from "@/convex/utils";
import Image from "next/image";
import OrbitingCircles from "../ui/orbital";
import { LeagueBeam } from "../ui/beams";
import { Timeline } from "react-twitter-widgets";

export const LandingLeagues = () => {
  return (
    <section id="leagues" className="container w-full">
      <div className="flex flex-col md:flex-row">
        <LeagueBeam />
      </div>
    </section>
  );
};
