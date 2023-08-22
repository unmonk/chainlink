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

export async function UserNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"secondary"}>
          <div className="flex flex-row items-center">
            <div className="flex flex-col">
              <StreakDisplay />
            </div>
            <UserAvatar />
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex flex-row items-center justify-center gap-2 p-2">
            <UserAvatar />
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        <UserNavLinks />
        <Separator className="my-4" />
        <div className="flex flex-col items-center">
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
