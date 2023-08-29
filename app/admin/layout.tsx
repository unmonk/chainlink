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
      <h2 className="w-full text-center font-mono text-red-500 md:hidden">
        Admin
      </h2>
      <div className="flex flex-col md:flex-row">
        <AdminSidebar className="hidden md:block md:w-1/6" />
        <AdminMobileTopBar className="md:hidden" />
        <div className="md:w-5/6 p-1">{children}</div>
      </div>
    </section>
  );
}
