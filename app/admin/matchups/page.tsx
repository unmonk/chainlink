import AdminMatchupList from "@/components/matchups/admin-matchup-list";
import { ContentLayout } from "@/components/nav/content-layout";

export default function Page() {
  return (
    <ContentLayout title="Admin Matchups">
      <AdminMatchupList />
    </ContentLayout>
  );
}
