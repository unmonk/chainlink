import TestNotificationButton from "@/components/admin/testnotificationbutton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminDashboard } from "@/lib/actions/admin-dashboard";
import {
  BusIcon,
  CalendarRangeIcon,
  PictureInPicture,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const dashboardData = await getAdminDashboard();
  return (
    <div className="p-8">
      <TestNotificationButton />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <Link href="/admin/users">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users2Icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.users}</div>
              <p className="text-muted-foreground text-xs"></p>
            </CardContent>
          </Link>
        </Card>
        <Card>
          <Link href="/admin/picks">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Picks
              </CardTitle>
              <PictureInPicture className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.activePicks}
              </div>
              <p className="text-muted-foreground text-xs"></p>
            </CardContent>
          </Link>
        </Card>
        <Card>
          <Link href="/admin/crons">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Daily Automations
              </CardTitle>
              <CalendarRangeIcon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.crons.dailyJobs}
              </div>
              <p className="text-muted-foreground text-xs">
                Total Failures: {dashboardData.crons.totalFailures}
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card>
          <Link href="/admin/crons">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Squads
              </CardTitle>
              <BusIcon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.squads}</div>
              <p className="text-muted-foreground text-xs"></p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
