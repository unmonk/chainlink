"use client";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ContentLayout } from "@/components/nav/content-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Users, Trophy, Settings } from "lucide-react";
import Link from "next/link";

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

  const campaign = useQuery(api.pickem.getPickemCampaignById, {
    campaignId: campaignId as any,
  });

  const participants = useQuery(api.pickem.getAllPickemParticipants, {});
  const leaderboard = useQuery(api.pickem.getPickemLeaderboard, {
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

  // Count participants for this campaign
  const participantCount =
    participants?.filter((p) => p.campaignId === campaignId).length || 0;

  // Calculate campaign statistics
  const activeParticipants =
    participants?.filter(
      (p) => p.campaignId === campaignId && p.active && !p.eliminated
    ).length || 0;

  const eliminatedParticipants =
    participants?.filter((p) => p.campaignId === campaignId && p.eliminated)
      .length || 0;

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
          <Badge variant={campaign.active ? "default" : "secondary"}>
            {campaign.active ? "Active" : "Inactive"}
          </Badge>
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
                <span className="text-2xl font-bold">{participantCount}</span>
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
                <span className="text-2xl font-bold">{activeParticipants}</span>
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
                <span className="text-2xl font-bold">
                  {eliminatedParticipants}
                </span>
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
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">{campaign.entryFee}</span>
                <span className="text-sm text-gray-500">🔗Links</span>
              </div>
            </CardContent>
          </Card>
        </div>

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
                    Featured
                  </label>
                  <Badge variant={campaign.featured ? "default" : "secondary"}>
                    {campaign.featured ? "Yes" : "No"}
                  </Badge>
                </div>
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

              {campaign.weekStartDate && campaign.weekEndDate && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Current Week
                  </label>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(campaign.weekStartDate)} -{" "}
                      {formatDate(campaign.weekEndDate)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Campaign Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Allow Ties
                  </label>
                  <p className="text-sm">
                    {campaign.settings.allowTies ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Include Playoffs
                  </label>
                  <p className="text-sm">
                    {campaign.settings.includePlayoffs ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Include Preseason
                  </label>
                  <p className="text-sm">
                    {campaign.settings.includePreseason ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Drop Lowest Weeks
                  </label>
                  <p className="text-sm">
                    {campaign.settings.dropLowestWeeks || "None"}
                  </p>
                </div>
              </div>

              {campaign.settings.confidencePoints && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Confidence Points
                  </label>
                  <p className="text-sm">Enabled</p>
                </div>
              )}

              {campaign.settings.pointSpreads && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Point Spreads
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

        {/* Prizes */}
        {campaign.prizes && campaign.prizes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Prizes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {campaign.prizes.map((prize, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{prize.place}</Badge>
                      <span className="font-semibold">
                        {prize.coins} 🔗Links
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{prize.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard Preview */}
        {leaderboard && leaderboard.length > 0 && (
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
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Link href={`/admin/pickem/campaigns/${campaignId}/edit`}>
            <Button variant="outline">Edit Campaign</Button>
          </Link>
          <Button variant="outline">View All Participants</Button>
          <Link href={`/admin/pickem/campaigns/${campaignId}/matchups`}>
            <Button variant="outline">Manage Matchups</Button>
          </Link>
          <Button variant="outline">Export Data</Button>
        </div>
      </div>
    </ContentLayout>
  );
}
