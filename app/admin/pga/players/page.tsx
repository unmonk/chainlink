import { ContentLayout } from "@/components/nav/content-layout";
import PgaPlayerList from "@/components/admin/pga/pga-player-list";

export default function Page() {
  return (
    <ContentLayout title="PGA Players">
      <PgaPlayerList />
    </ContentLayout>
  );
}
