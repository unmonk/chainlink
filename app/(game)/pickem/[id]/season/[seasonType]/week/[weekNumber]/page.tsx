// app/(game)/pickem/[id]/season/[seasonType]/week/[weekNumber]/page.tsx

"use client";
import { useParams } from "next/navigation";
import { ContentLayout } from "@/components/nav/content-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DownloadIcon, X, Save, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { getSportFromLeague } from "@/lib/utils";
import { getSportIcon } from "@/components/matchups/matchup-list";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { LinkIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DrawerTrigger,
  DrawerContent,
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import React from "react";

// Pickem Cancel Button Component
const PickemCancelButton = ({ onConfirm }: { onConfirm: () => void }) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"destructive"}
            size="sm"
            onClick={() => setOpen(true)}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel Pick
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Pick</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your pick? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Keep Pick
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Cancel Pick
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant={"destructive"} size="sm" onClick={() => setOpen(true)}>
          <X className="h-4 w-4 mr-1" />
          Cancel Pick
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Cancel Pick</DrawerTitle>
          <DrawerDescription>
            Are you sure you want to cancel your pick? This action cannot be
            undone.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Keep Pick
            </Button>
          </DrawerClose>
          <Button variant="destructive" onClick={onConfirm}>
            Cancel Pick
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

