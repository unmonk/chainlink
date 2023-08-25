import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getActiveCampaign } from "@/lib/actions/campaign";
import {
  getAllTimeWinsLeaderboard,
  getCurrentLeaderboardByStreak,
  getCurrentLeaderboardByWins,
} from "@/lib/actions/leaderboards";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs";

export async function LeaderboardTabs() {
  const { userId } = auth();
  const leaderboardByStreakPromise = getCurrentLeaderboardByStreak();
  const leaderboardByWinsPromise = getCurrentLeaderboardByWins();
  const allTimeWinsPromise = getAllTimeWinsLeaderboard();
  const campaignPromise = getActiveCampaign();
  const [streakLeaderboard, winsLeaderboard, allTimeLeaderboard, campaign] =
    await Promise.all([
      leaderboardByStreakPromise,
      leaderboardByWinsPromise,
      allTimeWinsPromise,
      campaignPromise,
    ]);
  return (
    <Tabs defaultValue="streak" className="w-full mt-2">
      <TabsList className="grid w-full md:w-5/6 xl:w-2/3 m-auto grid-cols-3">
        <TabsTrigger value="streak">Current Streak</TabsTrigger>
        <TabsTrigger value="wins">Campaign Wins</TabsTrigger>
        <TabsTrigger value="alltime">All Time Wins</TabsTrigger>
      </TabsList>
      <TabsContent value="streak">
        <Table>
          <TableCaption>{campaign?.name} Streaks</TableCaption>
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
          <TableBody>
            {streakLeaderboard.map((leaderboard, idx) => (
              <TableRow
                key={leaderboard.id}
                className={leaderboard.user_id === userId ? "bg-accent" : ""}
              >
                <TableCell className="lg:text-xl font-bold">
                  {idx + 1}
                </TableCell>
                <TableCell className="flex flex-row gap-2 items-center">
                  <Avatar>
                    <AvatarImage src={leaderboard.user.image} />
                    <AvatarFallback>{leaderboard.user.username}</AvatarFallback>
                  </Avatar>
                  <p className="lg:text-lg font-semibold">
                    {leaderboard.user.username}
                  </p>
                </TableCell>
                <TableCell
                  className={cn("lg:text-lg font-semibold", {
                    "text-green-500": leaderboard.streak > 0,
                    "text-red-500": leaderboard.streak < 0,
                  })}
                >
                  {leaderboard.streak}
                </TableCell>
                <TableCell className="lg:text-lg">{leaderboard.wins}</TableCell>
                <TableCell className="lg:text-lg">
                  {leaderboard.losses}
                </TableCell>
                <TableCell className="lg:text-lg">
                  {leaderboard.pushes}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
      <TabsContent value="wins">
        <Table>
          <TableCaption>{campaign?.name} Wins</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Wins</TableHead>
              <TableHead>Streak</TableHead>
              <TableHead>Losses</TableHead>
              <TableHead>Pushes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {winsLeaderboard.map((leaderboard, idx) => (
              <TableRow key={leaderboard.id}>
                <TableCell className="lg:text-xl font-bold">
                  {idx + 1}
                </TableCell>
                <TableCell className="flex flex-row gap-2 items-center">
                  <Avatar>
                    <AvatarImage src={leaderboard.user.image} />
                    <AvatarFallback>{leaderboard.user.username}</AvatarFallback>
                  </Avatar>
                  <p className="lg:text-lg font-semibold">
                    {leaderboard.user.username}
                  </p>
                </TableCell>
                <TableCell className="lg:text-lg">{leaderboard.wins}</TableCell>
                <TableCell
                  className={cn("lg:text-lg font-semibold", {
                    "text-green-500": leaderboard.streak > 0,
                    "text-red-500": leaderboard.streak < 0,
                  })}
                >
                  {leaderboard.streak}
                </TableCell>
                <TableCell className="lg:text-lg">
                  {leaderboard.losses}
                </TableCell>
                <TableCell className="lg:text-lg">
                  {leaderboard.pushes}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
      <TabsContent value="alltime">
        <Table>
          <TableCaption>All Time Wins</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Wins</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allTimeLeaderboard.map((leaderboard, idx) => (
              <TableRow key={leaderboard.user_id}>
                <TableCell className="lg:text-xl font-bold">
                  {idx + 1}
                </TableCell>
                <TableCell className="flex flex-row gap-2 items-center">
                  <Avatar>
                    <AvatarImage src={leaderboard.user.image} />
                    <AvatarFallback>{leaderboard.user.username}</AvatarFallback>
                  </Avatar>
                  <p className="lg:text-lg font-semibold">
                    {leaderboard.user.username}
                  </p>
                </TableCell>
                <TableCell className="lg:text-lg">{leaderboard.wins}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
}
