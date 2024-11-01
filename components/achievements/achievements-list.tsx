"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { EditAchievementForm } from "./edit-achievement-form";

export function AchievementsList() {
  const achievements = useQuery(api.achievements.listAchievements) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Actions</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead>Reward</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {achievements?.map((achievement) => (
              <TableRow key={achievement._id}>
                <TableCell>
                  <EditAchievementForm
                    achievement={{
                      _id: achievement._id,
                      name: achievement.name,
                      description: achievement.description,
                      type: achievement.type,
                      weight: achievement.weight,
                      threshold: achievement.threshold,
                      coins: achievement.coins,
                      image: achievement.image ?? undefined,
                      imageStorageId: achievement.imageStorageId,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Image
                    src={achievement.image ?? ""}
                    alt={achievement.name}
                    width={50}
                    height={50}
                  />
                </TableCell>
                <TableCell className="text-balance">
                  {achievement.name}
                </TableCell>
                <TableCell className="text-xs text-pretty">
                  {achievement.description}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs text-nowrap">
                    {achievement.type}
                  </Badge>
                </TableCell>
                <TableCell>{achievement.weight}</TableCell>
                <TableCell>{achievement.threshold}</TableCell>
                <TableCell>{achievement.coins}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
