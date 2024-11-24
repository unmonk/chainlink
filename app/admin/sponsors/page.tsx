import { ContentLayout } from "@/components/nav/content-layout";
import { SponsorsList } from "@/components/admin/sponsors/sponsor-list";
import CreateSponsorForm from "@/components/admin/sponsors/create-sponsor-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SponsorManager from "@/components/admin/sponsors/sponsor-manager";
import { Plus, Star } from "lucide-react";

export default function SponsorsPage() {
  return (
    <ContentLayout title="Sponsors">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Sponsors</h1>
        <div className="flex items-center gap-2">
          <Link href="/admin/sponsors/create">
            <Button variant="outline" asChild>
              <Link
                href="/admin/sponsors/create"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create New
              </Link>
            </Button>
          </Link>
          <Link href="/admin/sponsors/featured">
            <Button variant="outline" asChild>
              <Link
                href="/admin/sponsors/featured"
                className="flex items-center gap-2"
              >
                <Star className="h-4 w-4" />
                Manage Featured
              </Link>
            </Button>
          </Link>
        </div>
      </div>
      <SponsorsList />
    </ContentLayout>
  );
}
