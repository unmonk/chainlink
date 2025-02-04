import { AnnouncementForm } from "@/components/admin/announcements/announcement-form";
import { ContentLayout } from "@/components/nav/content-layout";

export default function NewAnnouncementPage() {
  return (
    <ContentLayout title="New Announcement">
      <AnnouncementForm isEditing={false} />
    </ContentLayout>
  );
}
