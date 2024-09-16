"use client";
import { ContentLayout } from "@/components/nav/content-layout";
import SendNotification from "@/components/profile/notifications";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UserProfile, useUser } from "@clerk/nextjs";
import { BellRingIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
  return (
    <ContentLayout title="Settings">
      <UserProfile path="/settings" routing="path">
        <UserProfile.Page
          label="Notifications"
          url="notifications"
          labelIcon={<BellRingIcon />}
        >
          <NotificationsPage />
        </UserProfile.Page>
      </UserProfile>
    </ContentLayout>
  );
}

const NotificationsPage = () => {
  return (
    <div className="grid gap-6">
      <h1 className="text-white text-2xl ">Notifications</h1>
      <SendNotification />
    </div>
  );
};
