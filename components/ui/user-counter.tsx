import React from "react";
import { Badge } from "./badge";
import { Users2Icon } from "lucide-react";

export default function UserCounter({ value }: { value: number }) {
  return (
    <Badge variant={"outline"}>
      <Users2Icon className="h-4 w-4 mr-1" />
      <span className="text-xs">{value}</span>
    </Badge>
  );
}
