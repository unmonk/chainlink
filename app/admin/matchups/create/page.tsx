import { CreateMatchupForm } from "@/components/matchups/matchup-forms/create-matchup";
import { ContentLayout } from "@/components/nav/content-layout";

export default function CreateMatchupPage() {
  return (
    <ContentLayout title="Create New Matchup">
      <div className="flex flex-col gap-4 p-4 rounded-lg">
        <CreateMatchupForm />
      </div>
    </ContentLayout>
  );
}
