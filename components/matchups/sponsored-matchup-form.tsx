"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

interface SponsoredMatchupFormProps {
  onChange: (sponsoredData: { sponsorId: string }) => void;
  initialData?: {
    sponsorId: string;
  };
}

export function SponsoredMatchupForm({
  onChange,
  initialData,
}: SponsoredMatchupFormProps) {
  const sponsors = useQuery(api.sponsors.listFeatured);

  return (
    <div className="space-y-4 p-4 bg-accent/20 rounded-lg">
      <h3 className="text-lg font-semibold">Sponsored Matchup Details</h3>

      <div className="grid gap-2">
        <Label htmlFor="sponsorId">Select Sponsor</Label>
        <Select
          value={initialData?.sponsorId || ""}
          onValueChange={(value) => onChange({ sponsorId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a sponsor" />
          </SelectTrigger>
          <SelectContent>
            {sponsors?.map((sponsor) => (
              <SelectItem key={sponsor._id} value={sponsor._id}>
                <div className="flex items-center gap-2">
                  {sponsor.image && (
                    <Image
                      src={sponsor.image}
                      alt={sponsor.name}
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  {sponsor.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
