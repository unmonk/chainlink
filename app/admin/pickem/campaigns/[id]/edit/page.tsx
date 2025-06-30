import { EditPickemCampaign } from "@/components/admin/pickem/edit-pickem-campaign";
import { ContentLayout } from "@/components/nav/content-layout";
import { Id } from "@/convex/_generated/dataModel";

interface AdminPickemMatchupsPageProps {
  params: {
    id: Id<"pickemCampaigns">;
  };
}

export default function AdminPickemMatchupsPage({
  params,
}: AdminPickemMatchupsPageProps) {
  return (
    <ContentLayout title="Edit Pickem Campaign">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Edit Pickem Campaign</h1>
        <EditPickemCampaign campaignId={params.id} />
      </div>
    </ContentLayout>
  );
}
