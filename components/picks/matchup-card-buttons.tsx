import { Button } from "../ui/button";
import PickButton from "./pick-button";
import { Matchup, MatchupStatus, Pick, PickStatus } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface MatchupCardButtonProps {
  matchup: Matchup;
  activePick?: Pick;
  disabled?: boolean;
}

const MatchupCardButtons: FC<MatchupCardButtonProps> = ({
  matchup,
  activePick,
  disabled,
}) => {
  if (!matchup) return null;
  const homeWinClass =
    matchup.winner_id === matchup.home_id
      ? "uppercase underline decoration-1 decoration-blue-500 font-bold"
      : "";

  const awayWinClass =
    matchup.winner_id === matchup.away_id
      ? "uppercase underline decoration-2 decoration-blue-500 font-bold"
      : "";

  const homeSelectedClass =
    activePick?.pick_type === "HOME"
      ? "font-semibold bg-accent rounded-lg"
      : "";
  const awaySelectedClass =
    activePick?.pick_type === "AWAY"
      ? "font-semibold bg-accent rounded-lg"
      : "";

  const userHomeWinClass =
    activePick?.pick_type === "HOME" && activePick?.pick_status === "WIN"
      ? "font-extrabold  bg-green-100 dark:bg-green-900 rounded-lg p-1"
      : "";

  const userHomeLossClass =
    activePick?.pick_type === "HOME" && activePick?.pick_status === "LOSS"
      ? "font-extrabold  bg-red-100 dark:bg-red-900 rounded-lg p-1"
      : "";

  const userAwayLossClass =
    activePick?.pick_type === "AWAY" && activePick?.pick_status === "LOSS"
      ? "font-extrabold  bg-red-100 dark:bg-red-900 rounded-lg p-1"
      : "";

  const userAwayWinClass =
    activePick?.pick_type === "AWAY" && activePick?.pick_status === "WIN"
      ? "font-extrabold  bg-green-100 dark:bg-green-900 rounded-lg p-1"
      : "";

  return (
    <div className="grid grid-cols-4 items-center gap-2 p-1">
      <div className="col-span-1 flex items-center justify-center text-center">
        <PickButton
          teamImage={matchup.away_image}
          type={"AWAY"}
          disabled={disabled}
          matchupId={matchup.id!}
          variant={
            activePick?.pick_type === "AWAY" &&
            (activePick?.pick_status === "WIN" ||
              activePick?.pick_status === "LOSS")
              ? activePick.pick_status
              : matchup.status
          }
          selected={activePick?.pick_type === "AWAY"}
          winner={matchup.winner_id === matchup.away_id}
        />
      </div>

      <p
        className={cn(
          "col-span-1 text-center text-xs sm:text-sm md:text-base",
          userAwayWinClass,
          userAwayLossClass,
          awayWinClass,
          awaySelectedClass,
        )}
      >
        {matchup.away_team}
      </p>

      <p
        className={cn(
          "col-span-1 text-center text-xs sm:text-sm  md:text-base",
          userHomeWinClass,
          userHomeLossClass,
          homeWinClass,
          homeSelectedClass,
        )}
      >
        <span className="px-1 text-xs text-primary">@</span>
        {matchup.home_team}
      </p>

      <div className="col-span-1 flex items-center justify-center text-center">
        <PickButton
          teamImage={matchup.home_image}
          type={"HOME"}
          disabled={disabled}
          matchupId={matchup.id!}
          variant={
            activePick?.pick_type === "HOME" &&
            (activePick?.pick_status === "WIN" ||
              activePick?.pick_status === "LOSS")
              ? activePick.pick_status
              : matchup.status
          }
          selected={activePick?.pick_type === "HOME"}
          winner={matchup.winner_id === matchup.home_id}
        />
      </div>
    </div>
  );
};

export default MatchupCardButtons;
