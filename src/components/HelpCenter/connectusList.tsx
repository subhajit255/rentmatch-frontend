import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { dropALineList } from '../../actions/cms/cmsPageApis';
import CommonTable from '../tables/commonTable';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { connectUslAdminColumns } from '../tables/connectusListCol';


function ConnectusList() {
    const navigate = useNavigate();

    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [openRowId, setOpenRowId] = useState(null);
    const [page, setPage] = useState(1);

    const {
        data,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["connectusList"],
        queryFn: dropALineList,
    });

    console.log(data, "<--?????????")

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

    const adminColumns = connectUslAdminColumns({ setSelectedRows, openRowId, setOpenRowId, role: "Tenant", totalItems: pageInfo?.totalItems }) as any;
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

    return (
        <div>
            {(!!tableData?.length || isLoading) && <CommonTable table={table} isLoading={isLoading} />}
            {(!isLoading && !tableData?.length) &&
                <div className="flex flex-col gap-4 mx-auto w-fit my-18">
                    <h3>No contact us messages found</h3>
                </div>
            }

        </div>
    )
}

export default ConnectusList