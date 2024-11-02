"use client";

import AdminEditSquad from "@/components/admin/squads/edit-squad";
import { ContentLayout } from "@/components/nav/content-layout";
import { Id } from "@/convex/_generated/dataModel";

export default function AdminSquadsPage({
  params,
}: {
  params: { id: Id<"squads"> };
}) {
  return (
    <main>
      <ContentLayout title="Edit Squad">
        <AdminEditSquad squadId={params.id} />
      </ContentLayout>
    </main>
  );
}
