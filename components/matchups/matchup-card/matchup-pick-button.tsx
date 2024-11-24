import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { LinkIcon } from "lucide-react";

const MatchupPickButton = ({
  name,
  image,
  id,
  disabled,
  matchupId,
  winnerId,
  currentlyWinning,
  activePickId,
}: {
  name: string;
  image: string;
  id: string;
  disabled: boolean;
  matchupId: Id<"matchups">;
  winnerId?: string;
  currentlyWinning?: string | null;
  activePickId?: string | null;
}) => {
  const makePick = useMutation(api.picks.makePick);

  const handleClick = async () => {
    if (disabled) return;
    try {
      await makePick({
        matchupId,
        pick: {
          id,
          name,
          image,
        },
      });
      //top of page
      window.scrollTo(0, 0);
    } catch (e: any) {
      const errorMessage =
        // Check whether the error is an application error
        e instanceof ConvexError
          ? // Access data and cast it to the type we expect
            (e.data as string)
          : // Must be some developer error,
            // and prod deployments will not
            // reveal any more information about it
            // to the client
            "Unexpected error occurred";

      if (errorMessage === "USER_NOT_FOUND") {
        toast.error("Please sign in to make a pick");
      }
      if (errorMessage === "EXISTING_PICK_FOUND") {
        toast.error("You already have an active pick");
      }
      if (errorMessage === "INSUFFICIENT_FUNDS") {
        toast.error("You do not have enough Links to make this pick");
      }
      if (errorMessage === "MATCHUP_LOCKED") {
        toast.error("This matchup is locked");
      } else {
        console.log(errorMessage);
      }
    }
  };

  return (
    <Button
      variant={"outline"}
      className={cn(
        "relative aspect-square h-24 w-24 sm:h-28 sm:w-28 md:h-24 md:w-24 lg:h-28 lg:w-28 p-1 overflow-hidden",
        winnerId === id && "border-primary border",
        currentlyWinning === id && "border-accent-foreground/50 border-4",
        activePickId && activePickId === id && "border-primary border-2"
      )}
      disabled={disabled}
      onClick={handleClick}
    >
      <Image
        src={image}
        alt={name}
        className="hover:scale-110 transition-transform duration-300 ease-in-out object-contain"
        sizes="100%"
        width={100}
        height={100}
        priority={true}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
      {activePickId && activePickId === id && (
        <Badge className="absolute right-1 top-1 z-10">
          <LinkIcon size={12} />
        </Badge>
      )}
    </Button>
  );
};

export default MatchupPickButton;
