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
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const PickemCampaignsList = () => {
  const campaigns = useQuery(api.pickem.getActivePickemCampaignsWithCounts);
  const userCampaigns = useQuery(api.pickem.getUserPickemCampaigns);
  const joinCampaign = useMutation(api.pickem.joinPickemCampaign);

  const [modalOpen, setModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joiningCampaignId, setJoiningCampaignId] = useState<string | null>(
    null
  );

  const handleJoin = async (campaignId: string, privateCode?: string) => {
    try {
      setJoinError(null);
      await joinCampaign({
        campaignId: campaignId as Id<"pickemCampaigns">,
        privateCode,
      });
      setModalOpen(false);
      setJoinCode("");
    } catch (error: any) {
      setJoinError(error?.message || "Error joining campaign");
    }
  };

  if (!campaigns) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Active Pickem Campaigns</h2>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Private Code</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Private code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            autoFocus
          />
          {joinError && (
            <div className="text-red-500 text-sm mt-2">{joinError}</div>
          )}
          <DialogFooter>
            <Button
              onClick={() =>
                joiningCampaignId && handleJoin(joiningCampaignId, joinCode)
              }
              className="w-full"
            >
              Join
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign) => {
          const isJoined = userCampaigns?.some(
            (uc) => uc.campaign?._id === campaign._id
          );

          return (
            <Card
              key={campaign._id}
              className="flex flex-col h-full transition-all duration-200 hover:shadow-lg"
              style={{
                borderColor: campaign.sponsorInfo?.borderColor || undefined,
                borderWidth: campaign.sponsorInfo?.borderColor ? "2px" : "1px",
                boxShadow: campaign.sponsorInfo?.borderColor
                  ? `0 4px 6px -1px ${campaign.sponsorInfo.borderColor}20, 0 2px 4px -1px ${campaign.sponsorInfo.borderColor}10`
                  : undefined,
              }}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{campaign.name}</span>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge variant={isJoined ? "secondary" : "default"}>
                      {isJoined
                        ? "Joined"
                        : campaign.entryFee > 0
                          ? `🔗 ${campaign.entryFee} Links`
                          : "Free"}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                {/* Sponsor Section - Move to top for consistent positioning */}
                {campaign.sponsorInfo && (
                  <Link
                    href={
                      campaign.sponsorInfo.website || "https://chainlink.st"
                    }
                    target="_blank"
                    className="block mb-4"
                  >
                    <div
                      className="p-3 rounded-lg transition-colors hover:bg-gray-50"
                      style={{
                        border: `1px solid ${campaign.sponsorInfo.borderColor}30`,
                        backgroundColor: `${campaign.sponsorInfo.borderColor}05`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {campaign.sponsorInfo.logo && (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border">
                            <Image
                              src={campaign.sponsorInfo.logo}
                              alt={campaign.sponsorInfo.name}
                              fill
                              className="object-contain p-1"
                              onError={(e) => {
                                // Hide broken image
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <span
                            className="font-medium text-sm"
                            style={{
                              color: campaign.sponsorInfo.borderColor,
                            }}
                          >
                            Sponsored by {campaign.sponsorInfo.name}
                          </span>
                        </div>
                      </div>
                      {campaign.sponsorInfo.description && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {campaign.sponsorInfo.description}
                        </p>
                      )}
                    </div>
                  </Link>
                )}

                {/* Campaign Description */}
                <p className="text-sm text-gray-600 mb-4 min-h-[2.5em] line-clamp-2">
                  {campaign.description}
                </p>

                {/* Participant Count */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>
                      {campaign.participantCounts?.total || 0} participants
                    </span>
                  </div>
                </div>

                {/* Campaign Details - Consistent spacing */}
                <div className="space-y-2 text-sm mb-4">
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

                {/* Prizes Section - Consistent layout */}
                {campaign.prizes && campaign.prizes.length > 0 ? (
                  <div className="flex gap-4 mb-4">
                    {/* Weekly Prizes List */}
                    <div className="flex-1">
                      <div className="font-semibold mb-1">Weekly Prizes</div>
                      <div className="flex flex-col gap-1">
                        {campaign.prizes
                          .filter((prize) => prize.prizeType === "WEEKLY")
                          .slice(0, 3)
                          .map((prize, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="flex items-center justify-between w-32"
                            >
                              <span>#{index + 1}</span>
                              <span title={prize.description}>
                                {prize.merch ? (
                                  <span className="flex items-center gap-1">
                                    <div className="relative w-4 h-4">
                                      <Image
                                        src={prize.merch}
                                        alt={prize.description}
                                        fill
                                        className="object-contain rounded-sm"
                                        onError={(e) => {
                                          // Hide broken image
                                          const target =
                                            e.target as HTMLImageElement;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                    {prize.coins}🔗
                                  </span>
                                ) : (
                                  `${prize.coins}🔗`
                                )}
                              </span>
                            </Badge>
                          ))}
                        {campaign.prizes.filter(
                          (prize) => prize.prizeType === "WEEKLY"
                        ).length === 0 && (
                          <span className="text-gray-500 text-sm">None</span>
                        )}
                      </div>
                    </div>
                    {/* Season Prizes List */}
                    <div className="flex-1">
                      <div className="font-semibold mb-1">Season Prizes</div>
                      <div className="flex flex-col gap-1">
                        {campaign.prizes
                          .filter((prize) => prize.prizeType === "SEASON")
                          .slice(0, 3)
                          .map((prize, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="flex items-center justify-between w-32"
                            >
                              <span>#{index + 1}</span>
                              <span title={prize.description}>
                                {prize.merch ? (
                                  <span className="flex items-center gap-1">
                                    <div className="relative w-4 h-4">
                                      <Image
                                        src={prize.merch}
                                        alt={prize.description}
                                        fill
                                        className="object-contain rounded-sm"
                                        onError={(e) => {
                                          // Hide broken image
                                          const target =
                                            e.target as HTMLImageElement;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                    {prize.coins}🔗
                                  </span>
                                ) : (
                                  `${prize.coins}🔗`
                                )}
                              </span>
                            </Badge>
                          ))}
                        {campaign.prizes.filter(
                          (prize) => prize.prizeType === "SEASON"
                        ).length === 0 && (
                          <span className="text-gray-500 text-sm">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between mb-4">
                    <span>Prizes:</span>
                    <span className="text-gray-500">None</span>
                  </div>
                )}

                {/* Action Button - Consistent positioning */}
                <div className="mt-auto">
                  {!isJoined && (
                    <Button
                      onClick={() => {
                        if (campaign.isPrivate) {
                          setJoiningCampaignId(campaign._id);
                          setModalOpen(true);
                        } else {
                          handleJoin(campaign._id);
                        }
                      }}
                      className="w-full"
                      style={{
                        backgroundColor: campaign.sponsorInfo?.borderColor,
                        borderColor: campaign.sponsorInfo?.borderColor,
                      }}
                    >
                      Join Campaign
                    </Button>
                  )}
                  {isJoined && (
                    <Link href={`/pickem/${campaign._id}`}>
                      <Button
                        className="w-full"
                        style={{
                          backgroundColor: campaign.sponsorInfo?.borderColor,
                          borderColor: campaign.sponsorInfo?.borderColor,
                        }}
                      >
                        Play Pick&apos;em
                      </Button>
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
