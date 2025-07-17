"use client";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ContentLayout } from "@/components/nav/content-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Users,
  Trophy,
  Settings,
  Link2Icon,
  CoinsIcon,
  ExternalLink,
  Building2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Helper to format dates
function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Helper to format timestamps
function formatDateTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPickemCampaignPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const campaign = useQuery(api.pickem.getPickemCampaign, {
    campaignId: campaignId as any,
  });

  if (!campaign) {
    return (
      <ContentLayout title="Campaign Details">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg font-semibold">Loading campaign...</div>
          </div>
        </div>
      </ContentLayout>
    );
  }

  // Separate prizes by type
  const weeklyPrizes =
    campaign.prizes?.filter((prize) => prize.prizeType === "WEEKLY") || [];
  const seasonPrizes =
    campaign.prizes?.filter((prize) => prize.prizeType === "SEASON") || [];

  return (
    <ContentLayout title={`Campaign: ${campaign.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold">{campaign.name}</h1>
              <p className="text-gray-600">{campaign.description}</p>
            </div>
          </div>
        </div>

        {/* Campaign Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold"></span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold"></span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Eliminated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-red-500" />
                <span className="text-2xl font-bold"></span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Entry Fee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CoinsIcon className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">{campaign.entryFee}</span>
                <span className="text-sm text-gray-500">🔗Links</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sponsor Information */}
        {campaign.sponsorInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Sponsor Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                {campaign.sponsorInfo.logo && (
                  <div className="flex-shrink-0">
                    <Image
                      src={campaign.sponsorInfo.logo}
                      alt={campaign.sponsorInfo.name || "Sponsor Logo"}
                      width={80}
                      height={80}
                      className="rounded-lg border"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {campaign.sponsorInfo.name}
                    </h3>
                    {campaign.sponsorInfo.description && (
                      <p className="text-gray-600 mt-1">
                        {campaign.sponsorInfo.description}
                      </p>
                    )}
                  </div>
                  {campaign.sponsorInfo.website && (
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="h-4 w-4 text-gray-500" />
                      <a
                        href={campaign.sponsorInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Campaign Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Campaign Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    League
                  </label>
                  <p className="text-lg">{campaign.league}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Type
                  </label>
                  <p className="text-lg">{campaign.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Scoring
                  </label>
                  <p className="text-lg">{campaign.scoringType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Private
                  </label>
                  <p className="text-lg">{campaign.isPrivate ? "Yes" : "No"}</p>
                </div>
                {campaign.isPrivate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Private Code
                    </label>
                    <p className="text-lg bg-accent p-2 rounded-md text-center">
                      {campaign.privateCode}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Campaign Dates
                </label>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(campaign.startDate)} -{" "}
                    {formatDate(campaign.endDate)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4"></div>

              {campaign.settings?.confidencePoints && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Confidence Points
                  </label>
                  <p className="text-sm">Enabled</p>
                </div>
              )}

              {campaign.maxParticipants && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Max Participants
                  </label>
                  <p className="text-sm">{campaign.maxParticipants}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Prizes - Weekly and Season */}
        {campaign.prizes && campaign.prizes.length > 0 && (
          <div className="space-y-6">
            {/* Weekly Prizes */}
            {weeklyPrizes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5" />
                    <span>Weekly Prizes</span>
                    <Badge variant="secondary">Weekly</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {weeklyPrizes.map((prize, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{prize.place}</Badge>
                          <span className="font-semibold">
                            {prize.coins} 🔗Links
                          </span>
                        </div>
                        {prize.description && (
                          <p className="text-sm text-gray-600">
                            {prize.description}
                          </p>
                        )}
                        {prize.merch && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">
                              Merchandise:
                            </p>
                            <p className="text-sm font-medium">{prize.merch}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Season Prizes */}
            {seasonPrizes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5" />
                    <span>Season Prizes</span>
                    <Badge variant="secondary">Season</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {seasonPrizes.map((prize, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{prize.place}</Badge>
                          <span className="font-semibold">
                            {prize.coins} 🔗Links
                          </span>
                        </div>
                        {prize.description && (
                          <p className="text-sm text-gray-600">
                            {prize.description}
                          </p>
                        )}
                        {prize.merch && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">
                              Merchandise:
                            </p>
                            <p className="text-sm font-medium">{prize.merch}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Leaderboard Preview */}
        {/* {leaderboard && leaderboard.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboard.slice(0, 10).map((participant, index) => (
                  <div
                    key={participant._id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold">#{index + 1}</span>
                      <div className="flex items-center space-x-2">
                        {participant.user?.image && (
                          <img
                            src={participant.user.image}
                            alt={participant.user.name}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <span>{participant.user?.name || "Unknown User"}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>{participant.totalPoints} pts</span>
                      <span className="text-gray-500">
                        {participant.correctPicks}W /{" "}
                        {participant.incorrectPicks}L
                        {participant.pushedPicks > 0 &&
                          ` / ${participant.pushedPicks}P`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Link href={`/admin/pickem/campaigns/${campaignId}/edit`}>
            <Button variant="outline">Edit Campaign</Button>
          </Link>
          <Link href={`/admin/pickem/campaigns/${campaignId}/matchups`}>
            <Button variant="outline">Manage Matchups</Button>
          </Link>
        </div>
      </div>
    </ContentLayout>
  );
}
