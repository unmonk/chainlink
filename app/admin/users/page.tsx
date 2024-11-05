"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useQueryState } from "nuqs";
import { ContentLayout } from "@/components/nav/content-layout";
import NotificationForm from "@/components/notifications/notification-form";

import { AdminSearchBox } from "@/components/users/admin-search-box";
import { AdminUserInfo } from "@/components/users/admin-user-info";
import { User } from "@clerk/nextjs/server";
import { AdminUserActions } from "@/components/users/admin-user-actions";
import AdminUserStats from "@/components/users/admin-user-stats";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/components/ui/loading";

export default function Page() {
  const [userId, setUserId] = useQueryState("userId");
  const [clerkUser, setClerkUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchClerkUser() {
      if (!userId) {
        setClerkUser(null);
        return;
      }

      try {
        const response = await fetch(`/api/clerk/${userId}`);
        if (!response.ok) {
          console.error("Failed to fetch Clerk user");
          return;
        }
        const data = await response.json();
        setClerkUser(data);
      } catch (error) {
        console.error("Error fetching Clerk user:", error);
      }
    }

    fetchClerkUser();
  }, [userId]);

  const convexUser = useQuery(
    api.users.queryByClerkId,
    userId ? { clerkUserId: userId } : "skip"
  );

  const onUserSelect = (user: User) => {
    setUserId(user.id);
  };

  return (
    <ContentLayout title="Admin Users">
      <Suspense fallback={<Loading />}>
        <AdminSearchBox onUserSelect={onUserSelect} />

        {convexUser && clerkUser && (
          <>
            <AdminUserActions user={convexUser} />
            <AdminUserInfo user={clerkUser} convexUser={convexUser} />
            <AdminUserStats user={convexUser} />
          </>
        )}
      </Suspense>
    </ContentLayout>
  );
}
