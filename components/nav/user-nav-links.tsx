"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SignOutButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Trophy,
  BookOpenCheck,
  User,
  Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface UserNavLinksProps {}

const UserNavLinks: FC<UserNavLinksProps> = ({}) => {
  const pathname = usePathname();
  return (
    <nav className="py-2">
      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight underline">
        Play
      </h2>
      <div className="space-y-1">
        <Button
          variant={pathname === "/dashboard" ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href="/dashboard" prefetch={false}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <Button
          variant={pathname === "/leaderboards" ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href="/leaderboards">
            <Trophy className="mr-2 h-4 w-4" />
            Leaderboards
          </Link>
        </Button>
        <Button
          variant={pathname === "/leaderboards" ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href="/leaderboards">
            <BookOpenCheck className="mr-2 h-4 w-4" />
            How to Play
          </Link>
        </Button>
      </div>
      <Separator className="my-4" />
      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight underline">
        Everything Else
      </h2>
      <div className="space-y-1">
        <Button
          variant={pathname === "/profile" ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href="/" prefetch={false}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </Button>
        <Button
          variant={pathname === "/" ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
        <SignOutButton />
      </div>
    </nav>
  );
};

export default UserNavLinks;
