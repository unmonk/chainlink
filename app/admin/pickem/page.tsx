import { CreatePickemCampaign } from "@/components/admin/pickem/create-pickem-campaign";
import { PickemCampaignsList } from "@/components/pickem/pickem-campaigns-list";
import { ContentLayout } from "@/components/nav/content-layout";
import { AdminPickemList } from "@/components/admin/pickem/admin-pickem-list";
import { PickemAdminDashboard } from "@/components/admin/pickem/pickem-admin-dashboard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminPickemPage() {
  return (
    <ContentLayout title="Pick'em">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Pickem Campaign Management</h1>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="campaigns">All Campaigns</TabsTrigger>
            <TabsTrigger value="create">Create Campaign</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <PickemAdminDashboard />
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <div className="flex justify-end">
              <Link href="/admin/pickem/create">
                <Button variant="default">Create Campaign</Button>
              </Link>
            </div>
            <AdminPickemList />
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <CreatePickemCampaign />
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  );
}
