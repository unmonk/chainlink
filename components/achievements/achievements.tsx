import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Achievement } from "@/drizzle/schema"
import Image from "next/image"
import { cn } from "@/lib/utils"

function AchievementCircle({
  className,
  achievement,
  showName = true,
}: {
  className?: string
  showName?: boolean
  achievement: Achievement
}) {
  return (
    <Popover key={achievement.id}>
      <PopoverTrigger>
        <div
          className={cn(
            className,
            "border-nuetral=800 flex flex-col items-center justify-center rounded-full border bg-neutral-100 text-center dark:bg-neutral-900"
          )}
        >
          <Image
            alt={achievement.name || "Achievement"}
            src={achievement.image || "images/alert-octagon.svg"}
            width={100}
            height={100}
            className="h-auto w-auto object-cover transition-all hover:scale-110"
          />
        </div>
        {showName && (
          <p className="h-8 max-h-8 whitespace-pre-line text-center text-xs">
            {achievement.name || "Achievement"}
          </p>
        )}
      </PopoverTrigger>
      <PopoverContent align="center" side="bottom">
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold">
            {achievement.name || "Achievement"}
          </h3>
          <p className="text-center text-sm">
            {achievement.description || "Description"}
          </p>
          <p className="text-center text-sm">
            Awarded on:{" "}
            {achievement.created_at?.toLocaleDateString("en-US") || "Date"}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default AchievementCircle
