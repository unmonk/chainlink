"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Skeleton } from "../ui/skeleton";
import { COSMETIC_STYLE } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { SignOutButton, useClerk } from "@clerk/nextjs";

export const NavAvatar = () => {
  const { signOut } = useClerk();
  const user = useQuery(api.users.currentUser);

  if (!user) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <Avatar
          height="h-8"
          width="w-8"
          className="cursor-pointer"
          cosmetic={user.metadata?.avatarBackground as COSMETIC_STYLE}
          hasGlow={!!user.metadata?.avatarBackground}
        >
          <AvatarImage src={user?.image} />
          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem asChild className="w-full cursor-pointer">
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600 focus:text-red-600 w-full">
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
