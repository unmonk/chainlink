import AnnouncementList from "@/components/admin/announcements/announcement-list";
import { ContentLayout } from "@/components/nav/content-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AnnouncementsPage() {
  return (
    <ContentLayout title="Announcements">
      <div className="flex justify-end mb-6">
        <Link href="/admin/announcements/create" passHref>
          <Button>Create Announcement</Button>
        </Link>
      </div>
      <AnnouncementList />
    </ContentLayout>
  );
}
