import ClientTime from "../ui/client-time"
import { Matchup, PickCardVariant } from "@/drizzle/schema"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import { FC } from "react"

interface PickCardHeaderProps {
  matchup: Partial<Matchup>
  status: PickCardVariant
  active?: boolean
}

const MatchupCardHeader: FC<PickCardHeaderProps> = ({
  matchup,
  status,
  active,
}) => {
  const pickCardHeaderVariants = cva(`border-b border-gray-600`, {
    variants: {
      status: {
        STATUS_SCHEDULED: "bg-secondary",
        STATUS_IN_PROGRESS:
          "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-300 dark:from-sky-800",
        STATUS_FIRST_HALF:
          "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-300 dark:from-sky-800",
        STATUS_SECOND_HALF:
          "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-300 dark:from-sky-800",
        STATUS_FINAL:
          "to-bg-tertiary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-200 dark:from-gray-400",
        STATUS_FULL_TIME:
          "to-bg-tertiary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-200 dark:from-gray-400",
        STATUS_POSTPONED:
          "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-300  dark:from-amber-600",
        STATUS_END_PERIOD:
          "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-300 dark:from-sky-800",
        STATUS_HALFTIME:
          "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-300 dark:from-sky-800",
        STATUS_CANCELED:
          "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-rose-300 dark:from-rose-800",
        STATUS_SUSPENDED:
          "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-300  dark:from-amber-600",
        STATUS_DELAYED:
          "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-300 dark:from-amber-600",
        STATUS_UNKNOWN:
          "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-300 dark:from-amber-600",
        LOSS: "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-rose-300 dark:from-rose-800",
        WIN: "to-bg-tertiary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-green-200 dark:from-green-400",
        PENDING: "",
        PUSH: "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-300  dark:from-amber-600",
      },
      defaultVariants: {
        status: "STATUS_SCHEDULED",
      },
    },
  })
  return (
    <div className={cn(pickCardHeaderVariants({ status }))}>
      <div className="grid grid-cols-2 p-2">
        <h3 className="text-start text-sm">
          <span className="font-semibold">
            {matchup.league === "COLLEGE-FOOTBALL" ? "CFB" : matchup.league}
          </span>
          &nbsp;|&nbsp;
          {status === "STATUS_SCHEDULED" && (
            <ClientTime time={matchup.start_time!} />
          )}
          {status === "STATUS_IN_PROGRESS" && "In Progress"}
          {status === "STATUS_FIRST_HALF" && "First Half"}
          {status === "STATUS_SECOND_HALF" && "Second Half"}
          {status === "STATUS_FULL_TIME" && "Full Time"}
          {status === "STATUS_FINAL" && "Final"}
          {status === "STATUS_POSTPONED" && "Postponed"}
          {status === "STATUS_END_PERIOD" && "Period Ended"}
          {status === "STATUS_HALFTIME" && "Halftime"}
          {status === "STATUS_CANCELED" && "Canceled"}
          {status === "STATUS_SUSPENDED" && "Suspended"}
          {status === "STATUS_DELAYED" && "Delayed"}
          {status === "STATUS_UNKNOWN" && "Unknown"}
          {status === "LOSS" && "Final | Loss"}
          {status === "WIN" && "Final | Win"}
          {status === "PENDING" && "Pending"}
          {status === "PUSH" && "Push"}
        </h3>

        <h3 className="text-end text-sm">{matchup.network}</h3>
      </div>
      <div className="m-0 flex h-0 flex-row items-center justify-center text-center">
        {active && (
          <div
            className={cn(
              pickCardHeaderVariants({ status }),
              "-mt-0.5 rounded-b-md p-1"
            )}
          >
            <h3 className="animate-pulse text-center text-xs text-primary">
              ACTIVE PICK
            </h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchupCardHeader
