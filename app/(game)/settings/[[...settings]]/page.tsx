"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UserProfile } from "@clerk/nextjs";
import { BellRingIcon } from "lucide-react";

export default function Page() {
  return (
    <main>
      <UserProfile path="/settings" routing="path">
        <UserProfile.Page
          label="Notifications"
          url="notifications"
          labelIcon={<BellRingIcon />}
        >
          <NotificationsPage />
        </UserProfile.Page>
      </UserProfile>
    </main>
  );
}

export const NotificationsPage = () => {
  return (
    <div className="grid gap-6">
      <h1 className="text-white text-2xl ">Notifications</h1>
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="necessary" className="flex flex-col space-y-1">
          <span>Pick Completion Notifications</span>
          <span className="font-normal leading-snug text-muted-foreground">
            Recieve notifications when your pick is completed.
          </span>
        </Label>
        <Switch id="necessary" defaultChecked />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="functional" className="flex flex-col space-y-1">
          <span>Promotional Notifications</span>
          <span className="font-normal leading-snug text-muted-foreground">
            Recieve notifications about special events, featured matchups, and
            promotions.
          </span>
        </Label>
        <Switch id="functional" />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="performance" className="flex flex-col space-y-1">
          <span>Promotional Emails</span>
          <span className="font-normal leading-snug text-muted-foreground">
            Recieve emails about special events, featured matchups, and
            promotions.
          </span>
        </Label>
        <Switch id="performance" />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="performance" className="flex flex-col space-y-1">
          <span>Weekly Report Emails</span>
          <span className="font-normal leading-snug text-muted-foreground">
            Recieve a weekly report of your picks and standings.
          </span>
        </Label>
        <Switch id="performance" />
      </div>
    </div>
  );
};
