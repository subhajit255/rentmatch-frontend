import React, { useState } from "react";
import CalendarCard from "./calendarCard";
import DaySchedules from "./daySchedules";
import SchedulesTabs from "./dcheduleTabs";
import SchedulesGrid from "./scheduleGrid";
import SchedulesHeader from "./scheduleHeaders";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getSchedulevisit } from "../../actions/propertyMaster";
import { IMAGES } from "../../assets/index";

const SchedulesComponent = () => {
    const { user } = useAuth();

    const [type, setType] = useState<string>("All");
    const [scheduleCount, setScdhuleCount] = useState<number>(0)

    const { data, isLoading } = useQuery({
        queryKey: ['schedules'],
        queryFn: () => getSchedulevisit(user?.role === "TENANT" ? "visitor" : "receiver"),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    return <div className="flex gap-6 flex-col sm:flex-col lg:flex-row mb-8">
        {/* Left */}

        {data && data.result.length > 0 ? (
            <section className="flex-1 space-y-4 bg-background py-6 rounded-lg">
                <div className="flex items-center justify-between border-b border-border px-6">
                    <SchedulesHeader scheduleCount={scheduleCount} />
                    <SchedulesTabs type={type} setType={setType} />
                </div>
                <SchedulesGrid
                    type={type}
                    role={user?.role ?? "TENANT"}
                    setScdhuleCount={setScdhuleCount}
                    data={data}
                    isLoading={isLoading}
                />
            </section>
        ) : (
            <div className="flex justify-center items-center mt-10">
                <div className="flex justify-center items-center flex-col">
                    <img
                        src={IMAGES.error}
                        alt="No Properties"
                        className="mb-4 w-[50%]"
                    />
                    <p className="text-2xl">
                        No property visit are scheduleed !
                    </p>
                </div>
            </div>
        )}


        {/* Right */}
        {user?.role !== "TENANT" && <aside className="w-full lg:w-[300px] 2xl:[410px] space-y-4 bg-background  p-4 rounded-lg">
            <CalendarCard
                data={data}
                isLoading={isLoading} />
            {/* <DaySchedules /> */}
        </aside>}
    </div>
}

export default SchedulesComponent;