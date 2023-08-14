import MatchupCard from "./matchup-card";
import { Matchup } from "@/drizzle/schema";
import { absoluteUrl } from "@/lib/utils";
import { FC } from "react";

interface MatchupListCardsProps {}

const MatchupListCards: FC<MatchupListCardsProps> = async ({}) => {
  const res = await fetch(absoluteUrl("/api/matchups"), {
    next: {
      revalidate: 120,
    },
  });
  const matchups = await res.json();
  if (!matchups) return <div>loading...</div>;

  const matchupsArray: Partial<Matchup>[] = Object.values(matchups);

  //sort by start_time and status
  matchupsArray.sort((a, b) => {
    const aStartTime = new Date(a.start_time || "");
    const bStartTime = new Date(b.start_time || "");

    if (aStartTime.getTime() === bStartTime.getTime()) {
      if (a.status === "STATUS_FINAL" && b.status !== "STATUS_FINAL") {
        return 1;
      } else if (b.status === "STATUS_FINAL" && a.status !== "STATUS_FINAL") {
        return -1;
      }
      return 0;
    }

    return aStartTime.getTime() - bStartTime.getTime();
  });

  return (
    <div className="3xl:grid-cols-4 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
      {matchupsArray.map((matchup: Partial<Matchup>) => (
        <MatchupCard key={matchup.game_id} matchup={matchup} />
      ))}
    </div>
  );
};

export default MatchupListCards;
