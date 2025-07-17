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
import { ColorPicker } from "@/components/ui/color-picker";

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
              className="flex flex-col h-full"
              style={{
                borderColor: campaign.sponsorInfo?.borderColor || undefined,
                borderWidth: campaign.sponsorInfo?.borderColor ? "2px" : "1px",
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
                    {campaign.entryFee > 0 && (
                      <span className="text-xs text-gray-500">Entry Fee</span>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="mt-auto pt-4">
                  {campaign.sponsorInfo && (
                    <Link
                      href={
                        campaign.sponsorInfo.website || "https://chainlink.st"
                      }
                      target="_blank"
                    >
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          {campaign.sponsorInfo.logo && (
                            <Image
                              src={campaign.sponsorInfo.logo}
                              alt={campaign.sponsorInfo.name}
                              width={64}
                              height={64}
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
                    </Link>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4 min-h-[2.5em] line-clamp-2">
                  {campaign.description || "\u00A0"}
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
                    <div className="flex gap-4">
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
                                      <Image
                                        src={prize.merch}
                                        alt={prize.description}
                                        width={16}
                                        height={16}
                                        className="rounded-sm"
                                      />
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
                                      <Image
                                        src={prize.merch}
                                        alt={prize.description}
                                        width={16}
                                        height={16}
                                        className="rounded-sm"
                                      />
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
                    <div className="flex justify-between">
                      <span>Prizes:</span>
                      <span className="text-gray-500">None</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-4">
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
