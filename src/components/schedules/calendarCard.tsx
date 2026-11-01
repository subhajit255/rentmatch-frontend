import React, { useMemo, useState } from "react";
import DaySchedules from "./daySchedules";

interface Visit {
  _id: string;
  date: string;           // ISO string e.g. "2026-01-28T21:39:00.000Z"
  status: string;
  // ... other fields
}

interface CalendarCardProps {
  data: { result: Visit[] } | null | undefined;
  isLoading: boolean;
}

function CalendarCard({
  data,
  isLoading
}: {
  data: any,
  isLoading: boolean
}) {
  const visits = data?.result ?? [];
    const [displayDate, setDisplayDate] = useState(() => {
    const d = new Date();
    d.setDate(1);           // first day of month
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Current date (you can also use new Date() directly)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to start of day

  const displayYear  = displayDate.getFullYear();
  const displayMonth = displayDate.getMonth();
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();


  // Find all visit dates in the displayed month
  const visitDates = useMemo(() => {
    const dates = new Set<number>();

    visits.forEach((visit: any) => {
      const visitDate = new Date(visit.date);
      if (
        visitDate.getFullYear() === displayYear &&
        visitDate.getMonth() === displayMonth
      ) {
        dates.add(visitDate.getDate()); // 1–31
      }
    });

    return dates;
  }, [visits]);

  // Find if today is in the displayed month
  const isTodayInThisMonth =
    today.getFullYear() === displayYear && today.getMonth() === displayMonth;

  const todayDateNumber = isTodayInThisMonth ? today.getDate() : null;

  // Default selected date = today (if in this month) or first day
  const [selectedDate, setSelectedDate] = useState<number | null>(
    todayDateNumber ?? 1
  );

  // Find visit for the selected date (if any)
  const selectedVisit = useMemo(() => {
    if (!selectedDate) return null;
    return visits.filter((v: any) => {
      const d = new Date(v.date);
      // console.log(d, "<--filter")
      return (
        d.getFullYear() === displayYear &&
        d.getMonth() === displayMonth &&
        d.getDate() === selectedDate
      );
    });
  }, [selectedDate, visits]);

  // Pass to DaySchedules: either the matching visit or just the date
  const daySchedulesProps = selectedVisit ?? {
    date: new Date(displayYear, displayMonth, selectedDate ?? 1).toISOString(),
  };
  // console.log(data?.result, "<--- calender data")
  return (
    <>
      <div className="rounded-xl border border-border bg-white p-4">
        <h3 className="text-center font-medium mb-4">
          {new Date(displayYear, displayMonth).toLocaleString("default", {
            month: "long",
            year: "numeric",
          }).toUpperCase()}
        </h3>

        {/* You can add weekday headers here if you want */}
        <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = day === todayDateNumber;
            const isVisitDay = visitDates.has(day);
            const isSelected = day === selectedDate;

            let bgClass = "";
            let textClass = "";

            if (isSelected) {
              bgClass = "bg-primary text-white";
            } else if (isVisitDay) {
              bgClass = "bg-green-100 text-green-800 border border-green-300";
            } else if (isToday) {
              bgClass = "bg-blue-100 text-blue-800 border border-blue-300";
            } else {
              bgClass = "hover:bg-accent";
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedDate(day)}
                className={`h-8 w-8 flex items-center justify-center rounded-full transition-colors ${bgClass} ${textClass}`}
                disabled={isLoading}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <DaySchedules visitOrDate={daySchedulesProps} />
    </>
  );
}
export default CalendarCard;