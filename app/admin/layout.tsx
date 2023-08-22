import AdminSidebar from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="grid grid-cols-5">
        <AdminSidebar />
        <div className="col-span-3 lg:col-span-4 lg:border-1">{children}</div>
      </div>
    </section>
  );
}
