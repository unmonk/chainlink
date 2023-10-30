import { AdminDeleteAchievementModal } from "@/components/modals/admin-delete-achievement-modal";
import { AdminEditAchievementModal } from "@/components/modals/admin-edit-achievement-modal";
import { Achievement } from "@/drizzle/schema";
import Image from "next/image";
import { FC } from "react";

interface AchievementListItemProps {
  achievement: Achievement;
}

const AchievementListItem: FC<AchievementListItemProps> = ({ achievement }) => {
  return (
    <div
      key={achievement.id}
      className="flex cursor-pointer flex-row items-center justify-center gap-4 border-y-2 p-2"
    >
      <div className="flex w-1/3 flex-row items-center justify-center gap-2">
        <div className="w-18 h-18 flex items-center justify-center rounded-full bg-neutral-900">
          <Image
            src={achievement.image || "/images/alert-octagon.svg"}
            alt={achievement.name}
            width={250}
            height={250}
          />
        </div>
        <p className="font-bold">{achievement.name}</p>
      </div>
      <div className="w-1/3 text-sm">{achievement.description}</div>
      <div className="flex w-1/3 flex-row gap-2">
        <AdminDeleteAchievementModal
          disabled={false}
          achievementId={achievement.id}
        />
        <AdminEditAchievementModal disabled={false} achievement={achievement} />
      </div>
    </div>
  );
};

export default AchievementListItem;
