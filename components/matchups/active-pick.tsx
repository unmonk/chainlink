import { Doc } from "@/convex/_generated/dataModel";
import { Card, CardTitle } from "../ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Logo } from "../ui/logo";
import { Button } from "../ui/button";
import { MatchupCardHeader, matchupRewardDisplay } from "./matchup-card";
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

  return (
    <Card
      className={cn(
        "mb-4 rounded-t-none max-w-[600px] min-w-[300px] w-full",
        pick.matchup.featured ? "border-primary border-2" : "border-primary/20"
      )}
    >
      <MatchupCardHeader matchup={pick.matchup} />
      <CardTitle className="text-lg px-1 font-bold">
        {pick.matchup.title}
      </CardTitle>
      <div className="flex flex-col items-center gap-2 p-2">
        <div className="grid grid-cols-3 gap-4">
          <div
            className={cn(
              "relative flex flex-col items-center justify-center rounded-sm p-2",
              pick.pick.id === pick.matchup.awayTeam.id
                ? "bg-accent"
                : "bg-accent/40 opacity-30"
            )}
          >
            <Image
              src={pick.matchup.awayTeam.image}
              alt={pick.matchup.awayTeam.name}
              width={50}
              height={50}
            />
            <p>{pick.matchup.awayTeam.name}</p>
            {pick.pick.id === pick.matchup.awayTeam.id && (
              <Badge className="absolute right-1 top-1">
                <CheckIcon size={12} />
              </Badge>
            )}
          </div>
          <div className="bg-accent/40 flex flex-col items-center justify-center rounded-sm p-2 ">
            <span className="text-primary text-center text-xs font-bold">
              Locks at:
            </span>
            <Logo size={50} />
            <span className="text-primary text-center text-xs font-bold">
              {new Date(pick.matchup.startTime).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div
            className={cn(
              "relative flex flex-col items-center justify-center rounded-sm p-2",
              pick.pick.id === pick.matchup.homeTeam.id
                ? "bg-accent"
                : "bg-accent/40 opacity-30"
            )}
          >
            <Image
              src={pick.matchup.homeTeam.image}
              alt={pick.matchup.homeTeam.name}
              width={50}
              height={50}
            />
            <p>{pick.matchup.homeTeam.name}</p>
            {pick.pick.id === pick.matchup.homeTeam.id && (
              <Badge className="absolute right-1 top-1">
                <CheckIcon size={12} />
              </Badge>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center">
            <p className="text-light text-xs text-nowrap">
              Wager: 🔗
              <span className="text-yellow-500">{pick.matchup.cost}</span>
            </p>
            <p className="text-light text-xs text-nowrap">
              Reward: 🔗
              <span className="text-yellow-500">
                {matchupRewardDisplay(pick.matchup.cost, pick.matchup.featured)}
              </span>
            </p>
          </div>

          {pick.matchup.status === "STATUS_SCHEDULED" && (
            <CancelButton onConfirm={handleCancelPick} />
          )}
          {pick.matchup.status !== "STATUS_SCHEDULED" && "LOCKED"}
          <p className="text-primary flex items-center justify-center">
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
