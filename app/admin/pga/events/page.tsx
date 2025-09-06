import { ContentLayout } from "@/components/nav/content-layout";
import PgaEventList from "@/components/admin/pga/pga-event-list";

export default function Page() {
  return (
    <ContentLayout title="PGA Events">
      <PgaEventList />
    </ContentLayout>
  );
}
