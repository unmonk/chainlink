import { FC } from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import ClientTime from "../ui/client-time";
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
  league: string;
  startTime: string;
  network: string;
  status: PickCardVariant;
  active?: boolean;
}

const MatchupCardHeader: FC<PickCardHeaderProps> = ({
  league,
  startTime,
  network,
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
    <div className="flex flex-col">
      <div className={cn(pickCardHeaderVariants({ status }))}>
        <div className="grid grid-cols-2 p-2">
          <h3 className="text-sm text-start">
            <span className="font-semibold">{league} </span> |&nbsp;
            {status === "STATUS_SCHEDULED" && <ClientTime time={startTime} />}
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

          <h3 className="text-sm text-end">{network}</h3>
        </div>
        <div className="flex flex-row justify-center m-0 text-center items-center h-0">
          {active && (
            <div
              className={cn(
                pickCardHeaderVariants({ status }),
                "rounded-b-md p-1 -mt-0.5"
              )}
            >
              <h3 className="text-xs text-center animate-pulse text-primary">
                ACTIVE PICK
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchupCardHeader;
