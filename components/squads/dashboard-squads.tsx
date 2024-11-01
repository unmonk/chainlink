import { useQuery } from "convex/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { api } from "@/convex/_generated/api";
import { Button } from "../ui/button";
import { PlusCircle, Search } from "lucide-react";

const DashboardSquads = () => {
  const squad = useQuery(api.squads.getUserSquad, {});

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>My Squad</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {!squad && "Create or join a squad"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-4 flex-grow">
        {!squad && (
          <div className="flex flex-row items-center justify-center gap-1 p-2">
            <Button variant={"outline"} size={"sm"}>
              <PlusCircle size={16} className="mr-0.5" />
              Create Squad
            </Button>
            <Button variant={"outline"} size={"sm"}>
              <Search size={16} className="mr-0.5" />
              Search Squads
            </Button>
          </div>
        )}
        {squad && <div>{squad.name}</div>}
      </CardContent>
    </Card>
  );
};

export default DashboardSquads;
