import { FC } from "react"
import Image from "next/image"
import { getUserAchievements } from "@/lib/actions/profiles"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

interface ProfileAchievementsProps {
  userId: string
}

const ProfileAchievements: FC<ProfileAchievementsProps> = async ({
  userId,
}) => {
  const achievements = await getUserAchievements(userId)
  return (
    <div>
      <h2 className="mb-2 text-xl font-bold">Achievements</h2>
      {achievements.length === 0 && (
        <p className="text-muted-foreground">None Yet. Play to unlock more.</p>
      )}
      <div className="mb-4 grid grid-cols-4 gap-2 md:grid-cols-8 xl:grid-cols-12">
        {achievements &&
          achievements.map(({ achievement }) => (
            <Popover key={achievement.id}>
              <PopoverTrigger>
                <div className="border-nuetral=800 flex h-20 w-20 flex-col items-center justify-center rounded-full border bg-neutral-100 text-center dark:bg-neutral-900">
                  <Image
                    alt={achievement.name || "Achievement"}
                    src={achievement.image || "images/alert-octagon.svg"}
                    width={100}
                    height={100}
                    className="h-auto w-auto object-cover transition-all hover:scale-110"
                  />
                </div>
                <p className="h-8 max-h-8 whitespace-pre-line text-center text-xs">
                  {achievement.name || "Achievement"}
                </p>
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
                    {achievement.created_at?.toLocaleDateString("en-US") ||
                      "Date"}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          ))}
      </div>
    </div>
  )
}

export default ProfileAchievements
