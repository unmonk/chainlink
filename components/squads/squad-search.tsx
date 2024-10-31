"use client";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDebounce } from "@uidotdev/usehooks";

const SquadSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const squads = useQuery(api.squads.searchSquads, {
    query: debouncedSearchTerm,
  });

  const handleChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Find Squad</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Searches for squads by name
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center p-4 flex-grow">
        <div className="relative flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            onChange={handleChange}
          />
        </div>
        <CardContent className="flex flex-row items-center p-4 flex-grow">
          {squads &&
            squads.map((squad) => <div key={squad._id}>{squad.name}</div>)}
        </CardContent>
      </CardContent>
    </Card>
  );
};

export default SquadSearch;
