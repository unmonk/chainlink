"use client";

import ScheduleRunButton from "./schedule-run-button";
import ScoreboardsRunButton from "./scoreboards-run-button";
import ViewServiceMessages from "./view-service-messages";

export default function AdminActions() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between items-center">
        <h2 className="text-xl font-semibold">Actions</h2>
        <div className="flex flex-row justify-center items-center gap-2">
          <ScheduleRunButton />
          <ScoreboardsRunButton />
          <ViewServiceMessages />
        </div>
      </div>
    </div>
  );
}
