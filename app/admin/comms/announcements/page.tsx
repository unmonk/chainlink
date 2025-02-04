import AnnouncementList from "@/components/admin/announcements/announcement-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AnnouncementsPage() {
  return (
    <>
      <div className="flex justify-end mb-6">
        <Link href="/admin/comms/announcements/create" passHref>
          <Button>Create Announcement</Button>
        </Link>
      </div>
      <AnnouncementList />
    </>
  );
}
