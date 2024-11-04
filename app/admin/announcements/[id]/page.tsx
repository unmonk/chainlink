import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { AnnouncementForm } from "@/components/admin/announcements/announcement-form";
import { fetchQuery } from "convex/nextjs";
import { ContentLayout } from "@/components/nav/content-layout";

interface AnnouncementEditPageProps {
  params: {
    id: Id<"announcements">;
  };
}

export default async function AnnouncementEditPage({
  params,
}: AnnouncementEditPageProps) {
  const announcement = await fetchQuery(api.announcements.getById, {
    id: params.id,
  });

  if (!announcement) {
    notFound();
  }

  return (
    <ContentLayout title="Edit Announcement">
      <AnnouncementForm
        initialData={{
          ...announcement,
          expiresAt: new Date(announcement.expiresAt),
        }}
        isEditing
      />
    </ContentLayout>
  );
}
