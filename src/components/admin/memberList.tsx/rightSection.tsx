// import React, { useEffect, useMemo, useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
// import { useNavigate, useParams } from "react-router-dom";
// import { useAuth } from "../../../context/AuthContext";
// import Schedules from "./Schedules";
// import ChatDetails from "./chatDetails";
// import ChatThreads from "./messages";
// import PostsFromTenant from "./posts";

import React, { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Schedules from "./Schedules";
import ChatDetails from "./chatDetails";
import ChatThreads from "./messages";
import PostsFromTenant from "./posts";
import { useQuery } from "@tanstack/react-query";
import { getMemberChatDetail, getMemberPostDetail, getMemberScheduleVisitDetail, getPropertyListDetail } from "../../../actions/userManagement";
import PropertiesFromOwner from "./property";

const RightSection = ({ data }: any) => {

  const { _id, section } = useParams<{ _id: string; section?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [propertyPage, setPropertyPage] = useState(1);
  const [propertyLimit, setPropertyLimit] = useState(10);

  // Current tab — falls back intelligently based on role
  const currTab = useMemo(
    () => section || (data?.role !== "TENANT" ? "Properties" : "Posts"),
    [section, user?.role]
  );

  // ── Queries ── only enabled when their tab is active ────────────────

  const postQuery = useQuery({
    queryKey: ["member-post-details", _id],
    queryFn: () => getMemberPostDetail(_id!),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!_id && currTab === "Posts",
  });

  const chatQuery = useQuery({
    queryKey: ["member-chat-details", _id],
    queryFn: () => getMemberChatDetail(_id!),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!_id && currTab === "Messages",
  });


  const scheduleQuery = useQuery({
    queryKey: ["member-schedule-details", _id],
    queryFn: () => getMemberScheduleVisitDetail(_id!),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!_id && currTab === "Schedule Visits",
  });

  const PropertyQuery = useQuery({
    queryKey: ["member-property-details", _id],
    queryFn: () => getPropertyListDetail(_id!, propertyPage, propertyLimit),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!_id && currTab === "Properties",
  });

  const handleTabChange = (value: string) => {
    navigate(`/member-detail/${_id}/${value}`, { replace: true });
  };
  // console.log(user?.role, "<-user ROle")


  return (
    <div className="w-4/5 flex flex-col gap-4 font-sans">
      <Tabs value={currTab} onValueChange={handleTabChange} className="w-full">
        {/* Tab headers */}
        <div className="rounded-md border bg-white p-2">
          <TabsList className="border-none bg-transparent w-fit gap-1">
            {data?.role !== "TENANT" && (
              <TabsTrigger
                value="Properties"
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Properties
              </TabsTrigger>
            )}

            {data?.role == "TENANT" && (
              <TabsTrigger
                value="Posts"
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Posts
              </TabsTrigger>
            )}

            <TabsTrigger
              value="Messages"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              Messages
            </TabsTrigger>

            <TabsTrigger
              value="Schedule Visits"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              Schedule Visits
            </TabsTrigger>

          </TabsList>
        </div>

        {/* Tab contents */}
        <div className="rounded-md border p-4 bg-white min-h-[70vh]">
          {/* Properties tab content */}
          <TabsContent value="Properties">

            <PropertiesFromOwner
              _id={_id!}
              propertyList={PropertyQuery?.data?.result}
              propertyTotalpage={PropertyQuery?.data?.pagination?.totalItems}
              propertyPage={propertyPage}
              propertyLimit={propertyLimit}
              setPropertyPage={setPropertyPage}
              setPropertyLimit={setPropertyLimit}
            />

          </TabsContent>

          {/* Posts tab */}
          <TabsContent value="Posts">
            <PostsFromTenant
              _id={_id!}
              posts={postQuery.data}
              isLoading={postQuery.isLoading}
              error={postQuery.error ?? null}
            />
          </TabsContent>

          {/* Messages / Chats tab */}
          <TabsContent value="Messages">
            <ChatThreads
              _id={_id!}
              chatData={chatQuery.data?.result}
              isLoading={chatQuery.isLoading}
              error={chatQuery.error ?? null}
            />
          </TabsContent>

          {/* Schedule Visits tab */}
          <TabsContent value="Schedule Visits">
            <Schedules
              _id={_id!}
              schedules={scheduleQuery?.data?.result}
              isLoading={scheduleQuery.isLoading}
              error={scheduleQuery.error ?? null}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default RightSection;