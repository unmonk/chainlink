import { ContentLayout } from "@/components/nav/content-layout";
import NotificationForm from "@/components/notifications/notification-form";

export default async function Page() {
  return (
    <ContentLayout title="Admin Users">
      <NotificationForm />
    </ContentLayout>
  );
}
