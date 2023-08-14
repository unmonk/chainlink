"use client";

import {
  BookOpenCheck,
  Home,
  LayoutDashboard,
  Trophy,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import StreakDisplay from "./streaks/streak-display";

export function UserNav() {
  const { user } = useUser();
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"secondary"}>
          <div className="flex flex-row items-center">
            <div className="flex flex-col">
              <StreakDisplay />
            </div>
            <Avatar className="mx-2 h-7 w-7">
              <AvatarImage src={user?.imageUrl} alt="User Profile Picture" />
              <AvatarFallback>
                <span>
                  {user?.username?.substring(0, 2) ??
                    user?.emailAddresses[0].emailAddress?.substring(0, 2)}
                </span>
              </AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex flex-row items-center justify-center gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.imageUrl} alt="User Profile Picture" />
              <AvatarFallback>
                <span>
                  {user?.username?.substring(0, 2) ??
                    user?.emailAddresses[0].emailAddress?.substring(0, 2)}
                </span>
              </AvatarFallback>
            </Avatar>
            <p className="text-xs">
              Welcome{" "}
              {user?.username ?? user?.primaryEmailAddress?.emailAddress}
            </p>
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
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
          </div>
        </nav>

        <Separator className="my-4" />
        <div className="flex flex-col">
          <p className="mb-2 px-4 text-xs underline">Announcements</p>
          <p className="mb-2 rounded bg-accent p-2 text-sm">
            Welcome to the Alpha, Join the Discord community to get involved!
          </p>
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
