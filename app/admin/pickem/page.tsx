import { CreatePickemCampaign } from "@/components/admin/pickem/create-pickem-campaign";
import { PickemCampaignsList } from "@/components/pickem/pickem-campaigns-list";
import { ContentLayout } from "@/components/nav/content-layout";
import { AdminPickemList } from "@/components/admin/pickem/admin-pickem-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminPickemPage() {
  return (
    <ContentLayout title="Pick'em">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Pickem Campaign Management</h1>
        <div className="flex justify-end">
          <Link href="/admin/pickem/create">
            <Button variant="default">Create Campaign</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <AdminPickemList />
        </div>
      </div>
    </ContentLayout>
  );
}
