import AchievementListItem from "@/components/admin/achievements/achievementlistitem";
import { NewAchievementForm } from "@/components/admin/achievements/newachievementform";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAchievementList } from "@/lib/actions/achievements";

export default async function AdminAchievmentPage() {
  const achievements = await getAchievementList();

  return (
    <div className="p-2 items-center justify-center flex flex-col">
      <h1 className="text-xl font-bold">Achievements</h1>
      <div className="lg:flex lg:flex-row gap-4">
        <div className="w-full lg:w-1/2 border rounded-md p-2">
          <NewAchievementForm />
        </div>
        <div className="w-full lg:w-1/2 border rounded-md p-2">
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
