"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Trophy,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export function PickemAdminDashboard() {
  const activeCampaigns = useQuery(
    api.pickem.getActivePickemCampaignsWithCounts,
    {}
  );
  const allCampaigns = useQuery(api.pickem.getAllPickemCampaigns, {});

  if (!activeCampaigns || !allCampaigns) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        Loading...
      </div>
    );
  }

  const totalParticipants = activeCampaigns.reduce(
    (sum, campaign) => sum + (campaign.participantCounts?.total || 0),
    0
  );
  const totalActiveParticipants = activeCampaigns.reduce(
    (sum, campaign) => sum + (campaign.participantCounts?.withPicks || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Campaigns
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              out of {allCampaigns.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Participants
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipants}</div>
            <p className="text-xs text-muted-foreground">
              {totalActiveParticipants} with picks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Participation
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeCampaigns.length > 0
                ? Math.round(totalActiveParticipants / activeCampaigns.length)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">per active campaign</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Campaigns Needing Attention
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                activeCampaigns.filter(
                  (c) => (c.participantCounts?.withPicks || 0) === 0
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              no participants with picks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeCampaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {campaign.league} • {campaign.type}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {campaign.participantCounts?.total || 0} participants
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {campaign.participantCounts?.withPicks || 0} with picks
                  </span>
                  <Link href={`/admin/pickem/campaigns/${campaign._id}`}>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
