"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Helper to format dates
function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString();
}

export const AdminPickemList = () => {
  // Fetch all pickem campaigns (admin view: show all, not just active)
  const campaigns = useQuery(api.pickem.getAllPickemCampaigns, {});
  const participants = useQuery(api.pickem.getAllPickemParticipants, {});

  if (!campaigns || !participants) return <div>Loading...</div>;

  // Map campaignId to participant count
  const participantCounts: Record<string, number> = {};
  for (const p of participants) {
    const cid = p.campaignId;
    participantCounts[cid] = (participantCounts[cid] || 0) + 1;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign: any) => (
          <Link
            key={campaign._id}
            href={`/admin/pickem/campaigns/${campaign._id}`}
            className="block hover:shadow-lg transition-shadow"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{campaign.name}</span>
                  <Badge variant={campaign.active ? "default" : "secondary"}>
                    {campaign.active ? "Active" : "Inactive"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm mb-2">
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
                  <div className="flex justify-between">
                    <span>Start:</span>
                    <span>{formatDate(campaign.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>End:</span>
                    <span>{formatDate(campaign.endDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Participants:</span>
                    <span>{participantCounts[campaign._id] || 0}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Click for admin details</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
