"use client";
import { ContentLayout } from "@/components/nav/content-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { Users, Trophy, Calendar } from "lucide-react";
import { PickemWeeksList } from "@/components/pickem/pickem-weeks-list";
import { PickemLeaderboard } from "@/components/pickem/pickem-leaderboard";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PickemCampaignPage() {
  const { id } = useParams();

  const campaign = useQuery(api.pickem.getPickemCampaign, {
    campaignId: id as Id<"pickemCampaigns">,
  });

  //check if user is joined
  const userCampaigns = useQuery(api.pickem.getUserPickemCampaigns);
  const isJoined = userCampaigns?.some(
    (uc) => uc.campaign?._id === campaign?._id
  );

  // Get participants for this campaign
  const participants = useQuery(api.pickem.getPickemParticipantsByCampaign, {
    campaignId: id as Id<"pickemCampaigns">,
  });

  if (!campaign || !userCampaigns === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loading />
      </div>
    );
  }

  if (!isJoined) {
    return (
      <div>
        You have not joined this Pickem campaign yet, or it does not exist.{" "}
      </div>
    );
  }

  return (
    <ContentLayout title="Pick'em">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold">{campaign.name}</h1>
                <p className="text-gray-600">{campaign.description}</p>
              </div>
            </div>
          </div>

          {/* Campaign Info Cards */}
          <div className="space-y-4 md:space-y-0">
            {/* Mobile: Simple Participants Display */}
            <div className="md:hidden flex items-center justify-center py-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="font-medium">
                  {participants?.length || 0} participants
                </span>
              </div>
            </div>

            {/* Desktop: All 4 Cards */}
            <div className="hidden md:grid md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    League
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold">{campaign.league}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold">{campaign.type}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Scoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold">
                      {campaign.scoringType}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Participants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="text-xl font-bold">
                      {participants?.length || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Tabs for Weeks and Leaderboard */}
        <div className="mt-8">
          <Tabs defaultValue="weeks" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weeks" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Weeks
              </TabsTrigger>
              <TabsTrigger
                value="leaderboard"
                className="flex items-center gap-2"
              >
                <Trophy className="h-4 w-4" />
                Leaderboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weeks" className="mt-6">
              <Suspense fallback={<Loading />}>
                <PickemWeeksList campaignId={id as Id<"pickemCampaigns">} />
              </Suspense>
            </TabsContent>

            <TabsContent value="leaderboard" className="mt-6">
              <Suspense fallback={<Loading />}>
                <PickemLeaderboard campaignId={id as Id<"pickemCampaigns">} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ContentLayout>
  );
}
