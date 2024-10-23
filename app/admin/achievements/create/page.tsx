import { ContentLayout } from "@/components/nav/content-layout";
import { CreateAchievementForm } from "@/components/achievements/create-achievement-form";

export default function Page() {
  return (
    <ContentLayout title="Create Achievement">
      <div className="space-y-8 flex items-center justify-between">
        <CreateAchievementForm />
      </div>
    </ContentLayout>
  );
}
