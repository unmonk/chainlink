import { CreatePickemCampaign } from "@/components/admin/pickem/create-pickem-campaign";
import { PickemCampaignsList } from "@/components/pickem/pickem-campaigns-list";
import { ContentLayout } from "@/components/nav/content-layout";
import { AdminPickemList } from "@/components/admin/pickem/admin-pickem-list";

export default function AdminCreatePickemPage() {
  return (
    <ContentLayout title="Pick'em">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Pickem Campaign Management</h1>

        <div className="grid grid-cols-1 gap-8">
          <CreatePickemCampaign />
        </div>
      </div>
    </ContentLayout>
  );
}
