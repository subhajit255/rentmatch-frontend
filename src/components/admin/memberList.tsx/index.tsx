import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../ui/button";
import Icon, { IconName } from "../../icons/icon";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui/tabs"
import SubscriptionCard from "../../cards/subscription";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionPlanList } from "../../../actions/subscriptions";
import { useNavigate, useParams } from "react-router-dom";
import { subscriptionform } from "../../../types/admin";
import { useClickOutside } from "../../../custom-hooks/use-clickOutside";
import { getAllAdminColumns } from "../../tables/adminListCol";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { getAllMemberColumns } from "../../tables/memberListCol";
import CommonTable from "../../tables/commonTable";
import { getUserManagementList } from "../../../actions/userManagement";
import Pagination from "../../tables/pagination";


const MemberList = () => {
  const navigate = useNavigate();
    const { curRole } = useParams();
  const dropDownref = useRef({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [openRowId, setOpenRowId] = useState(null);
  const [params, setParams] = useState<{ search?: string }>({});
  // const [role, setRole] = useState<string>("tenant");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState(10);
  const role = useMemo(()=> curRole  ?? "tenant", [curRole]);

  // reset to first page when switching role tabs
  useEffect(() => {
    setPage(1);
  }, [role]);

  const { data, isLoading } = useQuery({
    queryKey: ['user_management', params, role, page, limit],
    queryFn: () => getUserManagementList(role, page, limit, params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const tableData = useMemo(() => {
    return isLoading ? [] : data?.result ?? [];
  }, [data]);

  const pageInfo = useMemo(() => isLoading ? {
    "totalItems": 0,
    "totalPages": 0,
    "currentPage": 1,
    "limit": "10"
  } : data?.pagination ?? {
    "totalItems": 0,
    "totalPages": 0,
    "currentPage": 1,
    "limit": "10"
  }, [data])

  // useEffect(() => {
  //   // console.log("role ::: ", role);
  // }, [role])

  useClickOutside(dropDownref, () => setOpenRowId(null), true, openRowId);

  const memberColumns = getAllMemberColumns({ setSelectedRows, openRowId, setOpenRowId, dropDownref, role, totalItems: pageInfo?.totalItems ?? 0 }) as any;
  // const memberColumns = getAllMemberColumns({ setSelectedRows, openRowId, setOpenRowId, dropDownref })
  const table = useReactTable({
    data: tableData,
    columns: memberColumns,
    // state: {
    //   globalFilter,
    // },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    manualPagination: true,
    pageCount: pageInfo.totalPages ?? -1,
  });

  return <div>
    <div className="flex flex-col gap-8">
      <div className="flex w-full flex-col gap-6">
        <Tabs value={role} onValueChange={val => navigate("/member/" + val)} className="w-full">
          <div className="flex items-center justify-between w-full">
            <TabsList>
              <TabsTrigger value="tenant">Tenant</TabsTrigger>
              <TabsTrigger value="landlord">Property Owner</TabsTrigger>
              <TabsTrigger value="property_manager">Property Manager</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={role} className="my-8">
            <CommonTable table={table} isLoading={false} />
          </TabsContent>
          {/* <TabsContent value="landlord" className="my-8">
            <CommonTable table={table} isLoading={false} />
          </TabsContent>
          <TabsContent value="property_manager" className="my-8">
            <CommonTable table={table} isLoading={false} />
          </TabsContent> */}
          {!!pageInfo?.totalPages && <Pagination pageInfo={pageInfo} setPage={setPage} />}
        </Tabs>
      </div>
    </div>
  </div>;
}

export default MemberList;

