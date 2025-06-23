"use client";

import AdminActions from "@/components/admin/admin-actions";
import AdminCampaigns from "@/components/admin/campaigns/admin-campaigns";
import { ContentLayout } from "@/components/nav/content-layout";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function AdminActionsPage() {
  //const activeCampaign = useQuery(api.campaigns.getActiveGlobalCampaign);
  return (
    <ContentLayout title="Actions">
      <AdminActions />
    </ContentLayout>
  );
}
