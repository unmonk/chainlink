"use client";
import PrivacyPolicyText from "@/components/landing/privacy-policy";
import TermsServiceText from "@/components/landing/terms-service";
import { ContentLayout } from "@/components/nav/content-layout";
import SendNotification from "@/components/profile/notifications";
import Inventory from "@/components/shop/inventory";
import { UserProfile } from "@clerk/nextjs";
import { BellRingIcon, FileIcon, FileTextIcon, GemIcon } from "lucide-react";

export default function Page() {
  return (
    <ContentLayout title="Settings">
      <UserProfile path="/settings" routing="path">
        <UserProfile.Page
          label="Notifications"
          url="notifications"
          labelIcon={<BellRingIcon className="w-4 h-4" />}
        >
          <NotificationsPage />
        </UserProfile.Page>
        <UserProfile.Page
          label="Inventory"
          url="inventory"
          labelIcon={<GemIcon className="w-4 h-4" />}
        >
          <InventoryPage />
        </UserProfile.Page>
        <UserProfile.Page
          label="Privacy Policy"
          url="privacy-policy"
          labelIcon={<FileTextIcon className="w-4 h-4" />}
        >
          <PrivacyPolicyText />
        </UserProfile.Page>
        <UserProfile.Page
          label="Terms of Service"
          url="terms-of-service"
          labelIcon={<FileTextIcon className="w-4 h-4" />}
        >
          <TermsServiceText />
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

const InventoryPage = () => {
  return (
    <div className="grid gap-6">
      <h1 className="text-white text-2xl ">Inventory</h1>
      <Inventory />
    </div>
  );
};
