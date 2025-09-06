import { ContentLayout } from "@/components/nav/content-layout";
import AdminPgaMatchupList from "@/components/admin/pga/admin-pga-matchup-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <ContentLayout title="PGA Matchups">
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/admin/pga/create">Create New Matchup</Link>
        </Button>
      </div>
      <AdminPgaMatchupList />
    </ContentLayout>
  );
}
