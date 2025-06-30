"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Id } from "@/convex/_generated/dataModel";

export const PickemCampaignsList = () => {
  const campaigns = useQuery(api.pickem.getActivePickemCampaigns, {
    league: "NFL",
  });
  const userCampaigns = useQuery(api.pickem.getUserPickemCampaigns);
  const joinCampaign = useMutation(api.pickem.joinPickemCampaign);

  const handleJoin = async (campaignId: string) => {
    try {
      await joinCampaign({ campaignId: campaignId as Id<"pickemCampaigns"> });
    } catch (error) {
      console.error("Error joining campaign:", error);
    }
  };

  if (!campaigns) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Active Pickem Campaigns</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign) => {
          const isJoined = userCampaigns?.some(
            (uc) => uc.campaign?._id === campaign._id
          );

          return (
            <Card key={campaign._id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{campaign.name}</span>
                  <Badge variant={isJoined ? "secondary" : "default"}>
                    {isJoined
                      ? "Joined"
                      : campaign.entryFee > 0
                        ? `${campaign.entryFee} coins`
                        : "Free"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {campaign.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>League:</span>
                    <span>{campaign.league}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span>{campaign.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scoring:</span>
                    <span>{campaign.scoringType}</span>
                  </div>
                </div>

                {!isJoined && (
                  <Button
                    onClick={() => handleJoin(campaign._id)}
                    className="w-full mt-4"
                  >
                    Join Campaign
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
