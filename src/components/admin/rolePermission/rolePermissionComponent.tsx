import React, { useMemo, useState } from 'react'
import { getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { getRolePermissionColumns } from '../../tables/roleNpermissionCol';
import CommonTable from '../../tables/commonTable';

 const data = {
  result : [
    {
      _id: "xyz8932478439",
      roleSlug: "sub-admin",
      roleName: "Sub admin",
      roleDesc : "Lrm ipsm",
      status:true
    }
  ]
 }

 const isLoading = false

function rolePermissionComponent() {
    const [globalFilter, setGlobalFilter] = useState("");

      const memberColumns = getRolePermissionColumns() as any;
  

      const tableData = useMemo(() => {
          return isLoading ? [] : data?.result ?? [];
      }, [data]);

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
                <h1 className="text-2xl font-bold text-gray-900">Role an permission</h1>
                {/* <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    12 New
                </span> */}
            </div>
            <CommonTable table={table} isLoading={isLoading} />
        </div>
  )
}

export default rolePermissionComponent