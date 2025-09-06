"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { DataTable } from "@/components/matchups/admin-datatable";
import { AdminPgaColumns } from "./admin-pga-columns";
import { useMemo } from "react";

const AdminPgaMatchupList = () => {
  const matchups = useQuery(api.pga.getAdminPgaMatchups, {});

  const memoizedTable = useMemo(
    () => matchups && <DataTable columns={AdminPgaColumns} data={matchups} />,
    [matchups]
  );

  return <div className="mt-2">{memoizedTable}</div>;
};

export default AdminPgaMatchupList;
