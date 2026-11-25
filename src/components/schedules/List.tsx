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

    const hasData = Boolean(data && data?.result?.length > 0);

    return (
        <div className={`w-full ${!hasData && !isLoading ? "min-h-[calc(100vh-160px)] flex items-center justify-center" : "flex gap-6 flex-col sm:flex-col lg:flex-row mb-8"}`}>
            {/* Left */}
            {isLoading ? (
                <div className="w-full min-h-[calc(100vh-160px)] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-slate-500 font-medium">Loading inspections...</span>
                    </div>
                </div>
            ) : hasData ? (
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
                <div className="w-full flex justify-center items-center py-12">
                    <div className="flex justify-center items-center flex-col text-center max-w-md px-4">
                        <img
                            src={IMAGES.error}
                            alt="No Scheduled Visits"
                            className="mb-6 w-52 sm:w-64 max-w-[280px] h-auto object-contain"
                        />
                        <p className="text-xl sm:text-2xl font-medium text-slate-800">
                            No property visit are scheduleed !
                        </p>
                    </div>
                </div>
            )}

            {/* Right */}
            {hasData && user?.role !== "TENANT" && (
                <aside className="w-full lg:w-[300px] 2xl:[410px] space-y-4 bg-background p-4 rounded-lg">
                    <CalendarCard
                        data={data}
                        isLoading={isLoading}
                    />
                </aside>
            )}
        </div>
    );
}

export default SchedulesComponent;