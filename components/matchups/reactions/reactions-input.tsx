"use client";

import { useState, useMemo, useCallback } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Loader2, Smile } from "lucide-react";
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
import { Doc, Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { toast } from "sonner";

interface ReactionsInputProps {
  position: "HOME" | "AWAY";
  matchupId: Id<"matchups">;
  userId: Id<"users">;
  matchupReactions: Doc<"matchupReactions">[];
}

export default function ReactionsInput({
  position,
  matchupId,
  userId,
  matchupReactions,
}: ReactionsInputProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //queries
  const reactions = useQuery(api.reactions.list, { activeOnly: true });

  //mutations
  const addReaction = useMutation(api.reactions.addUserReaction);
  const deleteReaction = useMutation(api.reactions.removeMatchupReaction);

  //get a list of reactions for the team from matchupReactions and use that for the tooltip
  const teamReactions = useMemo(
    () => matchupReactions?.filter((mr) => mr.team === position),
    [matchupReactions, position]
  );

  // Group reactions by reactionId and count them
  const reactionCounts = useMemo(
    () =>
      teamReactions?.reduce(
        (acc, mr) => {
          acc[mr.reactionId] = (acc[mr.reactionId] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    [teamReactions]
  );

  // Memoize the formatted reactions
  const formattedTeamReactions = useMemo(
    () =>
      (reactions || [])
        .filter((reaction) => reactionCounts?.[reaction._id])
        .map((reaction) => ({
          _id: reaction._id,
          code: reaction.code,
          name: reaction.name,
          imageUrl: reaction.imageUrl,
          count: reactionCounts?.[reaction._id] || 0,
        })),
    [reactions, reactionCounts]
  );

  const handleReaction = useCallback(
    async (reactionId: string) => {
      setIsSubmitting(true);
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
      } finally {
        setIsSubmitting(false);
        setOpen(false);
      }
    },
    [addReaction, matchupId, position]
  );

  const handleDeleteReaction = useCallback(
    async (reactionId: Id<"reactions">) => {
      setIsSubmitting(true);
      try {
        const matchupReaction = matchupReactions?.find(
          (mr) =>
            mr.reactionId === reactionId &&
            mr.userId === userId &&
            mr.team === position
        );
        if (matchupReaction) {
          await deleteReaction({ id: matchupReaction._id });
        }
      } catch (error) {
        toast.error("Failed to delete reaction");
      } finally {
        setIsSubmitting(false);
      }
    },
    [matchupReactions, userId, position, deleteReaction]
  );

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
                          disabled={deleteDisabled(_id) || isSubmitting}
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
              disabled={inputDisabled || isSubmitting}
            >
              {!isSubmitting && <TbMoodPlus className="w-4 h-4" />}
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
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
                      "hover:scale-115 transition-all transform active:scale-95",
                      inputDisabled && "cursor-not-allowed"
                    )}
                    disabled={inputDisabled || isSubmitting}
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
