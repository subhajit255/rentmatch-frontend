import React, { useEffect, useState } from "react";
import PropertyTypeCard from "./PropertyTypeCard";
import PropertyListing from "./PropertyListing";
import { Card, CardContent } from "../ui/card";
import { IMAGES } from "../../assets";
import PercentageViewer from "../ChildComponent/PercentageViewer";
import ToggleButton from "../ChildComponent/ToggleButton";
import { useAuth } from "../../context/AuthContext";
import { transmissionLowerCase } from "../../lib/utils";
import { cn } from "../lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getDashboardData, getDashboardPropertyData } from "../../actions/common";
import { Mail, Phone } from "lucide-react";
import { ChartBarMultiple } from "../cards/barCharts";
import ProgressAnalysis from "../cards/progressAnalysis";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [percentage, setPercentage] = useState<number>(75);
  const { user } = useAuth();
  // console.log(user, "<--user info")

  const { data, isLoading } = useQuery({
    queryKey: ['dash-kpi'],
    queryFn: () => getDashboardData(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: propertyWithCount, isLoading: countKpiLoading } = useQuery({
    queryKey: ['dash-prop-kpi'],
    queryFn: () => getDashboardPropertyData(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  // console.log(data, "<--Dash ");


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div className="flex flex-col gap-8 common-container">

        <div className={cn("grid sm:grid-cols-1 lg:grid-cols-12 gap-4")}>
          {/* <PropertyStats /> */}
          {
            user?.role === "SUPER ADMIN" ?
              <div className={cn(`flex-1 items-center bg-white rounded-2xl border border-sidebar-ring p-5`, "sm:col-span-12 lg:col-span-8 ")}>

                <div className={`w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mb-2`}>
                  <div className="tenent-card-div">
                    <Card className="tenent-card">
                      <CardContent className="flex items-center justify-center gap-2 h-full px-2 py-5">
                        <img
                          className="w-14 h-14 md:w-14 md:h-14"
                          alt={`Saved Properties icon`}
                          src={IMAGES.save_property}
                        />

                        <div className="flex flex-col justify-center gap-1">
                          <div className="font-bold text-xl text-primary">
                            {data?.data?.totalPropertySaved || 0}
                          </div>
                          <div className="font-sanstext-foreground text-sm md:text-md text-center tracking-[0] leading-[25.2px]">
                            Total Users
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="tenent-card-div">
                    <Card className="tenent-card">
                      <CardContent className="flex items-center justify-center gap-2 h-full px-2 py-5">
                        <img
                          className="w-14 h-14 md:w-14 md:h-14"
                          alt={`Saved Properties icon`}
                          src={IMAGES.connection}
                        />

                        <div className="flex flex-col justify-center gap-1">
                          <div className="font-bold text-xl text-primary">
                            {data?.data?.totalMemberSubscription || 0}
                          </div>
                          <div className="font-sanstext-foreground text-sm md:text-md text-center tracking-[0] leading-[25.2px]">
                            Total subscribers
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <Card className="tenent-card">
                      <CardContent className="flex items-center justify-center gap-2 h-full px-2 py-5">
                        <img
                          className="w-14 h-14 md:w-14 md:h-14"
                          alt={`Saved Properties icon`}
                          src={IMAGES.preference}
                        />

                        <div className="flex flex-col justify-center gap-1">
                          <div className="font-bold text-xl text-primary">
                            {data?.data?.totalPost || 0}
                          </div>
                          <div className="font-sanstext-foreground text-sm md:text-md text-center tracking-[0] leading-[25.2px]">
                            Total Revenue
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <hr className="text-black/10" />
                <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mt-2">
                  <div className="tenent-card-div">
                    <Card className="tenent-card">
                      <CardContent className="flex items-center justify-center gap-2 h-full px-2 py-5">
                        <img
                          className="w-14 h-14 md:w-14 md:h-14"
                          alt={`Saved Properties icon`}
                          src={IMAGES.message}
                        />

                        <div className="flex flex-col justify-center gap-1">
                          <div className="font-bold text-xl text-primary">
                            {data?.data?.totalMyProperty || 0}
                          </div>
                          <div className="font-sanstext-foreground text-sm md:text-md text-center tracking-[0] leading-[25.2px]">
                            Total Properties
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="tenent-card-div">
                    <Card className="tenent-card">
                      <CardContent className="flex items-center justify-center gap-2 h-full px-2 py-5">
                        <img
                          className="w-14 h-14 md:w-14 md:h-14"
                          alt={`Saved Properties icon`}
                          src={IMAGES.calender}
                        />

                        <div className="flex flex-col justify-center gap-1">
                          <div className="font-bold text-xl text-primary">
                            {data?.data?.totalScheduled || 0}
                          </div>
                          <div className="font-sanstext-foreground text-sm md:text-md text-center tracking-[0] leading-[25.2px]">
                            Total Inspections
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <Card className="tenent-card">
                      <CardContent className="flex items-center justify-center gap-2 h-full px-2 py-5">
                        <img
                          className="w-14 h-14 md:w-14 md:h-14"
                          alt={`Saved Properties icon`}
                          src={IMAGES.query}
                        />

                        <div className="flex flex-col justify-center gap-1">
                          <div className="font-bold text-xl text-primary">
                            {data?.data?.totalQueryFeedback || 0}
                          </div>
                          <div className="font-sanstext-foreground text-sm md:text-md text-center tracking-[0] leading-[25.2px]">
                            Total Visitors
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div> :
              <div
                className={cn(`flex-1 items-center bg-white rounded-2xl border border-sidebar-ring p-5`, user?.role !== "GUEST" ? "sm:col-span-12 lg:col-span-8 " : "col-span-12 ")}
              >
                <div
                  className={`w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mb-2`}
                >
                  <div className="tenent-card-div">
                    <Card className="tenent-card">
                      <CardContent className="flex items-center justify-center gap-2 h-full px-2 py-5">
                        <img
                          className="w-14 h-14 md:w-14 md:h-14"
                          alt={`Saved Properties icon`}
                          src={IMAGES.save_property}
                        />

                        <div className="flex flex-col justify-center gap-1">
                          <div className="font-bold text-xl text-primary">
                            {data?.data?.totalPropertySaved || 0}
                          </div>
                          <div className="font-sanstext-foreground text-sm md:text-md text-center tracking-[0] leading-[25.2px]">
                            Saved Properties
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="tenent-card-div">
                    <Card className="tenent-card">
                      <CardContent className="flex items-center justify-center gap-2 h-full px-2 py-5">
                        <img
                          className="w-14 h-14 md:w-14 md:h-14"
                          alt={`Saved Properties icon`}
                          src={IMAGES.connection}
                        />

                        <div className="flex flex-col justify-center gap-1">
                          <div className="font-bold text-xl text-primary">
                            {data?.data?.totalPropertyRequests || 0}
                          </div>
                          <div className="font-sanstext-foreground text-sm md:text-md text-center tracking-[0] leading-[25.2px]">
                            Connection Request
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <Card className="tenent-card">
                      <CardContent className="flex items-center justify-center gap-2 h-full px-2 py-5">
                        <img
                          className="w-14 h-14 md:w-14 md:h-14"
                          alt={`Saved Properties icon`}
                          src={IMAGES.preference}
                        />

                        <div className="flex flex-col justify-center gap-1">
                          <div className="font-bold text-xl text-primary">
                            {data?.data?.totalPost || 0}
                          </div>
                          <div className="font-sanstext-foreground text-sm md:text-md text-center tracking-[0] leading-[25.2px]">
                            Posted Preference
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <hr className="text-black/10" />
                <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mt-2">
                  <div className="tenent-card-div">
                    <Card className="tenent-card">
                      <CardContent className="flex items-center justify-center gap-2 h-full px-2 py-5">
                        <img
                          className="w-14 h-14 md:w-14 md:h-14"
                          alt={`Saved Properties icon`}
                          src={IMAGES.message}
                        />

                        <div className="flex flex-col justify-center gap-1">
                          <div className="font-bold text-xl text-primary">
                            {data?.data?.totalNewMessages || 0}
                          </div>
                          <div className="font-sanstext-foreground text-sm md:text-md text-center tracking-[0] leading-[25.2px]">
                            New Messages
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="tenent-card-div">
                    <Card className="tenent-card">
                      <CardContent className="flex items-center justify-center gap-2 h-full px-2 py-5">
                        <img
                          className="w-14 h-14 md:w-14 md:h-14"
                          alt={`Saved Properties icon`}
                          src={IMAGES.calender}
                        />

                        <div className="flex flex-col justify-center gap-1">
                          <div className="font-bold text-xl text-primary">
                            {data?.data?.totalScheduled || 0}
                          </div>
                          <div className="font-sanstext-foreground text-sm md:text-md text-center tracking-[0] leading-[25.2px]">
                            Inspections
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <Card className="tenent-card">
                      <CardContent className="flex items-center justify-center gap-2 h-full px-2 py-5">
                        <img
                          className="w-14 h-14 md:w-14 md:h-14"
                          alt={`Saved Properties icon`}
                          src={IMAGES.query}
                        />

                        <div className="flex flex-col justify-center gap-1">
                          <div className="font-bold text-xl text-primary">
                            {data?.data?.totalQueryFeedback || 0}
                          </div>
                          <div className="font-sanstext-foreground text-sm md:text-md text-center tracking-[0] leading-[25.2px]">
                            Query Feedback
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>}
          {user?.role !== "GUEST" && <div
            className={`sm:col-span-12 lg:col-span-4 flex-1 items-center bg-white rounded-2xl border border-sidebar-ring pr-5 pl-5`}
          >
            <div className="w-full grid grid-cols-2 md:grid-cols-1 lg:grid-cols-1 mt-2">
              <Card className="tenent-card">
                <CardContent className="flex gap-2 h-full px-2 py-5">
                  <img
                    className="w-20 h-20 md:w-20 md:h-20 p-1 border border-chart-1 border-dashed rounded-full"
                    alt={`Saved Properties icon`}
                    src={IMAGES.user_img}
                  />

                  <div className="flex flex-col justify-center">
                    <div className="font-bold text-xl text-[#000]">
                      {`${user?.first_name || ""} ${user?.middle_name || ""} ${user?.last_name || ""}`}
                    </div>
                    <div className="font-sanstext-foreground sm:text-sm md:text-md tracking-[0] leading-[25.2px]">
                      ID: {
                        user?.member_id
                      }
                    </div>
                    {user?.gender && <div className="font-sanstext-foreground sm:text-sm md:text-md tracking-[0] leading-[25.2px]">
                      {transmissionLowerCase(user?.gender)}
                    </div>}
                  </div>
                </CardContent>
              </Card>
              <hr />
              <Card className="tenent-card">
                <CardContent className="flex gap-2 h-full px-2 py-5 justify-between items-center">
                  <div className="flex flex-col justify-center">
                    {/* <div className="flex gap-1">
                      <Mail size={14} color="#ef4444" strokeWidth={2} />
                      <div className="font-sanstext-foreground sm:text-sm md:text-md tracking-[0] leading-[25.2px] flex">
                          {user?.email}
                      </div>
                      <img src={IMAGES.verified} alt="" className="w-5 h-5" />
                    </div> */}

                    <div className="flex items-center gap-2">
                      <Mail size={14} color="#ef4444" strokeWidth={2} className="shrink-0" />

                      <div className="font-sans text-foreground sm:text-sm md:text-md tracking-[0] leading-none">
                        {user?.email}
                      </div>

                      <img src={IMAGES.verified} alt="Verified" className="w-5 h-5 shrink-0" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} color="#3b82f6" strokeWidth={2} />
                      <div className="font-sanstext-foreground sm:text-sm md:text-md tracking-[0] leading-[25.2px] 2flex">
                        {user?.phone_number}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* <div className="font-sanstext-foreground sm:text-sm md:text-md tracking-[0] leading-[25.2px]">
                        Profile Visibility
                      </div>
                      <ToggleButton isToggled={false} /> */}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    {/* <PercentageViewer percentage={percentage} /> */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>}
        </div>

        {/* Property Types */}
        {
          !countKpiLoading ?
            <PropertyTypeCard propertyTypeCounts={propertyWithCount?.result || []} />
            : null
        }
        <PropertyListing />
      </div>
    </>
  );
};
export default Dashboard;