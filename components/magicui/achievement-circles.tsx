"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const AchievementCircles = ({
  userId,
  username,
}: {
  userId: string;
  username: string | null;
}) => {
  const achievementsQuery = useQuery(
    api.achievements.getAchievementsByClerkUserId,
    {
      clerkUserId: userId,
    }
  );

  //remove nulls
  const achievements =
    achievementsQuery?.filter((a): a is NonNullable<typeof a> => a !== null) ||
    [];

  //remove duplicates
  const uniqueAchievements = achievements
    .sort((a, b) => b.weight - a.weight)
    .filter(
      (achievement, index, self) =>
        index === self.findIndex((t) => t._id === achievement._id)
    );

  const avatarUrls = uniqueAchievements
    .map((a) => a.image)
    .filter((url): url is string => url !== null)
    .slice(0, 10);

  const numPeople = achievements.length - avatarUrls.length;

  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse")}>
      {uniqueAchievements.slice(0, 10).map((a, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger>
              <Image
                className="h-16 w-16 rounded-full border border-white dark:border-gray-600/20 hover:scale-125 transition-all duration-300"
                src={a.image ?? ""}
                width={75}
                height={75}
                alt={a.name}
              />
            </TooltipTrigger>
            <TooltipContent>{a.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      <a
        className="hover:scale-125 transition-all duration-300 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-black/20 text-center text-xs font-medium text-white hover:bg-gray-400 dark:border-gray-800 dark:bg-gray-700/40 dark:text-black"
        href={`/u/${username}/achievements`}
      >
        +{numPeople}
      </a>
    </div>
  );
};

export default AchievementCircles;
