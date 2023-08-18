import ClientTime from "../ui/client-time";
import { Matchup } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { FC } from "react";

export type PickCardVariant =
  | "WIN"
  | "LOSS"
  | "PENDING"
  | "PUSH"
  | "STATUS_SCHEDULED"
  | "STATUS_IN_PROGRESS"
  | "STATUS_FINAL"
  | "STATUS_POSTPONED"
  | "STATUS_CANCELED"
  | "STATUS_SUSPENDED"
  | "STATUS_DELAYED"
  | "STATUS_UNKNOWN";

interface PickCardHeaderProps {
  matchup: Partial<Matchup>;
  status: PickCardVariant;
  active?: boolean;
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
          "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-300 dark:from-sky-800 to-bg-secondary",
        STATUS_FINAL:
          "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-200 dark:from-gray-400 to-bg-tertiary",
        STATUS_POSTPONED:
          "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-300 dark:from-amber-600  to-bg-secondary",
        STATUS_CANCELED:
          "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-rose-300 dark:from-rose-800 to-bg-secondary",
        STATUS_SUSPENDED:
          "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-300 dark:from-amber-600  to-bg-secondary",
        STATUS_DELAYED:
          "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-300 dark:from-amber-600 to-bg-secondary",
        STATUS_UNKNOWN:
          "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-300 dark:from-amber-600 to-bg-secondary",
        LOSS: "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-rose-300 dark:from-rose-800 to-bg-secondary",
        WIN: "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-green-200 dark:from-green-400 to-bg-tertiary",
        PENDING: "",
        PUSH: "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-300 dark:from-amber-600  to-bg-secondary",
      },
      defaultVariants: {
        status: "STATUS_SCHEDULED",
      },
    },
  });
  return (
    <div className={cn(pickCardHeaderVariants({ status }))}>
      <div className="grid grid-cols-2 p-2">
        <h3 className="text-start text-sm">
          <span className="font-semibold">{matchup.league} </span> |&nbsp;
          {status === "STATUS_SCHEDULED" && (
            <ClientTime time={matchup.start_time!} />
          )}
          {status === "STATUS_IN_PROGRESS" && "In Progress"}
          {status === "STATUS_FINAL" && "Final"}
          {status === "STATUS_POSTPONED" && "Postponed"}
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
              "-mt-0.5 rounded-b-md p-1",
            )}
          >
            <h3 className="animate-pulse text-center text-xs text-primary">
              ACTIVE PICK
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchupCardHeader;
