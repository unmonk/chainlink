import { ContentLayout } from "@/components/nav/content-layout";
import PgaMatchupForm from "@/components/admin/pga/pga-matchup-form";

export default function Page() {
  return (
    <ContentLayout title="Create PGA Matchup">
      <PgaMatchupForm />
    </ContentLayout>
  );
}
