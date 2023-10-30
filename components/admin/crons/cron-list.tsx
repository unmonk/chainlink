import CronRow from "./cron-row";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cron, getCronsList } from "@/lib/actions/crons";
import { FC } from "react";

interface CronListProps {}

const CronList: FC<CronListProps> = async ({}) => {
  const crons = await getCronsList();
  if (!crons) return <div>no crons</div>;
  crons.sort((a: Cron, b: Cron) => {
    if (a.cron_job_name < b.cron_job_name) {
      return -1;
    }
    if (a.cron_job_name > b.cron_job_name) {
      return 1;
    }
    return 0;
  });

  return (
    <div className="flex flex-col gap-2 rounded-md border p-4">
      <h2 className="text-primary text-2xl font-semibold">Scheduled Jobs</h2>
      <Separator />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Successes</TableHead>
            <TableHead>Failures</TableHead>
            <TableHead>Estimated Daily Runs</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Enabled</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {crons &&
            crons.map((cron: Cron) => {
              return <CronRow cron={cron} key={cron.cron_job_id} />;
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CronList;
