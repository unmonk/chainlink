import { ContentLayout } from "@/components/nav/content-layout";
import AdminCommsNav from "@/components/nav/admin-comms-nav";

export default function AdminComms({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContentLayout title="Comms">
      <div className="flex flex-col gap-4">
        <AdminCommsNav className="mb-4" />
        {children}
      </div>
    </ContentLayout>
  );
}
