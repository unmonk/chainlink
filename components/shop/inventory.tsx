"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { cn, COSMETIC_STYLE } from "@/lib/utils";
import { useConvexUser } from "@/hooks/use-convex-user";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import UnequipAvatarButton from "./unequipAvatarButton";

export default function Inventory() {
  const { user } = useConvexUser();
  const updateBackground = useMutation(api.users.updateAvatarBackground);

  if (!user) return null;
  const purchases = user.metadata?.avatarBackgrounds ?? [];

  if (!user || !purchases) return null;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold mb-6">Avatar Flair</h1>
      <UnequipAvatarButton className="mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchases.map((background) => (
          <Card
            key={background}
            className="hover:border-primary/40 transition-colors p-4"
          >
            <CardHeader>
              <CardTitle className="text-center tracking-wider text-sm">
                {background}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Avatar
                height="h-24"
                width="w-24"
                hasGlow={true}
                cosmetic={background as COSMETIC_STYLE}
              >
                <AvatarImage src={user.image} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                onClick={() => updateBackground({ background })}
                disabled={user.metadata?.avatarBackground === background}
              >
                {user.metadata?.avatarBackground === background
                  ? "Current Flair"
                  : "Set as Flair"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Link
        href="/shop"
        prefetch={false}
        className="text-sm text-center mt-6 block underline"
      >
        Get more at the Shop or Achievements
      </Link>
    </div>
  );
}
