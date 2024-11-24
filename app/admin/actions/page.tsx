"use client";

import AdminActions from "@/components/admin/admin-actions";
import { ReactionsList } from "@/components/admin/matchups/reactions/reactions-list";
import { ContentLayout } from "@/components/nav/content-layout";

export default function AdminActionsPage() {
  return (
    <ContentLayout title="Actions">
      <AdminActions />
      <ReactionsList />
    </ContentLayout>
  );
}
