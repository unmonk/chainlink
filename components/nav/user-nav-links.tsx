"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNav } from "@/hooks/useNav";
import { SignOutButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Trophy,
  BookOpenCheck,
  User,
  Home,
  CalendarSearchIcon,
  LogOutIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, useTransition } from "react";

interface UserNavLinksProps {}

const UserNavLinks: FC<UserNavLinksProps> = ({}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpen } = useNav();
  const [isPending, startTransition] = useTransition();

  const handleLinkClick = (path: string) => {
    startTransition(() => {
      router.push(path);
      setOpen(false);
    });
  };

  return (
    <nav className="py-2">
      <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight underline">
        Play
      </h2>
      <div className="space-y-1">
        <Button
          variant={pathname === "/play" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleLinkClick("/play")}
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Play
        </Button>
        <Button
          variant={pathname === "/picks" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleLinkClick("/picks")}
        >
          <CalendarSearchIcon className="w-4 h-4 mr-2" />
          My Picks
        </Button>
        <Button
          variant={pathname === "/leaderboards" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleLinkClick("/leaderboards")}
        >
          <Trophy className="w-4 h-4 mr-2" />
          Leaderboards
        </Button>
        {/* <Button
          variant={pathname === "/squads" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleLinkClick("/squads")}
        >
          <Users className="mr-2 h-4 w-4" />
          Squads
        </Button> */}
        <Button
          variant={pathname === "/howtoplay" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleLinkClick("/howtoplay")}
        >
          <BookOpenCheck className="w-4 h-4 mr-2" />
          How to Play
        </Button>
      </div>
      <Separator className="my-4" />
      <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight underline">
        Everything Else
      </h2>
      <div className="space-y-1">
        <Button
          variant={pathname === "/" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleLinkClick("/")}
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
        <Button
          variant={pathname === "/account" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleLinkClick("/account")}
        >
          <User className="w-4 h-4 mr-2" />
          Account
        </Button>
        <SignOutButton>
          <Button variant={"ghost"} className="w-full justify-start">
            <LogOutIcon className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </SignOutButton>
      </div>
    </nav>
  );
};

export default UserNavLinks;
