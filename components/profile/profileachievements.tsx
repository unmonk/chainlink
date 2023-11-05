import { FC } from "react"
import Image from "next/image"
import { getUserAchievements } from "@/lib/actions/profiles"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import AchievementCircle from "../achievements/achievements"

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
            <AchievementCircle
              className="h-20 w-20"
              achievement={achievement}
              key={achievement.id}
            />
          ))}
      </div>
    </div>
  )
}

export default ProfileAchievements
