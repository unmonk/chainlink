import { Button } from "@/components/ui/button"
import { Matchup, MatchupStatus } from "@/drizzle/schema"
import Link from "next/link"
import { FC } from "react"

interface MatchupCardFooterProps {
  homePercent?: number
  awayPercent?: number
  matchup: Partial<Matchup>
}

const MatchupCardFooter: FC<MatchupCardFooterProps> = ({
  matchup,
  homePercent,
  awayPercent,
}) => {
  const homeWinClass =
    matchup.winner_id === matchup.home_id
      ? "overline decoration-4 decoration-blue-500 font-bold"
      : ""

  const awayWinClass =
    matchup.winner_id === matchup.away_id
      ? "overline decoration-4 decoration-blue-500 font-bold"
      : ""
  return (
    <div className="under grid grid-cols-3 ">
      <div className="col-span-1 ml-4 text-left">
        {(matchup.status === "STATUS_FINAL" ||
          matchup.status === "STATUS_IN_PROGRESS" ||
          matchup.status === "STATUS_FIRST_HALF" ||
          matchup.status === "STATUS_SECOND_HALF" ||
          matchup.status === "STATUS_FULL_TIME" ||
          matchup.status === "STATUS_END_PERIOD" ||
          matchup.status === "STATUS_HALFTIME") &&
          (matchup.away_value ? (
            <p className={awayWinClass}>{matchup.away_value}</p>
          ) : (
            <p className={awayWinClass}>0</p>
          ))}
      </div>
      <div className="col-span-1 text-center">
        {/* {matchup.status === "STATUS_SCHEDULED" && (
          <Button variant="link" size="sm" asChild>
            <Link
              prefetch={false}
              href={`/gamedetails/${matchup.league}/${matchup.game_id}`}
            >
              Preview
            </Link>
          </Button>
        )} */}
        {/* {matchup.status === "STATUS_FINAL" && (
          <Button variant="link" size="sm" asChild>
            <Link
              prefetch={false}
              href={`/gamedetails/${matchup.league}/${matchup.game_id}`}
            >
              Recap
            </Link>
          </Button>
        )} */}
        {/* {matchup.status === "STATUS_IN_PROGRESS" && (
          <Button variant="link" size="sm" asChild>
            <Link
              href={`/gamedetails/${matchup.league}/${matchup.game_id}`}
              className=""
              prefetch={false}
            >
              Live
            </Link>
          </Button>
        )} */}
        {matchup.status === "STATUS_POSTPONED" && (
          <p className="px-4 py-2 text-xs text-amber-400">Postponed</p>
        )}
        {matchup.status === "STATUS_CANCELED" && (
          <p className="px-4 py-2 text-xs text-rose-600">Canceled</p>
        )}
        {matchup.status === "STATUS_SUSPENDED" && (
          <p className="px-4 py-2 text-xs text-amber-400">Suspended</p>
        )}
        {matchup.status === "STATUS_DELAYED" && (
          <p className="px-4 py-2 text-xs text-amber-400">Delayed</p>
        )}
      </div>
      <div className="col-span-1 mr-4 text-right">
        {(matchup.status === "STATUS_FINAL" ||
          matchup.status === "STATUS_FIRST_HALF" ||
          matchup.status === "STATUS_SECOND_HALF" ||
          matchup.status === "STATUS_FULL_TIME" ||
          matchup.status === "STATUS_IN_PROGRESS" ||
          matchup.status === "STATUS_END_PERIOD" ||
          matchup.status === "STATUS_HALFTIME") &&
          (matchup.home_value ? (
            <p className={homeWinClass}>{matchup.home_value}</p>
          ) : (
            <p className={homeWinClass}>0</p>
          ))}
      </div>
    </div>
  )
}

export default MatchupCardFooter
