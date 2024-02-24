import MatchupCard from "./matchup-card"
import { Matchup, Pick } from "@/drizzle/schema"
import { FC } from "react"

interface MatchupListCardsProps {
  matchups: Matchup[]
  activePick?: Pick
  filter?: string
}

const MatchupListCards: FC<MatchupListCardsProps> = async ({
  matchups,
  activePick,
  filter,
}) => {
  if (!matchups) return <div>No More Matchups</div>

  let sortedMatchups = sortMatchups(matchups)
  if (filter === "inprogress") {
    //remove matches that are inprogress from sortedmatchups
    sortedMatchups = sortedMatchups.filter(
      (matchup) =>
        matchup.status !== "STATUS_IN_PROGRESS" &&
        matchup.status !== "STATUS_FIRST_HALF" &&
        matchup.status !== "STATUS_SECOND_HALF" &&
        matchup.status !== "STATUS_HALFTIME" &&
        matchup.status !== "STATUS_END_PERIOD"
    )
  }

  return (
    <div className="3xl:grid-cols-4 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
      {sortedMatchups.map((matchup: Matchup) => (
        <MatchupCard
          key={matchup.id}
          matchup={matchup}
          disabled={activePick ? true : false}
          activePick={
            matchup.id === activePick?.matchup_id ? activePick : undefined
          }
        />
      ))}
    </div>
  )
}

export default MatchupListCards

function sortMatchups(matchupsArray: Matchup[]): Matchup[] {
  const comparator = (a: Matchup, b: Matchup) => {
    const aStartTime = new Date(a.start_time)
    const bStartTime = new Date(b.start_time)

    if (
      (a.status === "STATUS_FINAL" || a.status === "STATUS_FULL_TIME") &&
      b.status !== "STATUS_FINAL" &&
      b.status !== "STATUS_FULL_TIME"
    ) {
      return 1
    } else if (
      (b.status === "STATUS_FINAL" || b.status === "STATUS_FULL_TIME") &&
      a.status !== "STATUS_FINAL" &&
      a.status !== "STATUS_FULL_TIME"
    ) {
      return -1
    } else if (
      a.status === "STATUS_POSTPONED" &&
      b.status !== "STATUS_POSTPONED"
    ) {
      return 1
    } else if (
      b.status === "STATUS_POSTPONED" &&
      a.status !== "STATUS_POSTPONED"
    ) {
      return -1
    } else if (
      a.status === "STATUS_CANCELED" &&
      b.status !== "STATUS_CANCELED"
    ) {
      return 1
    } else if (
      b.status === "STATUS_CANCELED" &&
      a.status !== "STATUS_CANCELED"
    ) {
      return -1
    } else if (
      a.status === "STATUS_SCHEDULED" &&
      b.status === "STATUS_SCHEDULED"
    ) {
      return aStartTime.getTime() - bStartTime.getTime()
    } else {
      return aStartTime.getTime() - bStartTime.getTime()
    }
  }

  return matchupsArray.sort(comparator)
}
