import { Button } from "@/components/ui/button";
import ClientTime from "@/components/ui/client-time";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMatchupsWithPicks } from "@/lib/actions/matchups";
import { Edit2Icon } from "lucide-react";
import Image from "next/image";

export default async function AdminMatchups() {
  const matchups = await getMatchupsWithPicks();

  return (
    <div className="border rounded-md flex flex-col gap-2 mt-2">
      <h1 className="p-4 text-xl text-primary">Matchups</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Actions</TableHead>
            <TableHead>Picks</TableHead>
            <TableHead>Matchup</TableHead>
            <TableHead className="min-w-[5rem]">Start Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="min-w-[200px]">Away Team</TableHead>
            <TableHead className="min-w-[200px]">Home Team</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matchups.map((matchup) => (
            <TableRow key={matchup.id}>
              <TableCell>
                <Button variant="outline" size={"icon"} disabled>
                  <Edit2Icon className="h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>{matchup.picks.length}</TableCell>
              <TableCell>{matchup.question}</TableCell>
              <TableCell className="min-w-[5rem]">
                <ClientTime time={matchup.start_time} />
              </TableCell>
              <TableCell>{matchup.status}</TableCell>
              <TableCell className="min-w-[200px]">
                <div className="flex flex-row items-center">
                  <Image
                    src={matchup.away_image!}
                    width={50}
                    height={50}
                    alt={matchup.away_team}
                    className="rounded-full"
                  />
                  <p className="ml-1">{matchup.away_team}</p>
                </div>
              </TableCell>
              <TableCell className="min-w-[200px]">
                <div className="flex flex-row items-center">
                  <Image
                    src={matchup.home_image!}
                    width={50}
                    height={50}
                    alt={matchup.home_team}
                    className="rounded-full"
                  />

                  <p className="ml-1">@ {matchup.home_team}</p>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
