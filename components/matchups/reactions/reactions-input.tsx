"use client";

import { useState } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Smile } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TbMoodPlus } from "react-icons/tb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { toast } from "sonner";
import useStoreUserEffect from "@/hooks/use-store-user";

interface ReactionType {
  _id: string;
  code: string;
  name: string;
  imageUrl?: string;
  count: number;
}

interface ReactionsInputProps {
  position: "HOME" | "AWAY";
  matchupId: Id<"matchups">;
}

export default function ReactionsInput({
  position,
  matchupId,
}: ReactionsInputProps) {
  const userId = useStoreUserEffect();
  const [open, setOpen] = useState(false);

  //queries
  const reactions = useQuery(api.reactions.list, { activeOnly: true }) || [];

  const matchupReactions = useQuery(api.reactions.getMatchupReactions, {
    matchupId,
  });

  //mutations
  const addReaction = useMutation(api.reactions.addUserReaction);
  const deleteReaction = useMutation(api.reactions.removeMatchupReaction);

  //get a list of reactions for the team from matchupReactions and use that for the tooltip
  const teamReactions = matchupReactions?.filter((mr) => mr.team === position);

  // Group reactions by reactionId and count them
  const reactionCounts = teamReactions?.reduce(
    (acc, mr) => {
      acc[mr.reactionId] = (acc[mr.reactionId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Combine with reaction details and only include reactions that exist for this team
  const formattedTeamReactions = reactions
    .filter((reaction) => reactionCounts?.[reaction._id])
    .map((reaction) => ({
      _id: reaction._id,
      code: reaction.code,
      name: reaction.name,
      imageUrl: reaction.imageUrl,
      count: reactionCounts?.[reaction._id] || 0,
    }));

  async function handleReaction(reactionId: string) {
    try {
      await addReaction({
        matchupId,
        reactionId: reactionId as Id<"reactions">,
        team: position,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("User already has a reaction")
      ) {
        toast.error("You already have a reaction for this team");
      } else {
        toast.error("Failed to add reaction");
      }
    }
    setOpen(false);
  }

  async function handleDeleteReaction(reactionId: Id<"reactions">) {
    //find the matchupReaction with the same reactionId and userId
    const matchupReaction = matchupReactions?.find(
      (mr) =>
        mr.reactionId === reactionId &&
        mr.userId === userId &&
        mr.team === position
    );
    if (matchupReaction) {
      await deleteReaction({ id: matchupReaction._id });
    }
  }

  //disable if user already has a reaction for this team
  const inputDisabled = matchupReactions?.some(
    (reaction) => reaction.userId === userId && reaction.team === position
  );

  //disable delete button if user has no matching matchupReaction
  const deleteDisabled = (reactionId: Id<"reactions">) =>
    !matchupReactions?.some(
      (reaction) =>
        reaction.userId === userId &&
        reaction.team === position &&
        reaction.reactionId === reactionId
    );

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "flex items-center gap-1",
          position === "HOME" ? "flex-row" : "flex-row-reverse"
        )}
      >
        <div className="flex">
          <TooltipProvider>
            {formattedTeamReactions &&
              formattedTeamReactions.map(
                ({ code, count, name, imageUrl, _id }) =>
                  count > 0 && (
                    <Tooltip key={_id}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => handleDeleteReaction(_id)}
                          className={cn(
                            "inline-flex items-center",
                            "rounded-full text-sm",
                            "bg-background hover:bg-accent",
                            !deleteDisabled(_id) && "bg-accent/80",
                            "hover:scale-125 transition-all transform active:scale-95 relative",
                            deleteDisabled(_id) && "cursor-not-allowed"
                          )}
                          disabled={deleteDisabled(_id)}
                        >
                          <span>
                            {!imageUrl ? (
                              code
                            ) : (
                              <Image
                                src={imageUrl}
                                alt={name || ""}
                                className="w-4 h-4"
                              />
                            )}
                          </span>
                          <span className="text-xs absolute bottom-0 right-0 text-slate-100 shadow-sm">
                            {count}
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{name}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
              )}
          </TooltipProvider>
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex items-center",
                "rounded-full text-sm",
                "bg-background hover:bg-accent",
                "transition-all transform active:scale-95",
                position === "HOME" ? "ml-1" : "mr-1",
                "opacity-80 hover:opacity-100",
                inputDisabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={inputDisabled}
            >
              <TbMoodPlus className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-2">
            <div className="grid grid-cols-3 gap-1">
              {reactions &&
                reactions.map(({ code, name, _id, imageUrl }) => (
                  <button
                    key={_id}
                    type="button"
                    onClick={() => handleReaction(_id)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-2",
                      "rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800",
                      "transition-colors",
                      "hover:scale-115 transition-all transform active:scale-95"
                    )}
                  >
                    <span className="text-2xl">
                      {!imageUrl ? (
                        code
                      ) : (
                        <Image
                          src={imageUrl || ""}
                          alt={name || ""}
                          className="w-4 h-4"
                        />
                      )}
                    </span>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                      {name}
                    </span>
                  </button>
                ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
