"use client";

import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import { Cron, disableCron, enableCron } from "@/lib/actions/crons";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { toast } from "sonner";

interface CronRowProps {
  cron: Cron;
}

const CronRow: FC<CronRowProps> = ({ cron }) => {
  const router = useRouter();
  const handleSwitchChange = async (cron: Cron) => {
    let success = false;
    if (cron.status) {
      success = await disableCron(cron.cron_job_id);
      router.refresh();
    } else {
      success = await enableCron(cron.cron_job_id);
      router.refresh();
    }
    if (!success) {
      toast.error("Failed to update cron status");
    }
  };
  return (
    <TableRow key={cron.cron_job_id}>
      <TableCell className="font-bold">{cron.cron_job_name}</TableCell>
      <TableCell>{cron.total_successes}</TableCell>
      <TableCell>{cron.total_failures}</TableCell>
      <TableCell>{cron.epds_occupied}</TableCell>
      <TableCell>{cron.cron_expression}</TableCell>
      <TableCell>
        <Switch
          id="cron_enabled"
          checked={cron.status}
          onCheckedChange={() => handleSwitchChange(cron)}
        />
      </TableCell>
    </TableRow>
  );
};

export default CronRow;
