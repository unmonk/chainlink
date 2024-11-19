"use client";

import { Separator } from "@/components/ui/separator";
import { ContentLayout } from "@/components/nav/content-layout";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const exampleMatchup = {
  _id: "1" as Id<"matchups">,
  _creationTime: Date.now(),
  active: true,
  awayTeam: {
    id: "2349",
    image: "https://a.espncdn.com/i/teamlogos/ncaa/500/2349.png",
    name: "River Hawks",
    score: 0,
  },
  cost: 0,
  featured: true,
  featuredType: "CHAINBUILDER" as const,
  gameId: "401715432",
  homeTeam: {
    id: "264",
    image: "https://a.espncdn.com/i/teamlogos/ncaa/500/264.png",
    name: "Huskies",
    score: 0,
  },
  league: "MBB",
  metadata: { network: "B1G+", statusDetails: "1:33 - 1st Half" },
  startTime: 1731900600000,
  status: "STATUS_IN_PROGRESS" as const,
  title: "Who will win? River Hawks @ Huskies",
  type: "SCORE" as const,
  typeDetails: "GREATER_THAN" as const,
  homePicks: 3,
  awayPicks: 8,
};

const exampleMatchup2 = {
  _id: "2" as Id<"matchups">,
  _creationTime: Date.now(),
  active: true,
  awayTeam: {
    id: "2349",
    image: "https://a.espncdn.com/i/teamlogos/ncaa/500/2349.png",
    name: "River Hawks",
    score: 0,
  },
  cost: 0,
  featured: true,
  featuredType: "CHAINBUILDER" as const,
  gameId: "401715432",
  homeTeam: {
    id: "264",
    image: "https://a.espncdn.com/i/teamlogos/ncaa/500/264.png",
    name: "Huskies",
    score: 0,
  },
  league: "MBB",
  metadata: { network: "B1G+", statusDetails: "1:33 - 1st Half" },
  startTime: 1731900600000,
  status: "STATUS_SCHEDULED" as const,
  title: "Who will win? River Hawks @ Huskies",
  type: "SCORE" as const,
  typeDetails: "GREATER_THAN" as const,
  homePicks: 2,
  awayPicks: 2,
};

const userPickWithMatchup = {
  _id: "1" as Id<"picks">,
  matchup: exampleMatchup,
  _creationTime: Date.now(),
  active: true,
  status: "STATUS_IN_PROGRESS" as const,
  userId: "jh78f04cqrc5fcepykqh9w022n6pfpxt" as Id<"users">,
  campaignId: "1" as Id<"campaigns">,
  externalId: "1",
  matchupId: "1" as Id<"matchups">,
  homePicks: 3,
  awayPicks: 8,
  pick: {
    id: "2349",
    name: "River Hawks",
    image: "https://a.espncdn.com/i/teamlogos/ncaa/500/2349.png",
  },
};

export default function AdminTestPage() {
  return (
    <ContentLayout title="Admin Test Page">
      <div className="p-4">
        <h1>Admin Test Page</h1>
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-3 gap-4 items-center my-2">
            <Avatar hasGlow cosmetic="gold" height="h-28" width="w-28">
              <AvatarFallback>JH</AvatarFallback>
              <AvatarImage src="/images/ad3.png" />
            </Avatar>
            <Avatar hasGlow cosmetic="silver" height="h-28" width="w-28">
              <AvatarFallback>JH</AvatarFallback>
              <AvatarImage src="/images/ad3.png" />
            </Avatar>
            <Avatar hasGlow cosmetic="bronze" height="h-28" width="w-28">
              <AvatarFallback>JH</AvatarFallback>
              <AvatarImage src="/images/ad3.png" />
            </Avatar>
          </div>
          <Separator orientation="horizontal" className="my-4" />
          <div className="grid grid-cols-3 gap-4 items-center my-2">
            <Avatar hasGlow cosmetic="celestial" height="h-28" width="w-28">
              <AvatarFallback>JH</AvatarFallback>
              <AvatarImage src="/images/ad3.png" />
            </Avatar>
            <Avatar hasGlow cosmetic="inferno" height="h-28" width="w-28">
              <AvatarFallback>JH</AvatarFallback>
              <AvatarImage src="/images/ad3.png" />
            </Avatar>
            <Avatar hasGlow cosmetic="forest" height="h-28" width="w-28">
              <AvatarFallback>JH</AvatarFallback>
              <AvatarImage src="/images/ad3.png" />
            </Avatar>
            <Avatar hasGlow cosmetic="ocean" height="h-28" width="w-28">
              <AvatarFallback>JH</AvatarFallback>
              <AvatarImage src="/images/ad3.png" />
            </Avatar>
            <Avatar hasGlow cosmetic="galaxy" height="h-28" width="w-28">
              <AvatarFallback>JH</AvatarFallback>
              <AvatarImage src="/images/ad3.png" />
            </Avatar>
            <Avatar hasGlow cosmetic="usa" height="h-28" width="w-28">
              <AvatarFallback>JH</AvatarFallback>
              <AvatarImage src="/images/ad3.png" />
            </Avatar>
          </div>
          <Separator orientation="horizontal" className="my-4" />
          <div className="grid grid-cols-3 gap-4 items-center my-2">
            <Avatar
              hasGlow
              cosmetic="mod"
              height="h-28"
              width="w-28"
              title="Mod"
            >
              <AvatarFallback>JH</AvatarFallback>
              <AvatarImage src="/images/ad3.png" />
            </Avatar>
            <Avatar
              hasGlow
              cosmetic="premium"
              height="h-28"
              width="w-28"
              title="Premium"
            >
              <AvatarFallback>JH</AvatarFallback>
              <AvatarImage src="/images/ad3.png" />
            </Avatar>
            <Avatar
              hasGlow
              cosmetic="admin"
              height="h-28"
              width="w-28"
              title="Admin"
            >
              <AvatarFallback>JH</AvatarFallback>
              <AvatarImage src="/images/ad3.png" />
            </Avatar>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
