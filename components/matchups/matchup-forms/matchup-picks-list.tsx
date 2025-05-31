import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id, Doc } from "@/convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface MatchupPicksListProps {
  matchupId: Id<"matchups">;
}

type Pick = Doc<"picks"> & {
  user?: {
    name: string;
    image: string;
  };
};

export function MatchupPicksList({ matchupId }: MatchupPicksListProps) {
  const picks = useQuery(api.picks.getPicksByMatchupId, { matchupId });

  if (!picks) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/admin/picks" prefetch={false}>
        <h3 className="text-lg font-semibold flex items-center gap-2">Picks ({picks.length}) <ExternalLink className="h-4 w-4 text-muted-foreground" /> </h3>  
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Pick</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Coins</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {picks.map((pick: Pick) => (
            <TableRow key={pick._id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar height="h-8" width="w-8">
                    <AvatarImage src={pick.user?.image} alt={pick.user?.name} />
                    <AvatarFallback>
                      {pick.user?.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{pick.user?.name || pick.externalId}</span>
                </div>
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <Image
                  src={pick.pick.image}
                  alt={pick.pick.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                {pick.pick.name}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    pick.status === "WIN"
                      ? "default"
                      : pick.status === "LOSS"
                      ? "destructive"
                      : pick.status === "PUSH"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {pick.status}
                </Badge>
              </TableCell>
              <TableCell>{pick.coins || 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 