import { FC } from "react";
import Link from "next/link";
import { Matchup, MatchupStatus } from "@/drizzle/schema";

import { Button } from "@/components/ui/button";

interface MatchupCardFooterProps {
  homePercent?: number;
  awayPercent?: number;
  matchup: Partial<Matchup>;
}

const MatchupCardFooter: FC<MatchupCardFooterProps> = ({
  matchup,
  homePercent,

  awayPercent,
}) => {
  const homeWinClass =
    matchup.winner_id === matchup.home_id
      ? "overline decoration-4 decoration-blue-500 font-bold"
      : "";

  const awayWinClass =
    matchup.winner_id === matchup.away_id
      ? "overline decoration-4 decoration-blue-500 font-bold"
      : "";
  return (
    <div className="grid grid-cols-3 under ">
      <div className="col-span-1 text-left ml-4">
        {matchup.status === "STATUS_SCHEDULED" && <p>{awayPercent}%</p>}
        {(matchup.status === "STATUS_FINAL" ||
          matchup.status === "STATUS_IN_PROGRESS") &&
          (matchup.away_value ? (
            <p className={awayWinClass}>{matchup.away_value}</p>
          ) : (
            <p className="text-xs">0</p>
          ))}
      </div>
      <div className="col-span-1 text-center">
        {matchup.status === "STATUS_SCHEDULED" && (
          <Button variant="link" size="sm" asChild>
            <Link
              prefetch={false}
              href={`/gamedetails/${matchup.league}/${matchup.game_id}`}
            >
              Preview
            </Link>
          </Button>
        )}
        {matchup.status === "STATUS_FINAL" && (
          <Button variant="link" size="sm" asChild>
            <Link
              prefetch={false}
              href={`/gamedetails/${matchup.league}/${matchup.game_id}`}
            >
              Recap
            </Link>
          </Button>
        )}
        {matchup.status === "STATUS_IN_PROGRESS" && (
          <Button variant="link" size="sm" asChild>
            <Link
              href={`/gamedetails/${matchup.league}/${matchup.game_id}`}
              className=""
              prefetch={false}
            >
              Live
            </Link>
          </Button>
        )}
        {matchup.status === "STATUS_POSTPONED" && (
          <p className="text-xs text-amber-400 px-4 py-2">Postponed</p>
        )}
        {matchup.status === "STATUS_CANCELED" && (
          <p className="text-xs text-rose-600 px-4 py-2">Canceled</p>
        )}
        {matchup.status === "STATUS_SUSPENDED" && (
          <p className="text-xs text-amber-400 px-4 py-2">Suspended</p>
        )}
        {matchup.status === "STATUS_DELAYED" && (
          <p className="text-xs text-amber-400 px-4 py-2">Delayed</p>
        )}
      </div>
      <div className="col-span-1 text-right mr-4">
        {matchup.status === "STATUS_SCHEDULED" && <p>{homePercent}%</p>}
        {(matchup.status === "STATUS_FINAL" ||
          matchup.status === "STATUS_IN_PROGRESS") &&
          (matchup.home_value ? (
            <p className={homeWinClass}>{matchup.home_value}</p>
          ) : (
            <p className="text-xs">0</p>
          ))}
      </div>
    </div>
  );
};

export default MatchupCardFooter;
