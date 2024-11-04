"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { DataTable } from "./admin-datatable";
import { AdminColumns } from "./admin-columns";
import { useMemo } from "react";
import { ScrollArea } from "../ui/scroll-area";

const AdminMatchupList = () => {
  const matchups = useQuery(api.matchups.getAdminMatchups, {});

  const memoizedTable = useMemo(
    () => matchups && <DataTable columns={AdminColumns} data={matchups} />,
    [matchups]
  );

  return <div className="mt-2">{memoizedTable}</div>;
};

export default AdminMatchupList;
