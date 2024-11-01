import { ContentLayout } from "@/components/nav/content-layout";
import { AwardAchievementForm } from "@/components/achievements/award-achievement-form";

export default function Page() {
  return (
    <ContentLayout title="Award Achievement">
      <div className="space-y-8 flex items-center justify-between">
        <AwardAchievementForm />
      </div>
    </ContentLayout>
  );
}
