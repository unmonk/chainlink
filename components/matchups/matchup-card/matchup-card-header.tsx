import { Doc } from "@/convex/_generated/dataModel";
import {
  MATCHUP_DELAYED_STATUSES,
  MATCHUP_FINAL_STATUSES,
  MATCHUP_IN_PROGRESS_STATUSES,
} from "@/convex/utils";
import { getSportFromLeague } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { getSportIcon } from "@/components/matchups/matchup-list";

const MatchupCardHeader = ({ matchup }: { matchup: Doc<"matchups"> }) => {
  const headerColor = (status: string) => {
    if (MATCHUP_IN_PROGRESS_STATUSES.includes(status)) {
      return "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-300 dark:from-sky-800";
    }
    if (MATCHUP_FINAL_STATUSES.includes(status)) {
      return "to-bg-tertiary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-200 dark:from-gray-400";
    }
    if (status === "STATUS_SCHEDULED") {
      return "bg-secondary";
    }
    if (MATCHUP_DELAYED_STATUSES.includes(status)) {
      return "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-300  dark:from-amber-600";
    }
    return "bg-secondary";
  };

  const getNetwork = (metadata: any) => {
    if (metadata?.network && metadata.network !== "N/A") {
      return ` - ${metadata.network}`;
    }
    return "";
  };

  const getLeagueText = (league: string) => {
    if (league === "COLLEGE-FOOTBALL") {
      return "CFB";
    }
    if (league === "MBB") {
      return "Mens BB";
    }
    if (league === "WBB") {
      return "Womens BB";
    }
    return league;
  };

  const sport = getSportFromLeague(matchup.league);
  const icon = getSportIcon(sport);

  return (
    <div className={headerColor(matchup.status)}>
      <div className="grid grid-cols-2 p-1.5">
        <div className="text-start flex flex-row items-center gap-1">
          <div className="text-sm font-semibold flex flex-row items-center gap-1">
            {icon && <>{icon}</>}
            {getLeagueText(matchup.league)}
          </div>
          <div className="text-xs font-extralight">
            {getNetwork(matchup.metadata)}
          </div>
        </div>
        <div className="text-right text-xs font-semibold text-nowrap overflow-hidden">
          {matchup.status === "STATUS_SCHEDULED" ||
          matchup.status === "STATUS_POSTPONED" ? (
            <p className="text-xs text-gray-800 dark:text-gray-300  font-light">
              Locks:{" "}
              {new Date(matchup.startTime).getTime() - Date.now() <
              1 * 60 * 60 * 1000
                ? formatDistanceToNow(new Date(matchup.startTime), {
                    addSuffix: true,
                  })
                : new Date(matchup.startTime).setHours(0, 0, 0, 0) ===
                    new Date().setHours(0, 0, 0, 0)
                  ? new Date(matchup.startTime).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                    })
                  : new Date(matchup.startTime).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      day: "numeric",
                      month: "short",
                    })}
            </p>
          ) : (
            <div className="">
              {matchup.metadata?.statusDetails ? (
                <>
                  <p className="text-xs text-gray-800 dark:text-gray-300  font-light">
                    last update:
                  </p>
                  <span className="text-foreground">
                    {matchup.metadata?.statusDetails}
                  </span>
                </>
              ) : (
                matchup.status
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchupCardHeader;