// Pickem Matchup Card Header Component
const PickemMatchupCardHeader = ({ matchup }: { matchup: any }) => {
  const headerColor = (status: string) => {
    if (status === "ACTIVE") {
      return "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-300 dark:from-sky-800";
    }
    if (status === "COMPLETE") {
      return "to-bg-tertiary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-200 dark:from-gray-400";
    }
    if (status === "PENDING") {
      return "bg-secondary";
    }
    if (status === "LOCKED") {
      return "to-bg-secondary bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-300 dark:from-amber-600";
    }
    return "bg-secondary";
  };

  const getNetwork = (metadata: any) => {
    if (metadata?.network && metadata.network !== "N/A") {
      return ` - ${metadata.network}`;
    }
    return "";
  };

  const getLeagueText = (league: string) => {
    if (league === "COLLEGE-FOOTBALL") {
      return "CFB";
    }
    if (league === "MBB") {
      return "Mens BB";
    }
    if (league === "WBB") {
      return "Womens BB";
    }
    return league;
  };

  const sport = getSportFromLeague(matchup.league);
  const icon = getSportIcon(sport);

  return (
    <div className={headerColor(matchup.status)}>
      <div className="grid grid-cols-2 p-1.5">
        <div className="text-start flex flex-row items-center gap-1">
          <div className="text-sm font-semibold flex flex-row items-center gap-1">
            {icon && <>{icon}</>}
            {getLeagueText(matchup.league)}
          </div>
          <div className="text-xs font-extralight">
            {getNetwork(matchup.metadata)}
          </div>
        </div>
        <div className="text-right text-xs font-semibold text-nowrap overflow-hidden">
          {matchup.status === "PENDING" ? (
            <p className="text-xs text-gray-800 dark:text-gray-300 font-light">
              Locks:{" "}
              {new Date(matchup.startTime).getTime() - Date.now() <
              1 * 60 * 60 * 1000
                ? formatDistanceToNow(new Date(matchup.startTime), {
                    addSuffix: true,
                  })
                : new Date(matchup.startTime).setHours(0, 0, 0, 0) ===
                    new Date().setHours(0, 0, 0, 0)
                  ? new Date(matchup.startTime).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                    })
                  : new Date(matchup.startTime).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      day: "numeric",
                      month: "short",
                    })}
            </p>
          ) : (
            <div className="">
              {matchup.metadata?.statusDetails ? (
                <>
                  <p className="text-xs text-gray-800 dark:text-gray-300 font-light">
                    last update:
                  </p>
                  <span className="text-foreground">
                    {matchup.metadata?.statusDetails}
                  </span>
                </>
              ) : (
                matchup.status
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Pickem Pick Button Component
const PickemPickButton = ({
  name,
  image,
  id,
  disabled,
  matchupId,
  winnerId,
  activePickId,
  selectedPickId,
  onPick,
}: {
  name: string;
  image: string;
  id: string;
  disabled: boolean;
  matchupId: Id<"pickemMatchups">;
  winnerId?: string;
  activePickId?: string | null;
  selectedPickId?: string | null;
  onPick: (teamId: string, teamName: string, teamImage: string) => void;
}) => {
  const handleClick = () => {
    if (disabled) return;
    onPick(id, name, image);
  };

  return (
    <Button
      variant={"outline"}
      className={cn(
        "relative aspect-square h-24 w-24 sm:h-28 sm:w-28 md:h-24 md:w-24 lg:h-28 lg:w-28 p-1 overflow-hidden",
        winnerId === id && "border-primary border",
        (activePickId && activePickId === id) ||
          (selectedPickId && selectedPickId === id)
          ? "border-primary border-2"
          : ""
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
      {(activePickId && activePickId === id) ||
      (selectedPickId && selectedPickId === id) ? (
        <Badge className="absolute right-1 top-1 z-10">
          <LinkIcon size={12} />
        </Badge>
      ) : null}
    </Button>
  );
};

// Pickem Matchup Card Buttons Component
const PickemMatchupCardButtons = ({
  matchup,
  activePick,
  selectedPick,
  onPick,
}: {
  matchup: any;
  activePick?: any;
  selectedPick?: any;
  onPick: (teamId: string, teamName: string, teamImage: string) => void;
}) => {
  const currentlyWinning =
    matchup.awayTeam.score === matchup.homeTeam.score
      ? null
      : matchup.awayTeam.score > matchup.homeTeam.score
        ? matchup.awayTeam.id
        : matchup.homeTeam.id;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-3 items-center text-center">
        <span className="text-balance text-sm font-semibold">
          {matchup.awayTeam.name}
        </span>
        <span className="text-primary text-sm"></span>
        <span className="text-balance text-sm font-semibold">
          <span className="text-primary text-xs font-extralight">@</span>
          {matchup.homeTeam.name}
        </span>
      </div>
      <div className="grid grid-cols-6 items-center text-center py-1 px-2 gap-x-1 w-full overflow-hidden">
        <div className="col-span-2 flex flex-col items-center">
          <PickemPickButton
            name={matchup.awayTeam.name}
            image={matchup.awayTeam.image}
            id={matchup.awayTeam.id}
            disabled={matchup.status !== "PENDING"}
            winnerId={matchup.winnerId}
            matchupId={matchup._id}
            activePickId={activePick?.pick.teamId}
            selectedPickId={selectedPick?.teamId}
            onPick={onPick}
          />
          <div className="flex items-center justify-center font-bold text-xl mt-1">
            {matchup.type === "SPREAD" && matchup.metadata?.spread && (
              <div className="bg-accent/90 p-1 rounded-sm justify-center gap-1 flex items-center text-sm whitespace-nowrap">
                {-matchup.metadata.spread}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-2 flex items-center justify-center">
          <div className="text-center">
            {matchup.status !== "PENDING" && (
              <div className="text-2xl font-bold">
                {matchup.awayTeam.score} - {matchup.homeTeam.score}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-2 flex flex-col items-center">
          <PickemPickButton
            name={matchup.homeTeam.name}
            image={matchup.homeTeam.image}
            id={matchup.homeTeam.id}
            disabled={matchup.status !== "PENDING"}
            winnerId={matchup.winnerId}
            matchupId={matchup._id}
            activePickId={activePick?.pick.teamId}
            selectedPickId={selectedPick?.teamId}
            onPick={onPick}
          />
          <div className="flex items-center justify-center font-bold text-xl mt-1">
            {matchup.type === "SPREAD" && matchup.metadata?.spread && (
              <div className="bg-accent/90 p-1 rounded-sm justify-center gap-1 flex items-center text-sm whitespace-nowrap">
                {matchup.metadata.spread}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Pickem Matchup Card Footer Component
const PickemMatchupCardFooter = ({
  matchup,
  pick,
  selectedPick,
  onCancelPick,
}: {
  matchup: any;
  pick?: any;
  selectedPick?: any;
  onCancelPick?: () => void;
}) => {
  return (
    <div className="grid grid-cols-3 items-center text-center p-2 min-h-12 mt-auto bg-background/20 border-t border-border">
      <div className="text-sm">
        {onCancelPick && <PickemCancelButton onConfirm={onCancelPick} />}
      </div>
      <div className="flex flex-col items-center justify-center"></div>
      <div className="text-sm">
        {matchup.status === "PENDING" && (pick || selectedPick) ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-muted-foreground text-xs">
              {pick ? "Pending" : "Selected"}
            </span>
          </div>
        ) : matchup.status === "PENDING" ? (
          <span className="text-muted-foreground">Open for Picks</span>
        ) : matchup.status === "COMPLETE" ? (
          <span className="font-bold">
            {matchup.winnerId === "PUSH"
              ? "Tie"
              : `Winner: ${matchup.winnerId === matchup.homeTeam.id ? matchup.homeTeam.name : matchup.awayTeam.name}`}
          </span>
        ) : (
          <span className="text-red-500">Locked</span>
        )}
      </div>
    </div>
  );
};

// Main Pickem Matchup Card Component
const PickemMatchupCard = ({
  matchup,
  activePick,
  selectedPick,
  onPick,
  onCancelPick,
}: {
  matchup: any;
  activePick?: any;
  selectedPick?: any;
  onPick: (teamId: string, teamName: string, teamImage: string) => void;
  onCancelPick?: () => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const borderClass =
    activePick || selectedPick ? "border-2 border-muted-foreground/50" : "";

  return (
    <Card
      className={`rounded-t-none flex flex-col h-full w-full ${borderClass}`}
      ref={cardRef}
    >
      <PickemMatchupCardHeader matchup={matchup} />
      <CardTitle className="text-lg px-1 font-bold flex-1 flex items-start pt-2 min-h-12">
        <Link href={`/pickem/${matchup.campaignId}/matchup/${matchup._id}`}>
          {matchup.title}
        </Link>
      </CardTitle>
      <PickemMatchupCardButtons
        activePick={activePick}
        selectedPick={selectedPick}
        matchup={matchup}
        onPick={onPick}
      />
      <div className="mt-auto">
        <PickemMatchupCardFooter
          matchup={matchup}
          pick={activePick}
          selectedPick={selectedPick}
          onCancelPick={onCancelPick}
        />
      </div>
    </Card>
  );
};

export default function PickemWeekPage() {
  const { id, seasonType, weekNumber } = useParams();

  // State for managing selected picks before saving
  const [selectedPicks, setSelectedPicks] = useState<
    Record<
      string,
      {
        teamId: string;
        teamName: string;
        teamImage: string;
      }
    >
  >({});

  // Fetch week data
  const week = useQuery(api.pickem.getPickemWeekByCampaignSeasonAndNumber, {
    campaignId: id as Id<"pickemCampaigns">,
    seasonType: (seasonType as string).toUpperCase() as
      | "PRESEASON"
      | "REGULAR_SEASON"
      | "POSTSEASON",
    weekNumber: Number(weekNumber),
  });

  // Fetch user's picks for this week
  const userPicks = useQuery(api.pickem.getUserPickemPicksForWeek, {
    campaignId: id as Id<"pickemCampaigns">,
    seasonType: (seasonType as string).toUpperCase() as
      | "PRESEASON"
      | "REGULAR_SEASON"
      | "POSTSEASON",
    weekNumber: Number(weekNumber),
  });

  const submitPickemPicks = useMutation(api.pickem.submitPickemPicks);
  const cancelPickemPick = useMutation(api.pickem.cancelPickemPick);

  // Helper: check if user has picked for a matchup
  const userPickForMatchup = useCallback(
    (matchupId: string) => {
      if (!userPicks) return undefined;
      return userPicks.find((pick) => pick.matchupId === matchupId);
    },
    [userPicks]
  );

  // Helper: check if user has selected a pick for a matchup (not yet saved)
  const selectedPickForMatchup = useCallback(
    (matchupId: string) => {
      return selectedPicks[matchupId];
    },
    [selectedPicks]
  );

  // Handler: select a team (local state, not saved yet)
  const handlePick = useCallback(
    (teamId: string, teamName: string, teamImage: string) => {
      if (!week?.matchups) return;

      // Find the matchup that was picked
      const matchup = week.matchups.find(
        (m: any) => m.homeTeam.id === teamId || m.awayTeam.id === teamId
      );

      if (!matchup) return;

      // If user already has a saved pick for this matchup, don't allow selection
      const existingPick = userPickForMatchup(matchup._id);
      if (existingPick) return;

      // Update selected picks
      setSelectedPicks((prev) => ({
        ...prev,
        [matchup._id]: {
          teamId,
          teamName,
          teamImage,
        },
      }));
    },
    [week, userPickForMatchup]
  );

  // Handler: save all selected picks
  const handleSavePicks = useCallback(async () => {
    if (Object.keys(selectedPicks).length === 0 || !week) return;

    try {
      const picksArray = Object.entries(selectedPicks).map(
        ([matchupId, pick]) => ({
          matchupId: matchupId as Id<"pickemMatchups">,
          teamId: pick.teamId,
          teamName: pick.teamName,
          teamImage: pick.teamImage,
        })
      );

      await submitPickemPicks({
        campaignId: id as Id<"pickemCampaigns">,
        week: week.weekNumber,
        picks: picksArray,
      });

      // Clear selected picks after successful save
      setSelectedPicks({});
      toast.success("Picks saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save picks");
    }
  }, [selectedPicks, week, submitPickemPicks, id]);

  // Handler: cancel a pick
  const handleCancelPick = useCallback(
    async (matchupId: string) => {
      if (!userPicks) return;

      const pick = userPicks.find((p) => p.matchupId === matchupId);
      if (!pick) return;

      try {
        await cancelPickemPick({ pickId: pick._id });
        toast.success("Pick cancelled successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to cancel pick");
      }
    },
    [userPicks, cancelPickemPick]
  );

  // Check if there are unsaved changes
  const hasUnsavedChanges = Object.keys(selectedPicks).length > 0;

  // Check if week is pending (allows editing)
  const isWeekPending = week?.status === "PENDING";

  if (!week || !userPicks) {
    return <Loading />;
  }

  return (
    <ContentLayout title={`Pick'em Week ${weekNumber}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Back to Campaign Button */}
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Campaign
          </Button>
        </div>

        {/* Save Button - only show if there are unsaved changes and week is pending */}
        {hasUnsavedChanges && isWeekPending && (
          <div className="mb-4 flex justify-center">
            <Button
              onClick={handleSavePicks}
              className="bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Save {Object.keys(selectedPicks).length} Pick
              {Object.keys(selectedPicks).length !== 1 ? "s" : ""}
            </Button>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              {week.seasonType} - Week {week.weekNumber}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {week.matchups.map((matchup: any) => {
                const userPick = userPickForMatchup(matchup._id);
                const selectedPick = selectedPickForMatchup(matchup._id);

                return (
                  <PickemMatchupCard
                    key={matchup._id}
                    matchup={matchup}
                    activePick={userPick}
                    selectedPick={selectedPick}
                    onPick={handlePick}
                    onCancelPick={
                      matchup.status === "PENDING" && userPick
                        ? () => handleCancelPick(matchup._id)
                        : undefined
                    }
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
