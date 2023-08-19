import CronList from "@/components/admin/crons/cron-list";

export default async function Admin() {
  return (
    <section className="mt-8 flex flex-col items-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg justify-center text-center">
        <h1 className="text-4xl font-semibold text-primary">Admin</h1>
      </div>
      <div className="flex flex-col gap-2">
        <CronList />
      </div>
    </section>
  );
}
