import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
function SchedulesTabs({type, setType} : {type ?: string, setType: (val : string) => void}) {
  return (
    <div className="flex gap-6">
      <Tabs value={type} onValueChange={(val: string) => setType(val)}>
        <div className="flex items-center justify-between w-full">
          <TabsList className="border-none">
            {["All", "New", "Accepted", "Rejected"].map((tab:any, index:number) => (
              <div key={index}>
                <TabsTrigger value={tab} className="data-[state=active]:bg-transperant data-[state=active]:text-primary data-[state=active]:border-none data-[state=active]:border-b data-[state=active]:rounded-0 data-[state=active]:border-primary data-[state=active]:shadow-none px-3">{tab}</TabsTrigger>
              </div>
            ))}
          </TabsList>
        </div>
      </Tabs>

    </div>
  );
}
export default SchedulesTabs;