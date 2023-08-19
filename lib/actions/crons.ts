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
    `https://www.easycron.com/rest/list?token=${process.env.EASY_CRON_SECRET}&sortby=cronId&order=desc`,
  ).then((res) => res.json());
  const crons = cronRes.cron_jobs;
  return crons;
}
