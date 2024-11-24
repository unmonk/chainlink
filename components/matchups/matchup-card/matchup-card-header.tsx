import { Doc } from "@/convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";

const MatchupCardHeader = ({ matchup }: { matchup: Doc<"matchups"> }) => {
  const headerColor = (status: string) => {
    switch (status) {
      case "STATUS_SCHEDULED":
        return "bg-secondary";
      case "STATUS_IN_PROGRESS":
      case "STATUS_HALFTIME":
      case "STATUS_FIRST_HALF":
      case "STATUS_SECOND_HALF":
      case "STATUS_END_PERIOD":
      case "STATUS_SHOOTOUT":
        return "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-300 dark:from-sky-800";
      case "STATUS_FINAL":
      case "STATUS_FULL_TIME":
      case "STATUS_FULL_PEN":
        return "to-bg-tertiary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-200 dark:from-gray-400";
      case "STATUS_POSTPONED":
      case "STATUS_CANCELED":
      case "STATUS_SUSPENDED":
      case "STATUS_DELAYED":
      case "STATUS_RAIN_DELAY":
      case "STATUS_DELAY":
        return "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-300  dark:from-amber-600";
      default:
        return "bg-secondary";
    }
  };

  const getNetwork = (metadata: any) => {
    if (metadata?.network && metadata.network !== "N/A") {
      return ` - ${metadata.network}`;
    }
    return "";
  };
  return (
    <div className={headerColor(matchup.status)}>
      <div className="grid grid-cols-2 p-1.5">
        <div className="text-start flex flex-row items-center gap-1">
          <div className="text-sm font-semibold">
            {matchup.league === "COLLEGE-FOOTBALL" ? "CFB" : matchup.league}
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
