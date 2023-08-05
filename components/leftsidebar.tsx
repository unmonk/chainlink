"use client";
import { siteConfig } from "@/config/site";
import { useAuth } from "@clerk/nextjs";
import { NavbarMenuItem } from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { usePathname, useRouter } from "next/navigation";

export default function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();
  return (
    <section className="custom-scrollbar sticky left-0 top-0 z-20 flex min-h-[90vh] w-fit flex-col justify-between gap-12 overflow-auto border-l border-r-3 px-2 pb-6 pt-23 max-xl:hidden">
      <div className=" flex flex-col w-full flex-1 gap-6 px-2 pt-4">
        {siteConfig.navMenuItems.map(({ Icon, href, label }, index) => {
          const isActive =
            (pathname.includes(href) && href.length > 1) || pathname === href;
          if (href === "/profile") href = `/profile/${userId}`;
          return (
            <Link
              key={`${index}`}
              color={isActive ? "primary" : "foreground"}
              href={href}
              className={`relative flex justify-start gap-4 rounded-lg p-4 hover:bg-secondary hover:bg-opacity-10 ${
                isActive ? "bg-secondary bg-opacity-20" : ""
              }`}
            >
              {<Icon />}
              {label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
