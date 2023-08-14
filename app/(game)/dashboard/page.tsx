import MatchupCard from "@/components/picks/matchup-card";
import StreakDisplay from "@/components/streaks/streak-display";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Matchup } from "@/drizzle/schema";
import { HistoryIcon } from "lucide-react";
import Link from "next/link";

const exampleMatchup = {
  status: "STATUS_IN_PROGRESS",
  start_time: new Date(),
  game_id: "401472659",
  league: "MLB",
  network: "N/A",
  home_team: "Minnesota Twins",
  home_id: "9",
  winner_id: null,
  home_image: "https://a.espncdn.com/i/teamlogos/mlb/500/scoreboard/min.png",
  home_value: 3,
  away_team: "Arizona Diamondbacks",
  away_id: "29",
  away_image: "https://a.espncdn.com/i/teamlogos/mlb/500/scoreboard/ari.png",
  away_value: 1,
  question:
    "Who will win this matchup? Arizona Diamondbacks @ Minnesota Twins?",
  home_win_condition: "score",
  away_win_condition: "score",
  operator: "GREATER_THAN",
} as Partial<Matchup>;

export default function Page() {
  return (
    <section className="flex flex-col items-center gap-4 py-4 md:py-6 ">
      <h1 className="font-bold text-xl underline underline-offset-8 decoration-primary">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4 w-full px-2 lg:px-4 xl:px-6">
        <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
          <div className="border rounded-xl">
            <div className="flex flex-col justify-center items-center">
              <StreakDisplay size="xl" />
            </div>
          </div>
          <div className="p-2 border rounded-xl">
            <h3 className="text-lg font-semibold">{`Your Active Pick`}</h3>
            <Separator className="my-2" />
            <div className="mt-4">x</div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-6  flex flex-col gap-2">
          <div className="flex flex-row items-center px-2">
            <h3 className="text-lg font-semibold ">{`Today's Picks`}</h3>
            <Button
              className="ml-auto text-xs flex flex-col"
              size={"icon"}
              variant={"link"}
              asChild
            >
              <Link href="/picks">
                <HistoryIcon />
                History
              </Link>
            </Button>
          </div>
          <Separator className="my-2" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
            <MatchupCard matchup={exampleMatchup} />
          </div>
        </div>
      </div>
    </section>
  );
}
