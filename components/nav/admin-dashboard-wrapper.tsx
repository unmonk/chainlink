"use client";

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Package,
  Users2,
  LineChart,
  PanelLeft,
  Dices,
  Settings2,
  Ticket,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  SignedIn,
  UserButton,
  SignedOut,
  SignInButton,
  useUser,
} from "@clerk/nextjs";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import useNavigation from "@/hooks/use-navigation";
import { cn } from "@/lib/utils";
import { Logo } from "../ui/logo";
import useStoreUserEffect from "@/hooks/use-store-user";
import Coins from "../coins/coins";
import { UserChain } from "../chains/user-chain";

import { Separator } from "../ui/separator";
import { ThemeToggle } from "../ui/theme-toggle";
import { MdAdminPanelSettings } from "react-icons/md";
import useAdminNavigation from "@/hooks/use-admin-navigation";

const AdminDashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const {
    isDashboardActive,
    isSettingsActive,
    isMatchupsActive,
    isMessagesActive,
    breadcrumb,
  } = useAdminNavigation();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Logo className="h-9 w-9 transition-all group-hover:scale-110" />
            <span className="sr-only">ChainLink</span>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/admin"
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    isDashboardActive
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground"
                  )}
                >
                  <MdAdminPanelSettings className="h-5 w-5" />
                  <span className="sr-only">Admin Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Admin Dashboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/admin/matchups"
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    isMatchupsActive
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground"
                  )}
                >
                  <Dices className="h-5 w-5" />
                  <span className="sr-only">Matchups</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Matchups</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Ticket className="h-5 w-5" />
                  <span className="sr-only">Picks</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Picks</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Trophy className="h-5 w-5" />
                  <span className="sr-only">Leaderboards</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Leaderboards</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <LineChart className="h-5 w-5" />
                  <span className="sr-only">Analytics</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Analytics</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/settings"
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    isSettingsActive
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground"
                  )}
                >
                  <Settings2 className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ThemeToggle />
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <>
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href="/"
                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                  >
                    <Logo className="h-10 w-10 transition-all group-hover:scale-110" />
                    <span className="sr-only">ChainLink Admin</span>
                  </Link>
                  <Link
                    href="/admin"
                    className={cn(
                      "flex items-center gap-4 px-2.5 hover:text-foreground",
                      isDashboardActive
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <MdAdminPanelSettings className="h-5 w-5" />
                    Admin Dashboard
                  </Link>
                  <Link
                    href="/play"
                    className={cn(
                      "flex items-center gap-4 px-2.5 hover:text-foreground",
                      isMatchupsActive
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <Dices className="h-5 w-5" />
                    Matchups
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <Ticket className="h-5 w-5" />
                    Picks
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <Trophy className="h-5 w-5" />
                    Leaderboards
                  </Link>

                  <Link
                    href="settings"
                    className={cn(
                      "flex items-center gap-4 px-2.5 hover:text-foreground",
                      isSettingsActive
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <Settings2 className="h-5 w-5" />
                    Settings
                  </Link>

                  <div className="justify-center items-center mt-auto">
                    <div className="flex flex-row gap-2 items-center justify-center">
                      <p className="text-red-500 animate-pulse">ADMIN</p>
                    </div>
                    <Separator orientation="horizontal" className="my-1" />
                    <div className="flex justify-center">
                      <ThemeToggle />
                    </div>
                  </div>
                </nav>
              </>
            </SheetContent>
          </Sheet>
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin">Admin Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {isMatchupsActive && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/admin/matchups">Matchups</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              {isSettingsActive && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/settings">Settings</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-initial md:grow-0">
            <div className="flex flex-row gap-4 items-center">
              <p className="text-red-500 animate-pulse">ADMIN</p>
            </div>
          </div>
          <SignedIn>
            <UserButton
              userProfileMode="navigation"
              userProfileUrl="/settings"
              afterSignOutUrl="/"
              appearance={{
                variables: {
                  colorPrimary: "#12a150",
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </>
  );
};
export default AdminDashboardWrapper;
