"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SponsorActions } from "@/components/admin/sponsors/sponsor-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";

export function SponsorsList() {
  const sponsors = useQuery(api.sponsors.list);

  if (!sponsors) return <div>Loading...</div>;

  return (
    <>
      <div className="space-y-2 p-4 bg-muted/50 rounded-lg mb-2">
        <p className="text-sm text-muted-foreground">
          <strong>Active:</strong> Displaying the banner image on the dashboard.
          A Sponsor must be both Active and Featured to be displayed on the
          dashboard.
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Featured:</strong> Available to be displayed on Matchups and
          available to be activated for display on the dashboard.
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> Clicking on a sponsor will record a click and
          redirect to the sponsor URL via{" "}
          <small>chainlink.st/api/clickthru/[id]</small>
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sponsor</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sponsors.map((sponsor) => (
              <TableRow key={sponsor._id}>
                <TableCell className="flex items-center gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Avatar
                        height="h-8"
                        width="w-8"
                        className="cursor-pointer hover:opacity-80 transition"
                      >
                        <AvatarImage src={sponsor.image} alt={sponsor.name} />
                        <AvatarFallback>{sponsor.name[0]}</AvatarFallback>
                      </Avatar>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      {sponsor.bannerImage && (
                        <Image
                          src={sponsor.bannerImage}
                          alt={`${sponsor.name} banner`}
                          className="w-full h-auto rounded-lg"
                          height={100}
                          width={100}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  <div>
                    <p className="font-medium">{sponsor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {sponsor.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Link href={sponsor.url} target="_blank">
                    {sponsor.url}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={sponsor.active ? "default" : "outline"}>
                    {sponsor.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={sponsor.featured ? "default" : "outline"}>
                    {sponsor.featured ? "Featured" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>{sponsor.metadata?.clicks || 0}</TableCell>
                <TableCell className="text-right">
                  <SponsorActions sponsor={sponsor} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
