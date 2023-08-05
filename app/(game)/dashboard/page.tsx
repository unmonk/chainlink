import NextLink from "next/link";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { DiscordIcon, GithubIcon } from "@/components/icons";
import ComingSoonCard from "@/components/cards/comingsooncard";
import { CircularProgress } from "@nextui-org/progress";
import { Avatar, AvatarGroup } from "@nextui-org/avatar";
import { Card, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

export default function Dashboard() {
  return (
    <>
      <h1 className={title()}>Play</h1>
      <section className=" flex flex-col md:flex-row h-[80vmin] w-full gap-6">
        <div className="border h-full w-full md:w-1/3 hidden md:flex flex-col gap-6 p-4">
          <div className="border w-full h-48">Streak Box</div>
          <div className="border w-full h-1/2 flex flex-col text-center">
            <h3 className="text-lg text-primary-400">My Favorite Groups</h3>
            <div className="flex flex-row justify-between p-4">
              <h3>Group Name</h3>
              <AvatarGroup isBordered>
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
              </AvatarGroup>
            </div>
            <div className="flex flex-row justify-between p-4">
              <h3>Group Name</h3>
              <AvatarGroup isBordered>
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
              </AvatarGroup>
            </div>
          </div>
        </div>
        <div className="border h-full w-full md:w-2/3 flex flex-col gap-6 p-4">
          <div className="border w-full min-h-unit-24">Active Pick</div>
          <div className="border w-full flex flex-1">Picks</div>
        </div>
      </section>
    </>
  );
}
