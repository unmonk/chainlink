import { MatchupWithPickCounts } from "@/convex/matchups";
import MatchupPickButton from "./matchup-pick-button";
import ReactionBar from "../reactions/reaction-bar";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { formatDistance } from "date-fns";
import { LockIcon } from "lucide-react";

const MatchupCardButtons = ({
  matchup,
  activePick,
  userId,
}: {
  matchup: MatchupWithPickCounts;
  userId: Id<"users"> | null | undefined;
  activePick?: Doc<"picks">;
}) => {
  const totalPicks = matchup.homePicks + matchup.awayPicks;
  const isHotMatchup = totalPicks >= 5;

  const getGradientColors = (picks: number) => {
    if (picks < 2) {
      return "from-blue-300 via-blue-400 to-blue-500"; // Cold theme
    } else if (picks < 4) {
      return "from-yellow-300 via-orange-200 to-orange-500"; // Warm theme
    } else {
      return "from-red-500 via-red-600 to-red-700"; // Hot theme
    }
  };

  const currentlyWinning =
    matchup.awayTeam.score === matchup.homeTeam.score
      ? null
      : matchup.awayTeam.score > matchup.homeTeam.score
        ? matchup.awayTeam.id
        : matchup.homeTeam.id;

  const getBarWidth = (picks: number) => {
    if (picks === 0) return "0%";
    const width = Math.min(10 + picks * 15, 100);
    return `${width}%`;
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-3 items-center text-center">
        <span className="text-balance text-sm font-semibold">
          {matchup.awayTeam.name}
        </span>
        <span className="text-primary text-sm"></span>
        <span className="text-balance text-sm font-semibold">
          <span className="text-primary text-xs font-extralight">@</span>
          {matchup.homeTeam.name}
        </span>
      </div>
      <div className="grid grid-cols-6 items-center text-center py-1 px-1 gap-x-0.5 w-full overflow-hidden">
        <div className="col-span-2">
          <MatchupPickButton
            name={matchup.awayTeam.name}
            image={matchup.awayTeam.image}
            id={matchup.awayTeam.id}
            disabled={
              (matchup.status !== "STATUS_SCHEDULED" &&
                matchup.status !== "STATUS_POSTPONED") ||
              !!activePick ||
              !userId
            }
            winnerId={matchup.winnerId}
            matchupId={matchup._id}
            currentlyWinning={currentlyWinning}
            activePickId={activePick?.pick.id}
          />
          <div className="flex items-center justify-center font-bold text-xl">
            {matchup.type === "SPREAD" && matchup.metadata?.spread && (
              <div className="bg-accent/90 p-1 rounded-sm justify-center gap-1 flex items-center text-sm whitespace-nowrap">
                {-matchup.metadata.spread}
              </div>
            )}
            {matchup.type === "CUSTOM_SCORE" &&
              matchup.metadata?.awayCustomScoreType === "WINBYXPLUS" &&
              matchup.metadata?.awayWinBy && (
                <div className="bg-accent/90 p-1 rounded-sm justify-center gap-1 flex items-center text-sm whitespace-nowrap">
                  Win By {matchup.metadata.awayWinBy}+
                </div>
              )}
            {matchup.type === "CUSTOM_SCORE" &&
              matchup.metadata?.awayCustomScoreType === "WINDRAWLOSEBYX" &&
              matchup.metadata?.awayWinBy && (
                <div className="bg-accent/90 p-1 rounded-sm justify-center gap-1 flex items-center text-xs whitespace-nowrap">
                  Win, Draw, or Lose by {matchup.metadata.awayWinBy}
                </div>
              )}
            {matchup.type === "CUSTOM_SCORE" &&
              matchup.metadata?.awayCustomScoreType === "WIN" && (
                <div className="bg-accent/90 p-1 rounded-sm justify-center gap-1 flex items-center text-xs whitespace-nowrap">
                  Win
                </div>
              )}
          </div>
        </div>
        {(matchup.status === "STATUS_SCHEDULED" ||
          matchup.status === "STATUS_POSTPONED") && (
          <>
            <div className="col-span-1 flex items-center justify-center px-1">
              <div className="h-2 w-full rounded-full bg-foreground/10 relative">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getGradientColors(matchup.awayPicks)}`}
                  style={{
                    width: getBarWidth(matchup.awayPicks),
                    transition: "width 0.3s ease-in-out",
                    boxShadow:
                      matchup.awayPicks >= 3
                        ? "0 0 10px rgba(255, 0, 0, 0.5)"
                        : "none",
                  }}
                />
                {matchup.awayPicks > 3 && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black drop-shadow-md overflow-hidden">
                    Hot🔥
                  </span>
                )}
              </div>
            </div>

            <div className="col-span-1 flex items-center justify-center px-1">
              <div className="h-2 w-full rounded-full bg-foreground/10 relative">
                <div
                  className={`h-full rounded-full bg-gradient-to-l ${getGradientColors(matchup.homePicks)}`}
                  style={{
                    width: getBarWidth(matchup.homePicks),
                    transition: "width 0.3s ease-in-out",
                    marginLeft: "auto",
                    boxShadow:
                      matchup.homePicks >= 3
                        ? "0 0 10px rgba(255, 0, 0, 0.5)"
                        : "none",
                  }}
                />
                {matchup.homePicks > 3 && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black drop-shadow-md overflow-hidden">
                    Hot🔥
                  </span>
                )}
              </div>
            </div>
          </>
        )}
        {matchup.status !== "STATUS_SCHEDULED" &&
          matchup.status !== "STATUS_POSTPONED" && (
            <>
              <div className="flex flex-col col-span-1">
                <div
                  className={cn(
                    "text-center col-span-1 rounded-sm mx-1",
                    matchup.status === "STATUS_FINAL" &&
                      matchup.winnerId === matchup.awayTeam.id
                      ? "bg-primary font-bold"
                      : currentlyWinning === matchup.awayTeam.id
                        ? "bg-accent/90 border-2 border-accent-foreground/30"
                        : "bg-accent/50"
                  )}
                >
                  {matchup.status !== "STATUS_SCHEDULED" &&
                  matchup.status !== "STATUS_POSTPONED" ? (
                    <span
                      className={
                        currentlyWinning === matchup.awayTeam.id
                          ? "font-bold"
                          : ""
                      }
                    >
                      {matchup.awayTeam.score}
                    </span>
                  ) : (
                    ""
                  )}
                  <div className="col-span-1 flex items-center justify-center px-1">
                    <div className="h-2 w-full rounded-full bg-foreground/10 relative">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${getGradientColors(matchup.awayPicks)}`}
                        style={{
                          width: getBarWidth(matchup.awayPicks),
                          transition: "width 0.3s ease-in-out",
                          boxShadow:
                            matchup.awayPicks >= 3
                              ? "0 0 10px rgba(255, 0, 0, 0.5)"
                              : "none",
                        }}
                      />
                      {matchup.awayPicks > 3 && (
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black drop-shadow-md overflow-hidden">
                          Hot🔥
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-foreground/50 min-h-4">
                  {Math.round(
                    (matchup.awayPicks /
                      (matchup.homePicks + matchup.awayPicks || 1)) *
                      100
                  ) > 0
                    ? `${Math.round(
                        (matchup.awayPicks /
                          (matchup.homePicks + matchup.awayPicks || 1)) *
                          100
                      )}%`
                    : ""}
                </span>
              </div>
              <div className="flex flex-col col-span-1">
                <div
                  className={cn(
                    "text-center col-span-1 rounded-sm mx-1",
                    matchup.status === "STATUS_FINAL" &&
                      matchup.winnerId === matchup.homeTeam.id
                      ? "bg-primary font-bold"
                      : currentlyWinning === matchup.homeTeam.id
                        ? "bg-accent/90 border-2 border-accent-foreground/30"
                        : "bg-accent/50"
                  )}
                >
                  {matchup.status !== "STATUS_SCHEDULED" &&
                  matchup.status !== "STATUS_POSTPONED" ? (
                    <span
                      className={
                        currentlyWinning === matchup.homeTeam.id
                          ? "font-bold"
                          : ""
                      }
                    >
                      {matchup.homeTeam.score}
                    </span>
                  ) : (
                    " "
                  )}
                  <div className="col-span-1 flex items-center justify-center px-1">
                    <div className="h-2 w-full rounded-full bg-foreground/10 relative">
                      <div
                        className={`h-full rounded-full bg-gradient-to-l ${getGradientColors(matchup.homePicks)}`}
                        style={{
                          width: getBarWidth(matchup.homePicks),
                          transition: "width 0.3s ease-in-out",
                          marginLeft: "auto",
                          boxShadow:
                            matchup.homePicks >= 3
                              ? "0 0 10px rgba(255, 0, 0, 0.5)"
                              : "none",
                        }}
                      />
                      {matchup.homePicks > 3 && (
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black drop-shadow-md overflow-hidden">
                          Hot🔥
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-foreground/50 min-h-4">
                  {Math.round(
                    (matchup.homePicks /
                      (matchup.homePicks + matchup.awayPicks || 1)) *
                      100
                  ) > 0
                    ? `${Math.round(
                        (matchup.homePicks /
                          (matchup.homePicks + matchup.awayPicks || 1)) *
                          100
                      )}%`
                    : ""}
                </span>
              </div>
            </>
          )}

        <div className="col-span-2">
          <MatchupPickButton
            name={matchup.homeTeam.name}
            image={matchup.homeTeam.image}
            id={matchup.homeTeam.id}
            disabled={
              (matchup.status !== "STATUS_SCHEDULED" &&
                matchup.status !== "STATUS_POSTPONED") ||
              !!activePick ||
              !userId
            }
            winnerId={matchup.winnerId}
            matchupId={matchup._id}
            currentlyWinning={currentlyWinning}
            activePickId={activePick?.pick.id}
          />
          <div className="flex items-center justify-center font-bold text-xl">
            {matchup.type === "SPREAD" && matchup.metadata?.spread && (
              <div className="bg-accent/90 p-1 rounded-sm justify-center gap-1 flex items-center text-sm whitespace-nowrap">
                {matchup.metadata.spread}
              </div>
            )}
            {matchup.type === "CUSTOM_SCORE" &&
              matchup.metadata?.homeCustomScoreType === "WINBYXPLUS" &&
              matchup.metadata?.homeWinBy && (
                <div className="bg-accent/90 p-1 rounded-sm justify-center gap-1 flex items-center text-sm whitespace-nowrap">
                  Win By {matchup.metadata.homeWinBy}+
                </div>
              )}
            {matchup.type === "CUSTOM_SCORE" &&
              matchup.metadata?.homeCustomScoreType === "WINDRAWLOSEBYX" &&
              matchup.metadata?.homeWinBy && (
                <div className="bg-accent/90 p-1 rounded-sm justify-center gap-1 flex items-center text-xs whitespace-nowrap">
                  Win, Draw, or Lose by {matchup.metadata.homeWinBy}
                </div>
              )}
            {matchup.type === "CUSTOM_SCORE" &&
              matchup.metadata?.homeCustomScoreType === "WIN" && (
                <div className="bg-accent/90 p-1 rounded-sm justify-center gap-1 flex items-center text-xs whitespace-nowrap">
                  Win
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="col-span-3  flex-nowrap gap-2 flex items-center justify-center">
        {matchup.status === "STATUS_SCHEDULED" &&
          activePick?.matchupId === matchup._id && (
            <div className=" bg-accent/40 p-1 rounded-sm justify-center gap-1 flex items-center text-xs ">
              <LockIcon size={12} className="text-muted-foreground" />
              <span className="text-primary text-xs font-bold whitespace-nowrap">
                {formatDistance(new Date(matchup.startTime), new Date(), {
                  includeSeconds: true,
                  addSuffix: true,
                })}
              </span>
            </div>
          )}
        <div className="flex items-center gap-2 col-span-1">
          {isHotMatchup && (
            <div className="bg-orange-500/40 p-1 rounded-sm justify-center gap-1 flex items-center text-xs whitespace-nowrap">
              🔥Hot Matchup
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const displayWinner = (matchup: Doc<"matchups">) => {
  if (matchup.winnerId === matchup.awayTeam.id) {
    return `🏆${matchup.awayTeam.name}`;
  }
  if (matchup.winnerId === matchup.homeTeam.id) {
    return `🏆${matchup.homeTeam.name}`;
  } else {
    return "Push";
  }
};

export default MatchupCardButtons;
