import { api } from "@/convex/_generated/api";
import { getUserByUsername } from "@/lib/auth";
import { fetchQuery } from "convex/nextjs";
import { ContentLayout } from "@/components/nav/content-layout";
import AchievementCard from "@/components/achievements/achievement-card";
import Marquee from "@/components/magicui/marquee";
import { Separator } from "@/components/ui/separator";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  params: {
    id: string;
  };
};

export default async function UserAchievementsPage({ params: { id } }: Props) {
  const clerkUser = await getUserByUsername(id);
  if (!clerkUser) {
    return null;
  }

  const user = await fetchQuery(api.users.queryByClerkId, {
    clerkUserId: clerkUser.id,
  });
  if (!user) {
    return null;
  }

  const achievementIds = user.achievements.map(
    (achievement) => achievement.achievementId
  );

  const achievements = await fetchQuery(api.achievements.getAchievementsByIds, {
    ids: achievementIds,
  });

  const mergedAchievements = achievements
    .map((achievement) => {
      const userAchievement = user.achievements.find(
        (ua) => ua.achievementId === achievement._id
      );
      return {
        ...achievement,
        awardedAt: userAchievement?.awardedAt ?? 0,
        count: 1,
      };
    })
    .reduce(
      (acc, current) => {
        const existingAchievement = acc.find((a) => a._id === current._id);
        if (existingAchievement) {
          existingAchievement.count += 1;
          if (current.awardedAt > existingAchievement.awardedAt) {
            existingAchievement.awardedAt = current.awardedAt;
          }
        } else {
          acc.push(current);
        }
        return acc;
      },
      [] as ((typeof achievements)[number] & {
        awardedAt: number;
        count: number;
      })[]
    )
    .sort((a, b) => b.weight - a.weight);

  // Split achievements into multiple arrays based on the total count
  const totalAchievements = mergedAchievements.length;
  let rows: (typeof mergedAchievements)[] = [];

  if (totalAchievements <= 10) {
    const halfLength = Math.ceil(totalAchievements / 2);
    rows = [
      mergedAchievements.slice(0, halfLength),
      mergedAchievements.slice(halfLength),
    ];
  } else if (totalAchievements <= 20) {
    const thirdLength = Math.ceil(totalAchievements / 3);
    rows = [
      mergedAchievements.slice(0, thirdLength),
      mergedAchievements.slice(thirdLength, 2 * thirdLength),
      mergedAchievements.slice(2 * thirdLength),
    ];
  } else {
    const quarterLength = Math.ceil(totalAchievements / 4);
    rows = [
      mergedAchievements.slice(0, quarterLength),
      mergedAchievements.slice(quarterLength, 2 * quarterLength),
      mergedAchievements.slice(2 * quarterLength, 3 * quarterLength),
      mergedAchievements.slice(3 * quarterLength),
    ];
  }

  return (
    <ContentLayout title={`${clerkUser.username} Achievements`}>
      {mergedAchievements.length > 0 && (
        <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
          {rows.map((row, index) => (
            <Marquee
              key={index}
              pauseOnHover
              className="[--duration:20s]"
              reverse={index % 2 !== 0}
            >
              {row.map((achievement) => (
                <AchievementCard
                  key={achievement._id}
                  achievement={{
                    ...achievement,
                    image: achievement.image || "",
                  }}
                />
              ))}
            </Marquee>
          ))}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
        </div>
      )}
      <Separator className="w-full my-4" />
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Achievement</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mergedAchievements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No achievements yet
                  </TableCell>
                </TableRow>
              )}
              {mergedAchievements.map((achievement) => (
                <TableRow key={achievement._id}>
                  <TableCell>{achievement.name}</TableCell>
                  <TableCell className="text-right">
                    {achievement.count}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ContentLayout>
  );
}
