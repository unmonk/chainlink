"use client";

import AdminActions from "@/components/admin/admin-actions";
import { ContentLayout } from "@/components/nav/content-layout";

export default function AdminActionsPage() {
  return (
    <ContentLayout title="Actions">
      <AdminActions />
    </ContentLayout>
  );
}
