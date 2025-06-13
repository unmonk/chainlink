import { Doc, Id } from "@/convex/_generated/dataModel";
import { Card, CardTitle } from "../ui/card";
import { toast } from "sonner";
import { MatchupWithPickCounts } from "@/convex/matchups";
import Link from "next/link";
import html2canvas from "html2canvas";
import { useRef } from "react";
import MatchupCardHeader from "./matchup-card/matchup-card-header";
import MatchupCardButtons from "./matchup-card/matchup-card-buttons";
import MatchupCardFooter from "./matchup-card/matchup-card-footer";
import { BackgroundGradient } from "../ui/background-gradient";
import { BackgroundGradientSponsored } from "../ui/background-gradient-sponsored";

const MatchupCard = ({
  matchup,
  activePick,
  userId,
}: {
  matchup: MatchupWithPickCounts;
  userId: Id<"users"> | null | undefined;
  activePick?: Doc<"picks">;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const borderClass = activePick ? "border-2 border-muted-foreground/50" : "";

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
      });

      // Convert to blob
      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement("a");
        link.download = "matchup.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }, "image/png");

      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image");
    }
  };

  if (matchup.featured) {
    return (
      <BackgroundGradientSponsored
        key={matchup._id}
        animate={true}
        className={`rounded-lg overflow-hidden shadow-lg h-full w-full`}
        color={
          matchup.featuredType === "CHAINBUILDER"
            ? "green"
            : matchup.metadata?.sponsored?.color || "white"
        }
      >
        <Card
          className="rounded-t-none flex flex-col h-full w-full"
          ref={cardRef}
        >
          <MatchupCardHeader matchup={matchup as Doc<"matchups">} />
          <CardTitle className="text-lg px-1 font-bold flex-1 flex items-start pt-2 min-h-12">
            <Link href={`/matchups/${matchup._id}`} prefetch={false}>
              {matchup.title}
            </Link>
          </CardTitle>
          <MatchupCardButtons
            activePick={activePick}
            matchup={matchup}
            userId={userId}
          />
          <div className="mt-auto">
            <MatchupCardFooter
              matchup={matchup}
              handleShare={handleShare}
              pick={activePick}
            />
          </div>
        </Card>
      </BackgroundGradientSponsored>
    );
  }

  return (
    <Card
      className={`rounded-t-none flex flex-col h-full w-full ${borderClass}`}
      ref={cardRef}
    >
      <MatchupCardHeader matchup={matchup as Doc<"matchups">} />
      <CardTitle className="text-lg px-1 font-bold flex-1 flex items-start pt-2 min-h-12">
        <Link href={`/matchups/${matchup._id}`}>{matchup.title}</Link>
      </CardTitle>
      <MatchupCardButtons
        activePick={activePick}
        matchup={matchup}
        userId={userId}
      />
      <div className="mt-auto">
        <MatchupCardFooter
          matchup={matchup}
          handleShare={handleShare}
          pick={activePick}
        />
      </div>
    </Card>
  );
};

export default MatchupCard;
