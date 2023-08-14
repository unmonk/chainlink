import { Button } from "../ui/button";
import PickButton from "./pick-button";
import { Matchup, MatchupStatus, Pick, PickStatus } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface MatchupCardButtonProps {
  matchup: Partial<Matchup>;
  userPick?: Partial<Pick>;
}

const MatchupCardButtons: FC<MatchupCardButtonProps> = ({
  matchup,
  userPick,
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
    userPick?.pick_type === "HOME" ? "font-semibold bg-accent rounded-lg" : "";
  const awaySelectedClass =
    userPick?.pick_type === "AWAY" ? "font-semibold bg-accent rounded-lg" : "";

  const userHomeWinClass =
    userPick?.pick_type === "HOME" && userPick?.pick_status === "WIN"
      ? "font-extrabold  bg-green-100 dark:bg-green-900 rounded-lg p-1"
      : "";

  const userHomeLossClass =
    userPick?.pick_type === "HOME" && userPick?.pick_status === "LOSS"
      ? "font-extrabold  bg-red-100 dark:bg-red-900 rounded-lg p-1"
      : "";

  const userAwayLossClass =
    userPick?.pick_type === "AWAY" && userPick?.pick_status === "LOSS"
      ? "font-extrabold  bg-red-100 dark:bg-red-900 rounded-lg p-1"
      : "";

  const userAwayWinClass =
    userPick?.pick_type === "AWAY" && userPick?.pick_status === "WIN"
      ? "font-extrabold  bg-green-100 dark:bg-green-900 rounded-lg p-1"
      : "";

  let disabled = matchup.status !== "STATUS_SCHEDULED";
  if (userPick) {
    disabled = true;
  }
  return (
    <div className="grid grid-cols-4 items-center gap-2 p-1">
      <div className="col-span-1 flex items-center justify-center text-center">
        <PickButton
          teamImage={matchup.away_image}
          type={"AWAY"}
          disabled={disabled}
          matchupId={matchup.game_id!}
          variant={
            userPick?.pick_type === "AWAY" &&
            (userPick?.pick_status === "WIN" ||
              userPick?.pick_status === "LOSS")
              ? userPick.pick_status
              : matchup.status
          }
          selected={userPick?.pick_type === "AWAY"}
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
          matchupId={matchup.game_id!}
          variant={
            userPick?.pick_type === "HOME" &&
            (userPick?.pick_status === "WIN" ||
              userPick?.pick_status === "LOSS")
              ? userPick.pick_status
              : matchup.status
          }
          selected={userPick?.pick_type === "HOME"}
        />
      </div>
    </div>
  );
};

export default MatchupCardButtons;
