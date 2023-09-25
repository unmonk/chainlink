import ProfileDetails from "@/components/profile/profiledetails";
import {
  getUserAndStreakByUsername,
  getUserByUsername,
} from "@/lib/actions/users";
import { Metadata, ResolvingMetadata } from "next";

type ProfilePageProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: ProfilePageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const id = params.id;
  const user = await getUserByUsername(id);
  return {
    title: `${user.username} | ChainLink`,
    description: `View ${user.username}'s ChainLink profile.`,
    openGraph: {
      images: [`https://chainlink.st/api/share/streak/${user.id}`],
    },
  };
}

export default async function IdUserProfilePage({
  params: { id },
}: ProfilePageProps) {
  const user = await getUserByUsername(id);

  if (!user) {
    return (
      <section className="flex flex-col items-center py-4 md:py-6 ">
        User not found
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center py-4 md:py-6 ">
      <ProfileDetails user={user} />
    </section>
  );
}
