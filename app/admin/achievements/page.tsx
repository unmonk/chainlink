import AchievementListItem from "@/components/admin/achievements/achievementlistitem";
import { NewAchievementForm } from "@/components/admin/achievements/newachievementform";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAchievementList } from "@/lib/actions/achievements";

export default async function AdminAchievmentPage() {
  const achievements = await getAchievementList();

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <h1 className="text-xl font-bold">Achievements</h1>
      <div className="gap-4 lg:flex lg:flex-row">
        <div className="w-full rounded-md border p-2 lg:w-1/2">
          <NewAchievementForm />
        </div>
        <div className="w-full rounded-md border p-2 lg:w-1/2">
          <ScrollArea className="h-full">
            {achievements.map((achievement) => (
              <AchievementListItem
                achievement={achievement}
                key={achievement.id}
              />
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
