"use client";

import { Avatar } from "@nextui-org/avatar";
import { Card, CardHeader, CardBody } from "@nextui-org/card";

export default function TweetCard() {
  return (
    <Card className="max-w-[340px] min-w-[340px] min-h-[130px]">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src="/avatars/avatar-1.png"
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              ChainLink
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @chainlink_st
            </h5>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400 ">
        <p>This app cool</p>
        <span className="pt-2">
          #WinChain #ChainLink #ChainGang
          <span className="py-2" aria-label="computer" role="img">
            ⛓️
          </span>
        </span>
      </CardBody>
    </Card>
  );
}
