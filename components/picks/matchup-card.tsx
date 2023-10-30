import MatchupCardButtons from "./matchup-card-buttons";
import MatchupCardFooter from "./matchup-card-footer";
import MatchupCardHeader from "./matchup-card-header";
import { PickCardVariant } from "@/drizzle/schema";
import { Matchup, Pick } from "@/drizzle/schema";
import { FC } from "react";

interface MatchupCardProps {
  matchup: Matchup;
  activePick?: Pick;
  disabled?: boolean;
}

const MatchupCard: FC<MatchupCardProps> = ({
  matchup,
  activePick,
  disabled,
}) => {
  if (!matchup) return null;
  return (
    <div className="h-full w-full rounded-b-md border shadow-md">
      <MatchupCardHeader
        matchup={matchup}
        status={matchup.status as PickCardVariant}
      />
      <div className="mb-2 flex flex-row justify-between p-2">
        <h4 className="h-8 pr-1 text-sm font-bold md:text-base">
          {matchup.question}
        </h4>
      </div>
      <MatchupCardButtons
        matchup={matchup}
        activePick={activePick}
        disabled={disabled}
      />
      <MatchupCardFooter matchup={matchup} homePercent={0} awayPercent={0} />
    </div>
  );
};

export default MatchupCard;
