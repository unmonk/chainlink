import { getUserByUsername } from "@/lib/actions/users"
import { auth, currentUser } from "@clerk/nextjs"
import { Metadata, ResolvingMetadata } from "next"
import { redirect } from "next/navigation"

export async function generateMetadata(): Promise<Metadata> {
  const user = await currentUser()
  if (!user) {
    redirect("/")
  }

  return {
    title: `${user.username} | ChainLink`,
    description: `View ${user.username}'s ChainLink profile.`,
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
  }
}

export default async function UserProfilePage() {
  const user = await currentUser()
  if (!user) {
    redirect("/")
  } else {
    redirect("/u/" + user.username)
  }
}
