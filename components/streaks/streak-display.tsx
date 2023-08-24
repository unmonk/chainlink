"use client";

import { Skeleton } from "../ui/skeleton";
import { getStreak } from "@/lib/actions/streaks";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { useEffect, useState } from "react";

interface StreakDisplayProps {
  size?: "default" | "sm" | "lg" | "xl";
}

const streakVariants = cva(
  "font-bold flex flex-row justify-center items-center",
  {
    variants: {
      size: {
        default: "",
        sm: "text-xs",
        lg: "text-2xl",
        xl: "text-5xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

async function getData() {
  const streakData = await getStreak();
  return streakData;
}

export function StreakDisplay({ size }: StreakDisplayProps) {
  const [streakData, setStreakData] = useState({
    wins: null as number | null,
    losses: null as number | null,
    pushes: null as number | null,
    streak: null as number | null,
  });
  useEffect(() => {
    const data = getData();
    data.then((res) => {
      if (!res) return;
      setStreakData({
        wins: res.wins,
        losses: res.losses,
        pushes: res.pushes,
        streak: res.streak,
      });
    });
  }, []);

  const wins = streakData?.wins || 0;
  const losses = streakData?.losses || 0;
  const pushes = streakData?.pushes || 0;
  const streak = streakData?.streak || 0;

  const streakPrefix = streak >= 0 ? "W" : "L";
  const streakColor = streak >= 0 ? "text-green-500" : "text-red-500";
  const streakText = `${streakPrefix}${Math.abs(streak)}`;

  return (
    <>
      <h4 className={cn(streakVariants({ size }), streakColor)}>
        {streakData.streak === null ? (
          <>
            <Skeleton
              className={
                size === "sm"
                  ? "h-3 w-3"
                  : size === "default"
                  ? "h-4 w-4"
                  : size === "lg"
                  ? "h-5 w-5"
                  : "h-12 w-12"
              }
            />
            <Skeleton
              className={
                size === "sm"
                  ? "h-3 w-3"
                  : size === "default"
                  ? "h-4 w-4"
                  : size === "lg"
                  ? "h-5 w-5"
                  : "h-12 w-12"
              }
            />
          </>
        ) : (
          streakText
        )}
      </h4>

      <div
        className={cn(
          streakVariants({ size }),
          "font-mono flex flex-row justify-center items-center",
        )}
      >
        <div>
          {streakData.streak === null ? (
            <Skeleton
              className={
                size === "sm"
                  ? "h-3 w-3"
                  : size === "default"
                  ? "h-4 w-4"
                  : size === "lg"
                  ? "h-5 w-5"
                  : "h-12 w-12"
              }
            />
          ) : (
            wins
          )}
        </div>
        -
        <div>
          {streakData.streak === null ? (
            <Skeleton
              className={
                size === "sm"
                  ? "h-3 w-3"
                  : size === "default"
                  ? "h-4 w-4"
                  : size === "lg"
                  ? "h-5 w-5"
                  : "h-12 w-12"
              }
            />
          ) : (
            losses
          )}
        </div>
        -
        <div>
          {streakData.streak === null ? (
            <Skeleton
              className={
                size === "sm"
                  ? "h-3 w-3"
                  : size === "default"
                  ? "h-4 w-4"
                  : size === "lg"
                  ? "h-5 w-5"
                  : "h-12 w-12"
              }
            />
          ) : (
            pushes
          )}
        </div>
      </div>
    </>
  );
}
