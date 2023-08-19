import { Separator } from "@/components/ui/separator";
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
    <div className="border rounded-md p-4 flex flex-col gap-2">
      <h2 className="text-2xl font-semibold text-primary">Scheduled Jobs</h2>
      <Separator />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Successes</TableHead>
            <TableHead>Failures</TableHead>
            <TableHead>Estimated Daily Runs</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {crons &&
            crons.map((cron: Cron) => {
              return (
                <TableRow key={cron.cron_job_id}>
                  <TableCell className="font-bold">
                    {cron.cron_job_name}
                  </TableCell>
                  <TableCell>{cron.total_successes}</TableCell>
                  <TableCell>{cron.total_failures}</TableCell>
                  <TableCell>{cron.epds_occupied}</TableCell>
                  <TableCell>{cron.cron_expression}</TableCell>
                  <TableCell>{cron.status ? "ENABLED" : "DISABLED"}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CronList;
