import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { Button } from "../../ui/button";
// import Icon, { IconName } from "../../icons/icon";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../ui/tabs"
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useClickOutside } from "../../../custom-hooks/use-clickOutside";
import { getAllAdminColumns } from "../../tables/adminListCol";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import CommonTable from "../../tables/commonTable";
import { getUserManagementList } from "../../../actions/userManagement";
import Pagination from "../../tables/pagination";
import { Button } from "../../ui/button";
import { useRolePermissionCheck } from "../../../custom-hooks/rolePermissionCheck";
import { useAuth } from "../../../context/AuthContext";

const AdminList = () => {
    const navigate = useNavigate();
    const { curRole } = useParams();
    const dropDownref = useRef({});
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [openRowId, setOpenRowId] = useState(null);
    const [params, setParams] = useState<{ search?: string }>({});
    const role = useMemo(() => curRole ?? "super_admin", [curRole]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { user } = useAuth();
    const { hasPermission } = useRolePermissionCheck();

    const canAddAdmin = user?.role === 'SUPER ADMIN' || 
                   (user?.role === 'ADMIN' && hasPermission("Admin", "add"));

    const { data, isLoading } = useQuery({
        queryKey: ['user_management', params, role, page, limit],
        queryFn: () => getUserManagementList(role, page, limit, params),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

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
    }, [data]);

    const tableData = useMemo(() => {
        return isLoading ? [] : data?.result ?? [];
    }, [data]);

    const closeRow = useCallback(() => {
        setOpenRowId(null);
    }, []);

    useClickOutside(dropDownref, closeRow, true, openRowId);

    const adminColumns = getAllAdminColumns({ setSelectedRows, openRowId, setOpenRowId, dropDownref, role, totalItems: pageInfo?.totalItems }) as any;
    const table = useReactTable({
        data: tableData,
        columns: adminColumns,
        // state: {
        //   globalFilter,
        // },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableRowSelection: true,
    });


    useEffect(() => {
        setPage(1);
        // console.log("role ::: ", role);
    }, [role])

    return <div>
        <div className="flex flex-col gap-8">
            <div className="flex w-full flex-col gap-6">
                <Tabs value={role} onValueChange={val => navigate("/admin/" + val)} className="w-full">
                    <div className="flex items-center justify-between w-full">
                        <TabsList>
                            <TabsTrigger value="super_admin">Super Admin</TabsTrigger>
                            <TabsTrigger value="admin">Admin</TabsTrigger>
                        </TabsList>
                        {canAddAdmin && (
                            <Button
                                onClick={() => navigate("/add-admin/admin")}
                            >Add { }</Button>
                        )}

                    </div>
                    <TabsContent value={role} className="my-8">
                        {(!!tableData?.length || isLoading) && <CommonTable table={table} isLoading={isLoading} />}
                        {(!isLoading && !tableData?.length) &&
                            <div className="flex flex-col gap-4 mx-auto w-fit my-18">
                                <h3>No admin found</h3>
                                <Button onClick={() => navigate("/add-admin/admin")} className="w-fit">Add Admin</Button>
                            </div>
                        }
                    </TabsContent>
                    {!!pageInfo?.totalPages && <Pagination pageInfo={pageInfo} setPage={setPage} />}
                </Tabs>
            </div>
        </div>
    </div>;
}

export default AdminList;