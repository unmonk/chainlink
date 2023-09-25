import ProfileDetails from "@/components/profile/profiledetails";
import { clerkClient } from "@clerk/nextjs";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function getUserByUsername(id: string) {
  const user = await clerkClient.users.getUserList({
    username: [id],
    limit: 1,
  });

  if (user.length === 0) {
    throw Error("No user found");
  }
  return user[0];
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const id = params.id;
  const user = await getUserByUsername(id);
  return {
    title: `${user.username} | ChainLink`,
    description: `View ${user.username}'s ChainLink profile.`,
    openGraph: {
      images: [
        {
          url: `https://chainlink.st/api/share/streak/${user.id}`,
          width: 400,
          height: 200,
          alt: user.username ?? "User Profile Picture",
        },
      ],
      title: `${user.username} | ChainLink`,
      description: `View ${user.username}'s ChainLink profile.`,
      username: user.username,
      type: "profile",
      url: `https://chainlink.st/u/${user.username}`,
    },
  };
}

export default async function IdUserProfilePage({ params: { id } }: Props) {
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
