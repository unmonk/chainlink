"use server";

import { revalidatePath } from "next/cache";

export type Cron = {
  cron_job_id: number;
  cron_job_name: string;
  cron_expression: string;
  epds_occupied: number;
  url: string;
  status: boolean;
  total_successes: string;
  total_failures: string;
};

export type CronResponse = {
  status: string;
  cron_jobs: Cron[];
};

export async function getCronsList() {
  const cronRes: CronResponse = await fetch(
    `https://www.easycron.com/rest/list?token=${process.env.EASY_CRON_SECRET}&sortby=cronId&order=desc&size=100`,
    {
      next: {
        revalidate: 0,
      },
    },
  ).then((res) => res.json());
  const crons = cronRes.cron_jobs;
  return crons;
}

export async function enableCron(cron_id: number) {
  const res = await fetch(
    `https://www.easycron.com/rest/enable?token=${process.env.EASY_CRON_SECRET}&id=${cron_id}`,
    {
      method: "POST",
    },
  );
  const data = await res.json();
  if (data.status === "success") {
    revalidatePath("/admin/crons");
    return true;
  }
  return false;
}

export async function disableCron(cron_id: number) {
  const res = await fetch(
    `https://www.easycron.com/rest/disable?token=${process.env.EASY_CRON_SECRET}&id=${cron_id}`,
    {
      method: "POST",
    },
  );
  const data = await res.json();
  if (data.status === "success") {
    revalidatePath("/admin/crons");
    return true;
  }
  return false;
}
