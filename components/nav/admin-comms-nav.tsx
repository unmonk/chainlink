"use client";
import { getCommsMenuList } from "@/lib/menu-list";
import { usePathname } from "next/navigation";
import React from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminCommsNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();
  const menuList = getCommsMenuList(pathname);

  return (
    <div className="relative">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div
          className={cn("mb-4 flex items-center gap-2", className)}
          {...props}
        >
          {menuList.map((menu) => (
            <Link
              href={menu.href}
              key={menu.href}
              className={cn(
                "flex h-7 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary",
                pathname === menu.href
                  ? "bg-muted font-medium text-primary"
                  : "text-muted-foreground"
              )}
            >
              {menu.label}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
