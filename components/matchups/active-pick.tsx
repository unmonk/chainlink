import { Doc } from "@/convex/_generated/dataModel";
import { Card, CardTitle } from "../ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Logo } from "../ui/logo";
import { Button } from "../ui/button";
import { MatchupCardHeader, displayWinner } from "./matchup-card";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DrawerTrigger,
  DrawerContent,
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "../ui/drawer";

import { formatDistance } from "date-fns";
import { matchupReward } from "@/convex/utils";

export type UserPickWithMatchup = Doc<"picks"> & { matchup: Doc<"matchups"> };

const ActivePickCard = ({ pick }: { pick: UserPickWithMatchup }) => {
  const cancelPick = useMutation(api.picks.cancelPick);

  const handleCancelPick = async () => {
    try {
      await cancelPick({ pickId: pick._id });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (!pick) return null;
  if (!pick.matchup) return null;

  return (
    <Card
      className={cn(
        "mb-4 rounded-t-none w-full max-w-[645px]",
        pick.matchup.featured ? "border-primary border-2" : "border-primary/20"
      )}
    >
      <MatchupCardHeader matchup={pick.matchup} />
      <CardTitle className="text-lg px-1 font-bold">
        {pick.matchup.title}
      </CardTitle>

      <div className="">
        <div className="grid grid-cols-3 items-center text-center">
          <p className="text-balance text-sm font-semibold">
            {pick.matchup.awayTeam.name}
          </p>
          <p className="text-primary text-sm"></p>

          <p className="text-balance text-sm font-semibold">
            <span className="text-primary text-xs font-extralight">@</span>
            {pick.matchup.homeTeam.name}
          </p>
        </div>
        <div className="grid grid-cols-6 items-center text-center py-1">
          <div className="col-span-2">
            <div
              className={cn(
                " border relative aspect-square h-5/6 w-5/6 overflow-hidden rounded-md items-center justify-center inline-flex",
                pick.pick.id === pick.matchup.awayTeam.id
                  ? "bg-accent border-primary"
                  : "bg-accent/40 opacity-30 border-foreground/15"
              )}
            >
              <Image
                src={pick.matchup.awayTeam.image}
                alt={pick.matchup.awayTeam.name}
                fill
                sizes={"100%"}
                style={{
                  maxWidth: "100%",
                  height: "auto"
                }} />
              {pick.pick.id === pick.matchup.awayTeam.id && (
                <Badge className="absolute right-1 top-1">
                  <CheckIcon size={12} />
                </Badge>
              )}
            </div>
          </div>
          {pick.matchup.status === "STATUS_SCHEDULED" && (
            <div className="col-span-2 bg-accent/40 flex flex-col items-center justify-center rounded-sm p-2 mx-auto ">
              <span className="text-primary text-center text-xs font-bold">
                Locks in:
              </span>
              <Logo size={50} />{" "}
              <span className="text-primary text-center text-xs font-bold">
                {formatDistance(new Date(pick.matchup.startTime), new Date(), {
                  includeSeconds: true,
                })}
              </span>
            </div>
          )}
          {pick.matchup.status !== "STATUS_SCHEDULED" && (
            <p
              className={
                pick.matchup.status === "STATUS_FINAL" &&
                pick.matchup.winnerId === pick.matchup.awayTeam.id
                  ? "text-center col-span-1 bg-primary font-bold rounded-sm mx-1"
                  : "text-center col-span-1 bg-accent rounded-sm mx-1"
              }
            >
              {pick.matchup.status !== "STATUS_SCHEDULED"
                ? pick.matchup.awayTeam.score
                : ""}
            </p>
          )}
          {pick.matchup.status !== "STATUS_SCHEDULED" && (
            <p
              className={
                pick.matchup.status === "STATUS_FINAL" &&
                pick.matchup.winnerId === pick.matchup.homeTeam.id
                  ? "text-center col-span-1 bg-primary font-bold rounded-sm mx-1"
                  : "text-center col-span-1 bg-accent rounded-sm mx-1"
              }
            >
              {pick.matchup.status !== "STATUS_SCHEDULED"
                ? pick.matchup.homeTeam.score
                : " "}
            </p>
          )}

          <div className="col-span-2 ">
            <div
              className={cn(
                "border-primary border relative aspect-square h-5/6 w-5/6 overflow-hidden rounded-md items-center justify-center inline-flex",
                pick.pick.id === pick.matchup.homeTeam.id
                  ? "bg-accent border-primary"
                  : "bg-accent/40 opacity-30  border-foreground/15"
              )}
            >
              <Image
                src={pick.matchup.homeTeam.image}
                alt={pick.matchup.homeTeam.name}
                fill
                sizes={"100%"}
                style={{
                  maxWidth: "100%",
                  height: "auto"
                }} />
              {pick.pick.id === pick.matchup.homeTeam.id && (
                <Badge className="absolute right-1 top-1">
                  <CheckIcon size={12} />
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 items-center text-center p-2 min-h-12">
          <div className="flex flex-col items-center justify-center">
            {(pick.matchup.status === "STATUS_SCHEDULED" ||
              pick.matchup.status === "STATUS_POSTPONED") && (
              <p className="text-light text-xs text-nowrap">
                Wager: 🔗
                <span className="text-yellow-500">{pick.matchup.cost}</span>
              </p>
            )}
            <p className="text-light text-xs text-nowrap">
              Reward: 🔗
              <span className="text-yellow-500">
                {matchupReward(pick.matchup.cost, pick.matchup.featured)}
              </span>
            </p>
          </div>
          {(pick.matchup.status === "STATUS_SCHEDULED" ||
            pick.matchup.status === "STATUS_POSTPONED") && (
            <CancelButton onConfirm={handleCancelPick} />
          )}
          <p className="text-primary text-sm">
            {pick.matchup.featured && "Chain Builder"}
          </p>
        </div>
      </div>
    </Card>
  );
};

const CancelButton = ({ onConfirm }: { onConfirm: () => void }) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size={"sm"}
            variant={"destructive"}
            onClick={() => setOpen(true)}
          >
            Cancel
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Pick</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your pick?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={onConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          size={"sm"}
          variant={"destructive"}
          onClick={() => setOpen(true)}
        >
          Cancel
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Cencel Pick</DrawerTitle>
          <DrawerDescription>
            Are you sure you want to cancel your pick?
          </DrawerDescription>
        </DrawerHeader>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="destructive" onClick={onConfirm}>
              Confirm
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ActivePickCard;
