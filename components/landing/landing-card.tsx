import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "../ui/card";

const LandingCard = () => {
  const matchups = useQuery(api.matchups.getHomepageMatchups, {});

  return (
    <Card className="absolute w-[350px] -right-[10px] bottom-[35px]  drop-shadow-xl"></Card>
  );
};
