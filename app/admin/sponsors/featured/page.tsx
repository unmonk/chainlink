import SponsorManager from "@/components/admin/sponsors/sponsor-manager";
import { ContentLayout } from "@/components/nav/content-layout";

export default function AdminFeaturedSponsors() {
  return (
    <ContentLayout title="Featured Sponsors">
      <SponsorManager />
    </ContentLayout>
  );
}
