import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import ScheduleCard from "./scheduleCard";
import { useQuery } from "@tanstack/react-query";
import { getSchedulevisit } from "../../actions/propertyMaster";
import Icon from "../icons/icon";

function SchedulesGrid({
  type,
  role = "TENANT",
  setScdhuleCount,
  data,
  isLoading
}: {
  type?: string,
  role: string,
  data: any,
  isLoading: boolean
  setScdhuleCount: Dispatch<SetStateAction<number>>
}) {

  // const schedules = useMemo(() => {
  //   // console.log("type ::: ", type);

  //   if (!isLoading && data?.result?.length) {
  //     let filteredList = [];
  //     switch (type) {
  //       case "All":
  //         filteredList = data.result;
  //         break;
  //       // setScdhuleCount(data?.result?.length || 0)
  //       // return data?.result
  //       // break;
  //       case "New":
  //         filteredList = data.result.filter((el: { date: Date | string }) => {
  //           const daysDifference = (new Date(el.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
  //           return daysDifference <= 3 && daysDifference >= 0;
  //         });
  //         break;
  //       // return data?.result?.filter((el: { date: Date | string }) => {
  //       //   const daysDifference = (new Date(el?.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
  //       //   return daysDifference <= 3 && daysDifference >= 0;
  //       // })
  //       // break;
  //       case "Accepted":
  //         // console.log("data?.result ::: ", data?.result?.filter((el : {status: string}) => el?.status === "ACCEPTED"));
  //         filteredList = data.result.filter((el: { status: string }) => el.status === "ACCEPTED");
  //         break;
  //       // return data?.result?.filter((el: { status: string }) => el?.status === "ACCEPTED")
  //       // break;
  //       case "Rejected":
  //         // console.log("data?.result ::: ", data?.result);
  //         filteredList = data.result.filter((el: { status: string }) => el.status === "CANCELLED" || el.status === "REJECTED");
  //         break;
  //       // return data?.result?.filter((el: { status: string }) => el?.status === "CANCELLED" || el?.status === "REJECTED")
  //       // break;
  //       case "default":
  //         filteredList = [];
  //       // return []
  //       // break;
  //     }
  //     setScdhuleCount(filteredList.length); // Update count for all cases
  //     return filteredList;
  //   }
  // }, [data, isLoading, type])

  // const modifiedSchedules = useMemo(() => {
  //   if (schedules?.length) {
  //     return schedules?.map((el: { date: Date | string }) => {
  //       const daysDifference = (new Date(el?.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
  //       return { ...el, isNew: daysDifference <= 3 && daysDifference >= 0 };
  //     });
  //   }
  //   return schedules
  // }, [schedules])




  // 1. First, compute the filtered list
 
  const filteredSchedules = useMemo(() => {
    if (!isLoading && data?.result?.length) {
      switch (type) {
        case "All":
          return data.result;
        case "New":
          return data.result.filter((el: { date: Date | string }) => {
            const daysDifference = (new Date(el.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
            return daysDifference <= 3 && daysDifference >= 0;
          });
        case "Accepted":
          return data.result.filter((el: { status: string }) => el.status === "ACCEPTED");
        case "Rejected":
          return data.result.filter((el: { status: string }) => el.status === "CANCELLED" || el.status === "REJECTED");
        default:
          return [];
      }
    }
    return [];
  }, [data, isLoading, type]);

  // 2. Second, update the parent state in a useEffect
  useEffect(() => {
    setScdhuleCount(filteredSchedules.length);
  }, [filteredSchedules.length, setScdhuleCount]);

  // 3. Third, apply your "modified" logic
  const modifiedSchedules = useMemo(() => {
    const now = new Date().getTime();
    return filteredSchedules.map((el: any) => {
      const daysDifference = (new Date(el.date).getTime() - now) / (1000 * 60 * 60 * 24);
      return { ...el, isNew: daysDifference <= 3 && daysDifference >= 0 };
    });
  }, [filteredSchedules]);



  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 h-screen overflow-y-auto thin-scrollbar px-6">
      {isLoading && <Icon name="Loader" />}
      {!isLoading && !data?.result?.length &&
        <div>No schedules found</div>
      }
      {!isLoading && !!modifiedSchedules?.length &&
        modifiedSchedules?.map((visitinfo: any) =>
          <ScheduleCard key={visitinfo?._id} status="new" _id={"1"} visitinfo={visitinfo} role={role} />
        )
      }
    </div>
  );
}

export default SchedulesGrid;