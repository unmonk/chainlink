"use client";

import { ContentLayout } from "@/components/nav/content-layout";
import { SquadsDataTable } from "@/components/admin/squads/squads-admin";
import { columns } from "@/components/admin/squads/columns";

export default function AdminSquadsPage() {
  return (
    <main>
      <ContentLayout title="Admin Squads">
        <SquadsDataTable columns={columns} />
      </ContentLayout>
    </main>
  );
}
