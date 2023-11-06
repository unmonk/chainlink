import { AdminDeleteAchievementModal } from "@/components/modals/admin-delete-achievement-modal"
import { AdminEditAchievementModal } from "@/components/modals/admin-edit-achievement-modal"
import { Achievement } from "@/drizzle/schema"
import Image from "next/image"
import { FC } from "react"

interface AchievementListItemProps {
  achievement: Achievement
}

const AchievementListItem: FC<AchievementListItemProps> = ({ achievement }) => {
  return (
    <div
      key={achievement.id}
      className="flex cursor-pointer flex-row items-center justify-center gap-4 border-y-2 p-2"
    >
      <div className="mb-4 flex items-center space-x-4">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-neutral-900">
          <Image
            src={achievement.image || "/images/alert-octagon.svg"}
            alt={achievement.name}
            width={100}
            height={100}
          />
        </div>
        <p className="font-bold"></p>
      </div>

      <div className="grow">
        <h3 className="text-lg font-semibold">{achievement.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {achievement.description}
        </p>
      </div>
      <div className="flex flex-row gap-2">
        <AdminDeleteAchievementModal
          disabled={false}
          achievementId={achievement.id}
        />
        <AdminEditAchievementModal disabled={false} achievement={achievement} />
      </div>
    </div>
  )
}

export default AchievementListItem
