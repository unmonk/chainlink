"use client";
import { FC } from "react";

interface ClientTimeProps {
  time: Date | string | number;
}

const ClientTime: FC<ClientTimeProps> = ({ time }) => {
  const localTime = new Date(time).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZoneName: "short",
  });
  return <>{localTime}</>;
};

export default ClientTime;
