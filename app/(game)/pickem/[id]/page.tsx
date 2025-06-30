"use client";
import { ContentLayout } from "@/components/nav/content-layout";
import { PickemCampaignsList } from "@/components/pickem/pickem-campaigns-list";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { Users } from "lucide-react";
import { PickemWeeksList } from "@/components/pickem/pickem-weeks-list";

export default function PickemCampaignPage() {
  const { id } = useParams();

  const campaign = useQuery(api.pickem.getPickemCampaignById, {
    campaignId: id as Id<"pickemCampaigns">,
  });

  //check if user is joined
  const userCampaigns = useQuery(api.pickem.getUserPickemCampaigns);
  const isJoined = userCampaigns?.some(
    (uc) => uc.campaign?._id === campaign?._id
  );

  // Get participants for this campaign
  const participants = useQuery(api.pickem.getPickemLeaderboard, {
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
            <Badge variant={campaign.active ? "default" : "secondary"}>
              {campaign.active ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Campaign Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <PickemWeeksList campaignId={id as Id<"pickemCampaigns">} />
      </div>
    </ContentLayout>
  );
}
