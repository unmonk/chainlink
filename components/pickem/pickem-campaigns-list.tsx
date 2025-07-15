"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import Image from "next/image";
import { Users } from "lucide-react";

export const PickemCampaignsList = () => {
  const campaigns = useQuery(api.pickem.getActivePickemCampaignsWithCounts, {
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
            <Card key={campaign._id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{campaign.name}</span>
                  <Badge variant={isJoined ? "secondary" : "default"}>
                    {isJoined
                      ? "Joined"
                      : campaign.entryFee > 0
                        ? `🔗 ${campaign.entryFee} Links`
                        : "Free"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <p className="text-sm text-gray-600 mb-4">
                  {campaign.description}
                </p>

                {/* Participant Count */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>
                      {campaign.participantCounts?.withPicks || 0} /{" "}
                      {campaign.participantCounts?.total || 0} participants
                    </span>
                  </div>
                </div>

                {campaign.sponsorInfo && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      {campaign.sponsorInfo.logo && (
                        <Image
                          src={campaign.sponsorInfo.logo}
                          alt={campaign.sponsorInfo.name}
                          width={24}
                          height={24}
                          className="rounded-sm"
                        />
                      )}
                      <span className="font-medium">
                        Sponsored by {campaign.sponsorInfo.name}
                      </span>
                    </div>
                    {campaign.sponsorInfo.description && (
                      <p className="text-sm text-gray-600">
                        {campaign.sponsorInfo.description}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2 text-sm flex-1">
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
                  {campaign.prizes && campaign.prizes.length > 0 ? (
                    <div className="flex justify-between">
                      <span>Prizes:</span>
                      <div className="flex flex-col gap-1">
                        {campaign.prizes.slice(0, 3).map((prize, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="flex justify-between w-24"
                          >
                            <span>#{index + 1}</span>
                            <span title={prize.description}>
                              {prize.merch ? (
                                <div className="flex items-center gap-1">
                                  <Image
                                    src={prize.merch}
                                    alt={prize.description}
                                    width={16}
                                    height={16}
                                    className="rounded-sm"
                                  />
                                  {prize.coins}🔗
                                </div>
                              ) : (
                                `${prize.coins}🔗`
                              )}
                            </span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span>Prizes:</span>
                      <span className="text-gray-500">None</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-4">
                  {!isJoined && (
                    <Button
                      onClick={() => handleJoin(campaign._id)}
                      className="w-full"
                    >
                      Join Campaign
                    </Button>
                  )}
                  {isJoined && (
                    <Link href={`/pickem/${campaign._id}`}>
                      <Button className="w-full">Play Pick&apos;em</Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
