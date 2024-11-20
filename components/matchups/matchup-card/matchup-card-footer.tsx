import { Doc } from "@/convex/_generated/dataModel";
import { matchupReward } from "@/convex/utils";
import { cn } from "@/lib/utils";
import { LinkIcon, DownloadIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { displayWinner } from "./matchup-card-buttons";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PiShootingStarLight } from "react-icons/pi";

import CancelButton from "./cancel-button";

export default function MatchupCardFooter({
  matchup,
  handleShare,
  pick,
}: {
  matchup: Doc<"matchups">;
  handleShare: () => void;
  pick?: Doc<"picks">;
}) {
  const cancelPick = useMutation(api.picks.cancelPick);
  const handleCancelPick = async () => {
    if (!pick) return;
    try {
      await cancelPick({ pickId: pick?._id });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 items-center text-center p-2 min-h-12 mt-auto bg-background/20 border-t border-border">
        <div className="text-sm">
          {matchup.featured && matchup.featuredType === "CHAINBUILDER" && (
            <div className="flex flex-col">
              <span className="text-primary">🖇️Chain Builder</span>
            </div>
          )}
          {matchup.featured && matchup.featuredType === "SPONSORED" && (
            <span
              className={cn(
                `text-${matchup.metadata?.sponsored?.color || "white"}-500`,
                "flex flex-row items-center justify-center"
              )}
            >
              <PiShootingStarLight className="w-3 h-3 mr-1" />
              Sponsored
            </span>
          )}
          <button
            onClick={handleShare}
            className="text-xs cursor-pointer flex flex-row items-center justify-center hover:bg-accent/50 rounded-sm px-1 w-full"
          >
            <DownloadIcon className="w-3 h-3 mr-1" />
            <span>Share Matchup</span>
          </button>
        </div>
        <div className="flex flex-col items-center justify-center">
          {(matchup.status === "STATUS_SCHEDULED" ||
            matchup.status === "STATUS_POSTPONED") && (
            <p className="text-light text-xs text-nowrap">
              Wager: 🔗
              <span className="text-cyan-500">{matchup.cost}</span>
            </p>
          )}
          <p className="text-light text-xs text-nowrap">
            Reward: 🔗
            <span className="text-cyan-500">
              {matchupReward(matchup.cost, matchup.featured)}
            </span>
          </p>
        </div>
        <div
          className={cn(
            matchup.status === "STATUS_SCHEDULED" ||
              matchup.status === "STATUS_POSTPONED"
              ? "font-extralight text-light text-sm"
              : matchup.status === "STATUS_FINAL" ||
                  matchup.status === "STATUS_FULL_TIME" ||
                  matchup.status === "STATUS_FULL_PEN"
                ? "font-bold font-sans"
                : "text-red-500 animate-pulse"
          )}
        >
          {pick &&
            pick.status === "PENDING" &&
            (matchup.status === "STATUS_SCHEDULED" ||
              matchup.status === "STATUS_POSTPONED") && (
              <div className="flex flex-row w-full justify-center items-center">
                <CancelButton onConfirm={handleCancelPick} />
              </div>
            )}
          {matchup.status === "STATUS_SCHEDULED" ||
          matchup.status === "STATUS_POSTPONED"
            ? ""
            : matchup.status === "STATUS_FINAL" ||
                matchup.status === "STATUS_FULL_TIME" ||
                matchup.status === "STATUS_FULL_PEN"
              ? displayWinner(matchup)
              : "Locked"}
        </div>
      </div>
      {matchup.featured &&
        matchup.featuredType === "SPONSORED" &&
        matchup.metadata.sponsored && (
          <Link href={`/api/clickthru/${matchup.metadata.sponsored._id}`}>
            <div className="flex flex-row justify-center items-center text-center p-2 min-h-12 mt-auto bg-background/20 border-t border-border text-sm">
              <span className="flex flex-row justify-center items-center gap-1">
                {matchup.metadata.sponsored.description}
              </span>
              <Image
                src={matchup.metadata.sponsored.image}
                alt={matchup.metadata.sponsored.name}
                width={24}
                height={24}
                className="ml-1 items-center justify-center self-center"
              />
            </div>
          </Link>
        )}
    </>
  );
}
