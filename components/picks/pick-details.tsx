import { PickWithMatchup } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FC } from "react";

interface PickDetailsProps {
  pick: PickWithMatchup;
}

const PickDetails: FC<PickDetailsProps> = ({ pick }) => {
  return (
    <div className="flex flex-col items-center gap-2 p-2">
      <p className="text-lg">{pick.matchup.question}</p>
      <div className="grid grid-cols-2 gap-2">
        <div
          className={cn("flex flex-col items-center gap-2 p-2 rounded-md", {
            "border border-green-500":
              pick.pick_type === "AWAY" && pick.pick_status === "WIN",
            "border border-red-500":
              pick.pick_type === "AWAY" && pick.pick_status === "LOSS",
            "border border-yellow-400":
              pick.pick_type === "AWAY" && pick.pick_status === "PUSH",
            border: pick.pick_type === "AWAY",
          })}
        >
          <p className="h-8 text-sm text-center">{pick.matchup.away_team}</p>
          <Image
            src={pick.matchup.away_image!}
            width={40}
            height={40}
            alt={pick.matchup.away_team}
          />
          <p>{pick.matchup.away_value}</p>
        </div>
        <div
          className={cn("flex flex-col items-center gap-2 p-2 rounded-md", {
            "border border-green-500":
              pick.pick_type === "HOME" && pick.pick_status === "WIN",
            "border border-red-500":
              pick.pick_type === "HOME" && pick.pick_status === "LOSS",
            "border border-yellow-400":
              pick.pick_type === "HOME" && pick.pick_status === "PUSH",
            border: pick.pick_type === "HOME",
          })}
        >
          <p className="h-8 text-sm text-center">{pick.matchup.home_team}</p>
          <Image
            src={pick.matchup.home_image!}
            width={40}
            height={40}
            alt={pick.matchup.home_team}
          />
          <p>{pick.matchup.home_value}</p>
        </div>
      </div>
      <p className="text-sm">League: {pick.matchup.league}</p>
      <p
        className={
          pick.pick_status === "WIN"
            ? "text-green-500"
            : pick.pick_status === "LOSS"
            ? "text-red-500"
            : pick.pick_status === "STATUS_IN_PROGRESS"
            ? "text-yellow-500"
            : "text-sm"
        }
      >
        {pick.pick_status === "STATUS_IN_PROGRESS"
          ? "In Progress..."
          : pick.pick_status}
      </p>
    </div>
  );
};

export default PickDetails;
