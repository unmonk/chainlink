import { Doc } from "@/convex/_generated/dataModel";
import React from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "../ui/table";
import { format } from "date-fns";

interface MonthlyStats {
  wins: number;
  losses: number;
  pushes: number;
  coins: number;
  statsByLeague: Record<string, { wins: number; losses: number }>;
  totalGames: number;
  winRate: number;
}

export default function AdminUserStats({
  user,
}: {
  user: Doc<"users"> | null;
}) {
  if (!user) return null;

  return (
    <>
      {user.monthlyStats && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Wins</TableHead>
              <TableHead>Losses</TableHead>
              <TableHead>Leagues Played</TableHead>
              <TableHead>Link Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(user.monthlyStats)
              .sort(
                (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
              )
              .map(([month, stats]) => (
                <TableRow key={month}>
                  <TableCell>
                    {format(
                      new Date(
                        parseInt(month.slice(0, 4)),
                        parseInt(month.slice(4)) - 1
                      ),
                      "MMMM yyyy"
                    )}
                  </TableCell>
                  <TableCell>{(stats as MonthlyStats).wins}</TableCell>
                  <TableCell>{(stats as MonthlyStats).losses}</TableCell>
                  <TableCell>
                    {Object.keys((stats as MonthlyStats).statsByLeague).length}
                  </TableCell>
                  <TableCell>{(stats as MonthlyStats).coins}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
