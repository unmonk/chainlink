import { ContentLayout } from "@/components/nav/content-layout";
import Profile from "@/components/profile/profile";
import { getUserByUsername } from "@/lib/auth";
import { Metadata, ResolvingMetadata } from "next";

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
  const user = await getUserByUsername(id);

  if (!user) {
    return <ContentLayout title="Profile">User not found</ContentLayout>;
  }

  return (
    <ContentLayout title="Profile">
      <Profile user={user} />
    </ContentLayout>
  );
}
