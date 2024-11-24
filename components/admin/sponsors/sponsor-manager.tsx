"use client";

import * as React from "react";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { Check, GalleryHorizontalEnd, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { SearchSponsor } from "./search-sponsor";

export default function SponsorManager() {
  const [changed, setChanged] = React.useState(false);
  const [tempSponsors, setTempSponsors] = React.useState<Doc<"sponsors">[]>([]);

  const sponsorsQuery = useQuery(api.sponsors.listFeatured);
  const sponsors = React.useMemo(() => sponsorsQuery || [], [sponsorsQuery]);
  const updateSponsors = useMutation(api.sponsors.updateOrder);
  const toggleActive = useMutation(api.sponsors.toggle);
  const toggleFeatured = useMutation(api.sponsors.toggleFeatured);

  React.useEffect(() => {
    if (sponsors) {
      setTempSponsors(sponsors);
    }
  }, [sponsors]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    const newSponsors = [...tempSponsors];
    const [removed] = newSponsors.splice(dragIndex, 1);
    newSponsors.splice(dropIndex, 0, removed);

    // Update order numbers starting from 1
    const updatedSponsors = newSponsors.map((sponsor, index) => ({
      ...sponsor,
      order: index + 1, // Ensure order starts from 1
    }));

    setTempSponsors(updatedSponsors);
    setChanged(true);
  };

  const handleToggleActive = async (id: Id<"sponsors">) => {
    await toggleActive({ id });
    setChanged(false);
  };

  const handleToggleFeatured = async (id: Id<"sponsors">) => {
    await toggleFeatured({ id });
    setChanged(false);
  };

  function getGridClass(sponsorCount: number) {
    switch (sponsorCount) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 4:
        return "grid-cols-2 md:grid-cols-4";
      default:
        return "grid-cols-2 md:grid-cols-3"; // 5-6 sponsors
    }
  }

  const handleSave = async () => {
    await updateSponsors({
      sponsors: tempSponsors.map((sponsor, index) => ({
        _id: sponsor._id,
        order: index + 1,
        active: sponsor.active,
        featured: sponsor.featured,
      })),
    });
    setChanged(false);
    setTempSponsors(sponsors);
  };

  let sponsorToUse = tempSponsors.length > 0 ? tempSponsors : sponsors;
  const sponsorsToDisplay = sponsorToUse
    .filter((sponsor) => sponsor.active)
    .sort((a, b) => (a.order || Infinity) - (b.order || Infinity));

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Sponsor Dashboard Widget Editor</CardTitle>
          <CardDescription>
            Arrange and manage sponsor banners that appear on the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Current Sponsors</h3>
            <div className="flex items-center gap-2">
              <SearchSponsor onSponsorAdd={() => setChanged(true)} />
              {changed && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  disabled={!changed}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              )}
            </div>
          </div>
          <div className="grid gap-4">
            {sponsorToUse.map((sponsor, index) => (
              <div
                key={sponsor._id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="flex items-center gap-4 p-4 border rounded-lg bg-card hover:bg-accent/50 cursor-move"
              >
                <p className="text-sm text-muted-foreground">{index + 1}</p>
                <DragHandleDots2Icon className="h-5 w-5 text-muted-foreground" />
                <div className="relative h-[100px] w-[200px] border rounded-md overflow-hidden">
                  <Image
                    src={sponsor.image}
                    alt={sponsor.name}
                    className="object-cover w-full h-full"
                    width={200}
                    height={100}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`name-${sponsor._id}`}>Name</Label>
                    <p className="text-xs text-muted-foreground">
                      {sponsor.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`url-${sponsor._id}`}>URL</Label>
                    <p className="text-xs text-muted-foreground">
                      {sponsor.url}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`active-${sponsor._id}`}>Active</Label>
                    <Switch
                      id={`active-${sponsor._id}`}
                      checked={sponsor.active}
                      onCheckedChange={() => handleToggleActive(sponsor._id)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleFeatured(sponsor._id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <GalleryHorizontalEnd className="h-5 w-5" /> Sponsors & Partners
            (PREVIEW)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className={`grid gap-4 ${getGridClass(sponsors.length)}`}>
            {sponsorsToDisplay.map((sponsor) => (
              <Link
                href={sponsor.url}
                target="_blank"
                key={sponsor._id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-zinc-900/50 transition-colors hover:border-accent"
              >
                <Image
                  src={sponsor.bannerImage || sponsor.image}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  alt={sponsor.name}
                  width={250}
                  height={250}
                />
              </Link>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <CardDescription className="text-xs text-muted-foreground">
            Interested in promoting your product or app with ChainLink? Contact
            us{" "}
            <a
              href="mailto:admin@chainlink.st?subject=Advertising Inquiry"
              className="text-accent-foreground hover:underline"
            >
              here{" "}
            </a>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
