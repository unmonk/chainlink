import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { FC } from "react";

interface LeaderboardSkeletonProps {}

const LeaderboardSkeleton: FC<LeaderboardSkeletonProps> = ({}) => {
  const generateRows = (rows: number) => {
    //create skeleton rows for the leaderboard
    const skeletonRows = [];
    for (let i = 0; i < rows; i++) {
      skeletonRows.push(
        <TableRow key={i}>
          <TableCell className="font-bold lg:text-xl">{i + 1}</TableCell>
          <TableCell className="flex flex-row items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <span className="w-14" />
          </TableCell>
          <TableCell className="lg:text-lg">0</TableCell>
          <TableCell className="lg:text-lg">0</TableCell>
          <TableCell className="lg:text-lg">0</TableCell>
          <TableCell className="lg:text-lg">0</TableCell>
        </TableRow>,
      );
    }
    return skeletonRows;
  };

  return (
    <div className="mt-2 w-full">
      <Skeleton className="m-auto h-9 rounded-lg md:w-5/6 xl:w-2/3" />
      <div className="mt-2 flex flex-col gap-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Streak</TableHead>
              <TableHead>Wins</TableHead>
              <TableHead>Losses</TableHead>
              <TableHead>Pushes</TableHead>
            </TableRow>
          </TableHeader>
          {generateRows(25)}
        </Table>
      </div>
    </div>
  );
};

export default LeaderboardSkeleton;
