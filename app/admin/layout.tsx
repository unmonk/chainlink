import AdminSidebar, { AdminMobileTopBar } from "@/components/admin/sidebar";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = auth();
  if (!sessionClaims) redirect("/");

  const orgs = sessionClaims.organizations as {
    [key: string]: { role: string };
  };
  const adminOrg = process.env.ADMIN_ORG_ID;
  if (!orgs[adminOrg!]) {
    redirect("/");
  }

  return (
    <section>
      <div className="flex flex-col md:flex-row">
        <AdminSidebar className="hidden md:block" />
        <AdminMobileTopBar className="md:hidden" />
        <div className="lg:border-1">{children}</div>
      </div>
    </section>
  );
}
