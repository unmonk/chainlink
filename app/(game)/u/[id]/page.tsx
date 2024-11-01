import { ContentLayout } from "@/components/nav/content-layout";
import Profile from "@/components/profile/profile";
import DashboardStats from "@/components/stats/dashboard-stats";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getUserByUsername } from "@/lib/auth";
import { Metadata, ResolvingMetadata } from "next";
import UserStats from "@/components/stats/user-profile-stats";
import { redirect } from "next/navigation";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const user = await getUserByUsername(id);
  if (!user) {
    redirect("/dashboard");
  }
  return {
    title: `${user.username} | ChainLink`,
    description: `View ${user.username}'s ChainLink profile.`,
    category: "profile",
    openGraph: {
      title: `${user.username} | ChainLink`,
      siteName: "ChainLink",
      description: `View ${user.username}'s ChainLink profile.`,
      username: user.username,
      type: "profile",
      url: `https://chainlink.st/u/${user.username}`,
    },
    twitter: {
      site: "ChainLink",
      description: `View ${user.username}'s ChainLink profile.`,
      title: `${user.username} | ChainLink Profile`,
      siteId: "@chainlinkst",
      card: "summary_large_image",
    },
  };
}

export default async function IdUserProfilePage({ params: { id } }: Props) {
  const clerkUser = await getUserByUsername(id);
  if (!clerkUser) {
    return <ContentLayout title="Profile">User not found</ContentLayout>;
  }

  const user = await fetchQuery(api.users.queryByClerkId, {
    clerkUserId: clerkUser.id,
  });
  if (!user) {
    return (
      <ContentLayout title="Profile">User not found in database</ContentLayout>
    );
  }

  return (
    <ContentLayout title={`${user.name}`}>
      <Profile user={clerkUser} />
      <UserStats user={user} />
    </ContentLayout>
  );
}
