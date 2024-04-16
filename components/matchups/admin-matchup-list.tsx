"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { DataTable } from "./admin-datatable";
import { AdminColumns } from "./admin-columns";

const AdminMatchupList = () => {
  const matchups = useQuery(api.matchups.getAdminMatchups, {});
  return (
    <div>
      <h1>Admin Matchup List</h1>
      {matchups && <DataTable columns={AdminColumns} data={matchups} />}
    </div>
  );
};

export default AdminMatchupList;
