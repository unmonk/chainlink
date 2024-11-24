import CreateSponsorForm from "@/components/admin/sponsors/create-sponsor-form";
import { ContentLayout } from "@/components/nav/content-layout";

export default function CreateSponsorPage() {
  return (
    <ContentLayout title="Create Sponsor">
      <CreateSponsorForm />
    </ContentLayout>
  );
}
