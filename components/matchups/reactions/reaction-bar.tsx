import React from "react";
import ReactionsInput from "./reactions-input";
import { Doc, Id } from "@/convex/_generated/dataModel";

export default function ReactionBar({
  matchupId,
  userId,
  matchupReactions,
  children,
}: {
  matchupId: Id<"matchups">;
  userId: Id<"users">;
  matchupReactions: Doc<"matchupReactions">[];
  children?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 items-center text-center px-2 -mt-1 w-full mb-1 min-h-6">
      <div className="col-span-1 justify-self-start">
        <ReactionsInput
          position="AWAY"
          matchupId={matchupId}
          userId={userId}
          matchupReactions={matchupReactions}
        />
      </div>
      <div className="col-span-1">{children}</div>
      <div className="col-span-1 justify-self-end">
        <ReactionsInput
          position="HOME"
          matchupId={matchupId}
          userId={userId}
          matchupReactions={matchupReactions}
        />
      </div>
    </div>
  );
}
