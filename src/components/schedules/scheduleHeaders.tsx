import React from "react";
function SchedulesHeader({ scheduleCount }: { scheduleCount: number }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold font-heading">
        Schedules <span className="ml-1 text-sm text-muted-foreground">
          {scheduleCount || 0}
        </span>
      </h2>
    </div>
  );
}
export default SchedulesHeader;