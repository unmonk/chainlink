import { ContentLayout } from "@/components/nav/content-layout";
import { ActivePicksList } from "@/components/admin/picks/active-picks-list";

export default function AdminPicksPage() {
  return (
    <ContentLayout title="Active Picks">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Active Picks</h2>
        </div>
        <ActivePicksList />
      </div>
    </ContentLayout>
  );
} 