import { FC } from "react";
import MatchupCardHeader from "./matchup-card-header";
import { Matchup } from "@/drizzle/schema";
import MatchupCardButtons from "./matchup-card-buttons";
import MatchupCardFooter from "./matchup-card-footer";

interface MatchupCardProps {
  matchup: Partial<Matchup>;
}

const MatchupCard: FC<MatchupCardProps> = ({ matchup }) => {
  if (!matchup) return null;
  const userPick = {};
  return (
    <div className="border rounded-b-md w-full h-full shadow-md">
      <MatchupCardHeader
        league={matchup.league}
        network={matchup.network}
        startTime={matchup.start_time}
        status={matchup.status}
      />
      <div className="p-2 flex flex-row justify-between mb-2">
        <h4 className="pr-1 text-sm font-bold md:text-base">
          {matchup.question}
        </h4>
      </div>
      <MatchupCardButtons matchup={matchup} userPick={userPick} />
      <MatchupCardFooter matchup={matchup} homePercent={0} awayPercent={0} />
    </div>
  );
};

export default MatchupCard;
