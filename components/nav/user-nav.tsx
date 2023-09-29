"use client";

import NotificationToggle from "@/components/nav/notificationtoggle";
import UserNavLinks from "@/components/nav/user-nav-links";
import { StreakDisplay } from "@/components/streaks/streak-display";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import UserAvatar from "@/components/user-avatar";
import { useNav } from "@/hooks/useNav";
import { registerServiceWorker } from "@/lib/notifications";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from "react";

export function UserNav() {
  const { open, setOpen } = useNav();
  const { user } = useUser();

  useEffect(() => {
    async function setUpServiceWorker() {
      try {
        await registerServiceWorker();
      } catch (err) {
        console.error(err);
      }
    }
    setUpServiceWorker();
  }, []);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button variant={"secondary"}>
          <div className="flex flex-row items-center">
            <div className="flex flex-col">
              <StreakDisplay size="default" />
            </div>
            <UserAvatar />
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex flex-row justify-center items-center gap-2 p-2">
            <UserAvatar />
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        <UserNavLinks />
        <Separator className="my-4" />
        <div className="flex flex-col items-center">
          <p className="px-4 mb-2 text-xs underline">Announcements</p>
          <p className="p-2 mb-2 text-sm bg-accent rounded">
            Welcome to the Beta, Join the Discord community to get involved!
          </p>
          <div className="flex flex-row gap-2">
            <ThemeToggle />
            <NotificationToggle />
            {/* <Button
              onClick={() => {
                fetch("/api/notifications/push", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    userId: user?.id,
                    notification: {
                      title: "You've Won!",
                      body: "Your Pick: Green Bay Packers has won!",
                    },
                  }),
                });
              }}
            /> */}
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-row justify-center items-center gap-2 text-xs">
          <Link
            href={"/privacy"}
            className="text-muted-foreground"
            prefetch={false}
          >
            Privacy
          </Link>
          -
          <Link
            href={"/termsandconditions"}
            className="text-muted-foreground"
            prefetch={false}
          >
            Terms
          </Link>
          -
          <Link
            href={"/opensource"}
            className="text-muted-foreground"
            prefetch={false}
          >
            Open Source
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
