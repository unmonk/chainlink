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
  LinkIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PrizeDistributionAdmin } from "@/components/admin/pickem/prize-distribution-admin";
import { Id } from "@/convex/_generated/dataModel";
import { Link1Icon } from "@radix-ui/react-icons";
import { PickemCampaignAdmin } from "@/components/admin/pickem/pickem-campaign-admin";
import { CampaignMatchupsList } from "@/components/admin/pickem/campaign-matchups-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface CampaignDetailPageProps {
  params: {
    id: Id<"pickemCampaigns">;
  };
}

export default function CampaignDetailPage({
  params,
}: CampaignDetailPageProps) {
  return (
    <ContentLayout title="Pickem Campaign Details">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Campaign Management</h1>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="matchups">Matchups</TabsTrigger>
            <TabsTrigger value="prizes">Prizes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <PickemCampaignAdmin campaignId={params.id} />
          </TabsContent>

          <TabsContent value="matchups" className="space-y-4">
            <CampaignMatchupsList campaignId={params.id} />
          </TabsContent>

          <TabsContent value="prizes" className="space-y-4">
            <PrizeDistributionAdmin campaignId={params.id} />
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  );
}
