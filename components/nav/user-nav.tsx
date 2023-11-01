"use client"

import NotificationToggle from "@/components/nav/notificationtoggle"
import UserNavLinks from "@/components/nav/user-nav-links"
import { StreakDisplay } from "@/components/streaks/streak-display"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import UserAvatar from "@/components/user-avatar"
import { useNav } from "@/hooks/useNav"
import { registerServiceWorker } from "@/lib/notifications"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { startTransition, useEffect } from "react"

export function UserNav() {
  const pathname = usePathname()
  const { open, setOpen } = useNav()
  const router = useRouter()
  const { user } = useUser()

  const handleLinkClick = (path: string) => {
    startTransition(() => {
      router.push(path)
      setOpen(false)
    })
  }

  useEffect(() => {
    async function setUpServiceWorker() {
      try {
        await registerServiceWorker()
      } catch (err) {
        console.error(err)
      }
    }
    setUpServiceWorker()
  }, [])

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
          <SheetTitle>
            <Button
              asChild
              className="w-full"
              variant={"ghost"}
              onClick={() => handleLinkClick("/privacy")}
            >
              <Link
                href={`/u/${user?.username}`}
                prefetch={false}
                className="flex flex-row items-center justify-center gap-1"
              >
                <UserAvatar />
                {user?.username}
              </Link>
            </Button>
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        <UserNavLinks />
        <Separator className="my-4" />

        <div className="flex flex-row items-center justify-center gap-2">
          <ThemeToggle />
          <NotificationToggle />
        </div>

        <Separator className="my-4" />
        <div className="flex flex-row items-center justify-center gap-2 text-xs">
          <Button
            asChild
            size={"sm"}
            variant={pathname === "/privacy" ? "secondary" : "ghost"}
            onClick={() => handleLinkClick("/privacy")}
          >
            <Link
              href={"/privacy"}
              className="text-muted-foreground"
              prefetch={false}
            >
              Privacy
            </Link>
          </Button>
          -
          <Button
            asChild
            size={"sm"}
            variant={pathname === "/termsandconditions" ? "secondary" : "ghost"}
            onClick={() => handleLinkClick("/privacy")}
          >
            <Link
              href={"/termsandconditions"}
              className="text-muted-foreground"
              prefetch={false}
            >
              Terms
            </Link>
          </Button>
          -
          <Button
            asChild
            variant={pathname === "/opensource" ? "secondary" : "ghost"}
            size={"sm"}
            onClick={() => handleLinkClick("/privacy")}
          >
            <Link
              href={"/opensource"}
              className="text-muted-foreground whitespace-nowrap"
              prefetch={false}
            >
              Open Source
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
