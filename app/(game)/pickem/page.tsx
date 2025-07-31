import { ContentLayout } from "@/components/nav/content-layout";
import { PickemCampaignsList } from "@/components/pickem/pickem-campaigns-list";

export default function PickemPage() {
  return (
    <ContentLayout title="Pick'em">
      <div className="container mx-auto py-8">
        <PickemCampaignsList />
      </div>
    </ContentLayout>
  );
}
