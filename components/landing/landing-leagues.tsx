import { Radar } from "lucide-react";
import { ACTIVE_LEAGUES, leagueLogos, leagueNames } from "@/convex/utils";
import Image from "next/image";

export const LandingLeagues = () => {
  return (
    <section id="sponsors" className="container pt-8 sm:py-16">
      <h2 className="text-center text-md lg:text-xl font-bold mb-8 text-primary">
        Matchups From
      </h2>

      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 ">
        {ACTIVE_LEAGUES.map((league) => (
          <div
            key={league}
            className="flex items-center gap-1 text-muted-foreground/60 bg-accent/50 p-2 rounded-lg"
          >
            <Image
              src={leagueLogos[league]}
              width={34}
              height={34}
              alt={league}
            />
            <h3 className="text-xl font-bold">{leagueNames[league]}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};
