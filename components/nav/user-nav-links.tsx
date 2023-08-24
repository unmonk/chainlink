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
      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight underline">
        Play
      </h2>
      <div className="space-y-1">
        <Button
          variant={pathname === "/play" ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
          onClick={() => handleLinkClick("/play")}
        >
          <Link href="/play" prefetch={false}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Play
          </Link>
        </Button>
        <Button
          variant={pathname === "/picks" ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
          onClick={() => handleLinkClick("/picks")}
        >
          <Link href="/picks">
            <CalendarSearchIcon className="mr-2 h-4 w-4" />
            My Picks
          </Link>
        </Button>
        <Button
          variant={pathname === "/leaderboards" ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
          onClick={() => handleLinkClick("/leaderboards")}
        >
          <Link href="/leaderboards">
            <Trophy className="mr-2 h-4 w-4" />
            Leaderboards
          </Link>
        </Button>
        <Button
          variant={pathname === "/howtoplay" ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
          onClick={() => handleLinkClick("/howtoplay")}
        >
          <Link href="/howtoplay">
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
          variant={pathname === "/" ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
          onClick={() => handleLinkClick("/")}
        >
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
        <Button
          variant={pathname === "/profile" ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
          onClick={() => handleLinkClick("/profile")}
        >
          <Link href="/" prefetch={false}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </Button>
        <SignOutButton>
          <Button variant={"ghost"} className="w-full justify-start">
            <LogOutIcon className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </SignOutButton>
      </div>
    </nav>
  );
};

export default UserNavLinks;
