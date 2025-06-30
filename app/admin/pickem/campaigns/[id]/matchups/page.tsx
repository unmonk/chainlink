import { CampaignMatchupsList } from "@/components/admin/pickem/campaign-matchups-list";
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
    <ContentLayout title="Manage Matchups">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Manage Matchups</h1>
        <CampaignMatchupsList campaignId={params.id} />
      </div>
    </ContentLayout>
  );
}
