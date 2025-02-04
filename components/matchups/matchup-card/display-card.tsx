import { Doc } from "@/convex/_generated/dataModel";
import { Card, CardTitle } from "../../ui/card";
import { MatchupWithPickCounts } from "@/convex/matchups";
import { BackgroundGradientSponsored } from "../../ui/background-gradient-sponsored";
import Image from "next/image";
import MatchupCardHeader from "./matchup-card-header";
import MatchupCardFooter from "./matchup-card-footer";

export function DisplayCard({ matchup }: { matchup: MatchupWithPickCounts }) {
  if (matchup.featured) {
    return (
      <BackgroundGradientSponsored
        key={matchup._id}
        animate={false}
        className="rounded-lg overflow-hidden shadow-lg w-full"
        color={
          matchup.featuredType === "CHAINBUILDER"
            ? "green"
            : matchup.metadata?.sponsored?.color || "white"
        }
      >
        <Card className="rounded-t-none flex flex-col w-full">
          <MatchupCardHeader matchup={matchup as Doc<"matchups">} />
          <CardTitle className="text-lg px-4 font-bold flex-1 flex items-start pt-2">
            {matchup.title}
          </CardTitle>

          <div className="grid grid-cols-2 gap-4 p-4 max-w-[400px] mx-auto">
            {/* Away Team */}
            <div className="flex flex-col items-center p-2 rounded-lg bg-muted/20">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden mb-2">
                <Image
                  src={matchup.awayTeam.image || "/placeholder-image.png"}
                  alt={matchup.awayTeam.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <span className="font-semibold text-sm">
                {matchup.awayTeam.name}
              </span>
              <div className="w-full h-2 bg-muted mt-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${((matchup.awayPicks || 0) / ((matchup.awayPicks || 0) + (matchup.homePicks || 0))) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {matchup.awayPicks > 0 && `${matchup.awayPicks} picks`}
              </span>
            </div>

            {/* Home Team */}
            <div className="flex flex-col items-center p-2 rounded-lg bg-muted/20">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden mb-2">
                <Image
                  src={matchup.homeTeam.image || "/placeholder-image.png"}
                  alt={matchup.homeTeam.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <span className="font-semibold text-sm">
                {matchup.homeTeam.name}
              </span>
              <div className="w-full h-2 bg-muted mt-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${((matchup.homePicks || 0) / ((matchup.awayPicks || 0) + (matchup.homePicks || 0))) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {matchup.homePicks > 0 && `${matchup.homePicks} picks`}
              </span>
            </div>
          </div>

          <MatchupCardFooter
            matchup={matchup}
            handleShare={() => {}}
            pick={undefined}
          />
        </Card>
      </BackgroundGradientSponsored>
    );
  }

  return (
    <Card className="rounded-t-none flex flex-col w-full">
      <MatchupCardHeader matchup={matchup as Doc<"matchups">} />
      <CardTitle className="text-lg px-1 font-bold flex-1 flex items-start pt-2 min-h-12">
        {matchup.title}
      </CardTitle>

      <div className="grid grid-cols-2 gap-2 p-2">
        {/* Away Team */}
        <div className="flex flex-col items-center p-2 rounded-lg bg-muted/20">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2">
            <Image
              src={matchup.awayTeam.image || "/placeholder-image.png"}
              alt={matchup.awayTeam.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 40vw, 100px"
            />
          </div>
          <span className="font-semibold">{matchup.awayTeam.name}</span>

          {/* Heat bar for away team */}
          <div className="w-full h-2 bg-muted mt-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{
                width: `${((matchup.awayPicks || 0) / ((matchup.awayPicks || 0) + (matchup.homePicks || 0))) * 100}%`,
              }}
            />
          </div>
          <span className="text-sm text-muted-foreground mt-1">
            {matchup.awayPicks > 0 && `${matchup.awayPicks} picks`}
          </span>
        </div>

        {/* Home Team */}
        <div className="flex flex-col items-center p-2 rounded-lg bg-muted/20">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2">
            <Image
              src={matchup.homeTeam.image || "/placeholder-image.png"}
              alt={matchup.homeTeam.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 40vw, 100px"
            />
          </div>
          <span className="font-semibold">{matchup.homeTeam.name}</span>

          {/* Heat bar for home team */}
          <div className="w-full h-2 bg-muted mt-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{
                width: `${((matchup.homePicks || 0) / ((matchup.awayPicks || 0) + (matchup.homePicks || 0))) * 100}%`,
              }}
            />
          </div>
          <span className="text-sm text-muted-foreground mt-1">
            {matchup.homePicks > 0 && `${matchup.homePicks} picks`}
          </span>
        </div>
      </div>

      <div className="mt-auto">
        <MatchupCardFooter
          matchup={matchup}
          handleShare={() => {}}
          pick={undefined}
        />
      </div>
    </Card>
  );
}
