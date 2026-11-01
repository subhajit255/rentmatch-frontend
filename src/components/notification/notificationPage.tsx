import React, { useMemo, useRef, useState } from 'react'
import { notificationList } from '../../actions/common';
import { useQuery } from '@tanstack/react-query';
import CommonTable from '../tables/commonTable';
import { getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { getNotificationColumns } from '../tables/notificationCOl';
import { useParams } from 'react-router-dom';

export default function NotificationPage() {
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [openRowId, setOpenRowId] = useState(null);
    const [globalFilter, setGlobalFilter] = useState("");

    const dropDownref = useRef({});
    const { curRole } = useParams();

    const role = useMemo(() => curRole ?? "tenant", [curRole]);

    const { data, isLoading } = useQuery({
        queryKey: ['notification-list'],
        queryFn: () => notificationList(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    console.log(data?.result, "<---notificationList")

    const memberColumns = getNotificationColumns() as any;

    const notifications: any[] = data?.result?.data ?? [];

    const tableData = useMemo(() => {
        return isLoading ? [] : data?.result?.data ?? [];
    }, [data, isLoading]);

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
        pageCount: 1,
    });
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">Notification list</h1>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {notifications.length} New
                </span>
            </div>
            {
                notifications.length > 0 &&
                <CommonTable table={table} isLoading={isLoading} />
            }
        </div>
    )
}