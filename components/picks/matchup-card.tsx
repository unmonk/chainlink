import MatchupCardButtons from "./matchup-card-buttons";
import MatchupCardFooter from "./matchup-card-footer";
import MatchupCardHeader, { PickCardVariant } from "./matchup-card-header";
import { Matchup } from "@/drizzle/schema";
import { FC } from "react";

interface MatchupCardProps {
  matchup: Partial<Matchup>;
}

const MatchupCard: FC<MatchupCardProps> = ({ matchup }) => {
  if (!matchup) return null;
  const userPick = {};
  return (
    <div className="h-full w-full rounded-b-md border shadow-md">
      <MatchupCardHeader
        matchup={matchup}
        status={matchup.status as PickCardVariant}
      />
      <div className="mb-2 flex flex-row justify-between p-2">
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
