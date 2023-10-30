"use client";

import { PickModal } from "../modals/pick-modal";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { NewPick, PickCardVariant, PickType } from "@/drizzle/schema";
import { usePick } from "@/hooks/usePick";
import { getPick, makePick } from "@/lib/actions/picks";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { cva } from "class-variance-authority";
import Image from "next/image";
import { FC, useState } from "react";

interface PickButtonProps {
  className?: string;
  variant?: PickCardVariant;
  selected?: boolean;
  teamImage?: string | null;
  type: PickType;
  disabled?: boolean;
  matchupId: number;
  winner: boolean;
}

const pickButtonVariants = cva(
  "aspect-square h-5/6 w-5/6 relative overflow-hidden",
  {
    variants: {
      variant: {
        WIN: "bg-green-400 dark:bg-green-900 border-green-400 dark:border-green-900 border-4",
        LOSS: "bg-red-400 dark:bg-red-900",
        PENDING: "bg-blue-400 dark:bg-blue-900",
        PUSH: "bg-warning",
        STATUS_SCHEDULED: "",
        STATUS_IN_PROGRESS: "border-sky-400 dark:border-sky-900",
        STATUS_FINAL: "",
        STATUS_POSTPONED: "",
        STATUS_CANCELED: "",
        STATUS_SUSPENDED: "",
        STATUS_DELAYED: "",
        STATUS_UNKNOWN: "",
        STATUS_END_PERIOD: "",
        STATUS_HALFTIME: "",
      },
      defaultVariants: {
        variant: "STATUS_SCHEDULED",
      },
    },
  },
);

const PickButton: FC<PickButtonProps> = ({
  variant,
  selected,
  teamImage,
  className,
  disabled,
  matchupId,
  type,
  winner,
}) => {
  const [loading, setLoading] = useState(false);
  const { openModal, closeModal, setPick } = usePick();
  const { userId } = useAuth();
  const handlePick = async () => {
    setLoading(true);
    if (!userId) return;
    const newPick: NewPick = {
      matchup_id: Number(matchupId),
      pick_type: type,
      active: true,
      pick_status: "PENDING",
      user_id: userId,
    };
    const existingPick = await getPick();
    if (existingPick) {
      openModal(newPick);
      setLoading(false);
      return;
    }
    await makePick(newPick);
    setLoading(false);
    scrollTo(0, 0);
  };

  const handleDeSelect = () => {
    console.log("deselect");
  };
  return (
    <>
      <Button
        variant={"outline"}
        className={cn(pickButtonVariants({ variant, className }), {
          "border-4 animate-border-pulse":
            selected && variant !== "WIN" && variant !== "LOSS",
          "border-2 border-blue-500": variant === "STATUS_FINAL" && winner,
        })}
        disabled={
          (disabled && !selected) || loading || variant !== "STATUS_SCHEDULED"
        }
        onClick={selected ? handleDeSelect : handlePick}
      >
        {loading ? (
          <Loader className="h-full w-full" />
        ) : (
          <Image
            src={teamImage ?? "/images/alert-octagon.svg"}
            fill
            sizes={"100%"}
            alt={teamImage ?? "Missing Team Data"}
            className={cn("", {
              "opacity-80 hover:scale-125 hover:opacity-90  hover:animate-tada-slow":
                !selected,
              "opacity-30": disabled,
              " hover:bg-red-400 dark:hover:bg-red-900 opacity-100": selected,
              "bg-accent": selected && variant !== "WIN" && variant !== "LOSS",
              "animate-pulse": variant === "STATUS_SCHEDULED" && selected,
            })}
          />
        )}
        <span className="sr-only">{type}</span>
      </Button>
      <PickModal />
    </>
  );
};

export default PickButton;
