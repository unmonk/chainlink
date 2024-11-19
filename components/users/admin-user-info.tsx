import { api } from "@/convex/_generated/api";
import { User } from "@clerk/nextjs/server";
import { useQuery } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, CalendarDays, ShieldCheck, Ban } from "lucide-react";
import { Trophy } from "lucide-react";
import { LinkIcon } from "lucide-react";
import Link from "next/link";
import { AdminUserActions } from "./admin-user-actions";
import AdminUserStats from "./admin-user-stats";
import { GiCard2Spades } from "react-icons/gi";
import { Doc } from "@/convex/_generated/dataModel";
import { COSMETIC_STYLE } from "@/lib/utils";

export function AdminUserInfo({
  user,
  convexUser,
}: {
  user: User | null;
  convexUser: Doc<"users"> | null;
}) {
  if (!user) return null;

  if (!convexUser) return null;

  const formatDistance = (date: number) => {
    //get 24 hours after coinGames.lastFreeSpin
    const date24Hours = new Date(date + 24 * 60 * 60 * 1000);
    return formatDistanceToNow(date24Hours, { addSuffix: true });
  };

  const stats = [
    {
      title: "Links",
      value: convexUser.coins || 0,
      icon: LinkIcon,
      description: "Total links",
      href: false,
    },
    {
      title: "Achievements",
      value: convexUser.achievements?.length || 0,
      icon: Trophy,
      description: "Total earned",
      href: `/u/${user.username}/achievements`,
    },
    {
      title: "Two Factor Enabled",
      value: user.twoFactorEnabled ? "Yes" : "No",
      icon: ShieldCheck,
      description: "Two factor authentication enabled",
      href: false,
    },
    {
      title: "Banned",
      value: user.banned ? "Yes" : "No",
      icon: Ban,
      description: "User is banned",
      href: false,
    },
    {
      title: "Slots",
      value: `${convexUser.coinGames?.lastFreeSpin ? formatDistance(convexUser.coinGames?.lastFreeSpin) : "Not yet played"}`,
      icon: GiCard2Spades,
      description: "Next free spin",
      href: false,
    },
  ];

  return (
    <div className="space-y-6 mt-4">
      {/* Clerk User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-x-4">
            <Avatar
              height="h-12"
              width="w-12"
              hasGlow={!!convexUser.metadata?.avatarBackground}
              cosmetic={convexUser.metadata?.avatarBackground as COSMETIC_STYLE}
            >
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback>
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl">{user.username}</h2>
              <p className="text-sm text-muted-foreground">
                Clerk ID: {user.id}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <div className="space-y-2">
              {user.emailAddresses.map((email) => (
                <div key={email.id} className="flex items-center gap-x-2">
                  <span>{email.emailAddress}</span>
                  {email.verification?.status === "verified" && (
                    <Badge variant="secondary">Verified</Badge>
                  )}
                </div>
              ))}
              {user.phoneNumbers.map((phone) => (
                <div key={phone.id}>{phone.phoneNumber}</div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Account Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Created</p>
                <p>
                  {formatDistanceToNow(new Date(user.createdAt ?? 0), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Sign In</p>
                <p>
                  {formatDistanceToNow(new Date(user.lastSignInAt ?? 0), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Username</p>
                <p>{user.username}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge variant={user.banned ? "destructive" : "default"}>
                  {user.banned ? "Banned" : "Active"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-3">
              <div className="flex items-center gap-x-2">
                <stat.icon className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium">{stat.title}</span>
              </div>
              <div className="mt-2">
                <div className="text-lg font-bold">{stat.value}</div>
                <p className="text-[10px] text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Convex User Info */}
      <Card>
        <CardHeader>
          <CardTitle>Convex User Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">User Data</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Convex ID</p>
                <p className="text-ellipsis text-xs max-w-[100px] overflow-hidden">
                  {convexUser._id}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Notification Devices</p>
                {typeof user.privateMetadata === "object" &&
                "pushSubscriptions" in user.privateMetadata &&
                Array.isArray(user.privateMetadata.pushSubscriptions) ? (
                  <p>{user.privateMetadata.pushSubscriptions.length}</p>
                ) : (
                  <p>0</p>
                )}
              </div>
              <div>
                <p className="text-muted-foreground">Role</p>
                <Badge variant="outline">{convexUser.role || "user"}</Badge>
              </div>
              {/* Add any other Convex-specific fields you have */}
              {Object.entries(convexUser)
                .filter(
                  ([key]) => !["_id", "role", "_creationTime"].includes(key)
                )
                .map(([key, value]) => (
                  <div key={key}>
                    <p className="text-muted-foreground">{key}</p>
                    {key === "friends" && <FriendsTag friends={value} />}
                    {key === "coins" && <CoinsTag coins={value} />}
                    {key === "coinGames" && <CoinGamesTag coinGames={value} />}
                    {key === "image" && <ImageTag image={value} />}
                    {key === "achievements" && (
                      <AchievementTag achievements={value} />
                    )}
                    {key === "email" && <span>{value}</span>}
                    {key === "name" && <span>{value}</span>}
                    {key === "status" && (
                      <Badge variant="outline">{value}</Badge>
                    )}
                    {key === "tokenIdentifier" && (
                      <p className="text-ellipsis text-xs max-w-[100px] overflow-hidden">
                        {value}
                      </p>
                    )}
                    {key === "externalId" && (
                      <p className="text-ellipsis text-xs max-w-[100px] overflow-hidden">
                        {value}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const FriendsTag = ({ friends }: { friends: string[] }) => {
  return <Badge variant="outline">{friends.length}</Badge>;
};
const CoinsTag = ({ coins }: { coins: number }) => {
  return <Badge variant="outline">🔗{coins}</Badge>;
};

const CoinGamesTag = ({
  coinGames,
}: {
  coinGames: { lastFreeSpin: number; lastSlotSpin: number };
}) => {
  return (
    <div className="">
      <Badge variant="outline">
        🎰
        {coinGames.lastSlotSpin
          ? formatDistanceToNow(coinGames.lastSlotSpin)
          : "Not yet played"}
      </Badge>
      <Badge variant="outline">
        🔄
        {coinGames.lastFreeSpin
          ? formatDistanceToNow(coinGames.lastFreeSpin)
          : "Not yet played"}
      </Badge>
    </div>
  );
};

const ImageTag = ({ image }: { image: string }) => {
  return (
    <Link href={image} target="_blank" passHref>
      <Badge variant="outline">🖼️</Badge>
    </Link>
  );
};

const AchievementTag = ({ achievements }: { achievements: string[] }) => {
  return <Badge variant="outline">🏆 {achievements.length}</Badge>;
};
