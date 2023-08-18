import MatchupCard from "./matchup-card";
import { Matchup } from "@/drizzle/schema";
import { FC } from "react";

interface MatchupListCardsProps {
  matchups: Matchup[];
}

const MatchupListCards: FC<MatchupListCardsProps> = async ({ matchups }) => {
  if (!matchups) return <div>No More Matchups</div>;

  const sortedMatchups = sortMatchups(matchups);

  return (
    <div className="3xl:grid-cols-4 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
      {sortedMatchups.map((matchup: Matchup) => (
        <MatchupCard key={matchup.id} matchup={matchup} />
      ))}
    </div>
  );
};

export default MatchupListCards;

function sortMatchups(matchupsArray: Matchup[]): Matchup[] {
  const comparator = (a: Matchup, b: Matchup) => {
    const aStartTime = new Date(a.start_time);
    const bStartTime = new Date(b.start_time);

    if (a.status === "STATUS_SCHEDULED" && b.status !== "STATUS_SCHEDULED") {
      return -1;
    } else if (
      b.status === "STATUS_SCHEDULED" &&
      a.status !== "STATUS_SCHEDULED"
    ) {
      return 1;
    } else if (a.status === "STATUS_FINAL" && b.status !== "STATUS_FINAL") {
      return 1;
    } else if (b.status === "STATUS_FINAL" && a.status !== "STATUS_FINAL") {
      return -1;
    } else if (
      a.status === "STATUS_POSTPONED" &&
      b.status !== "STATUS_POSTPONED"
    ) {
      return 1;
    } else if (
      b.status === "STATUS_POSTPONED" &&
      a.status !== "STATUS_POSTPONED"
    ) {
      return -1;
    } else if (
      a.status === "STATUS_CANCELED" &&
      b.status !== "STATUS_CANCELED"
    ) {
      return 1;
    } else if (
      b.status === "STATUS_CANCELED" &&
      a.status !== "STATUS_CANCELED"
    ) {
      return -1;
    } else if (
      a.status === "STATUS_SCHEDULED" &&
      b.status === "STATUS_SCHEDULED"
    ) {
      return aStartTime.getTime() - bStartTime.getTime();
    } else {
      return aStartTime.getTime() - bStartTime.getTime();
    }
  };

  return matchupsArray.sort(comparator);
}
