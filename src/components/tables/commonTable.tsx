import React from "react";
import { flexRender, Table as TableInstance } from "@tanstack/react-table";
import { cn } from "../lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { SkeletonRow } from "./tableSkeleton";
// import { SkeletonRow } from "./loaders";

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends unknown, TValue> {
        className?: string;
    }
}

const CommonTable = ({ table, isLoading = false }: { table: TableInstance<any>, isLoading?: boolean }) => {
    return (
        <Table className="border-spacing-0 border-separate">
            <TableHeader className="" key="table-header">
                {table.getHeaderGroups().map((headerGroup, i) => (
                    <TableRow className=" " key={`table-header-row-${i}`}>
                        {headerGroup.headers.map((header, indx) => (
                            <TableHead key={`table-head-${i}-${indx}`} className={cn(
                                'px-4 py-3 first:pl-6 last:pr-8',
                                headerGroup.headers?.length === 1 ?
                                    "overflow-hidden last:text bg-white border-white border-y first:border-l last:border-r whitespace-nowrap first:rounded-l-[10px] last:rounded-r-[10px]"
                                    :
                                    "overflow-hidden last:text-center bg-white border-white border-y first:border-l last:border-r whitespace-nowrap first:rounded-l-[10px] last:rounded-r-[10px]",
                                header.column.columnDef.meta?.className // dynamically injected className
                            )}>
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody className="mt-[10px] !px-[12px]">
                <TableRow className="h-[16px] bg-input"></TableRow>

                {
                    isLoading ?
                        <SkeletonRow columnCount={table.getAllColumns().length} rowCount={table.getRowModel().rows.length} />
                        :
                        table.getRowModel().rows.map((row, index) => (
                            <TableRow
                                key={`table-body-row-${index}`}
                                className={cn(
                                    "relative bg-white px-2", // keep side borders
                                )}
                            >
                                {row.getVisibleCells().map((cell, indx) => (
                                    <TableCell
                                        key={`table-cell-${index}-${indx}`}
                                        className={cn(
                                            "bg-white px-4 py-3 first:pl-6 last:pr-8", // spacing for padding inside cells
                                            index === 0 && "first:rounded-tl-[10px] last:rounded-tr-[10px]",
                                            index === table.getRowModel().rows.length - 1 && "first:rounded-bl-[10px] last:rounded-br-[10px]",
                                            index !== table.getRowModel().rows.length - 1 &&
                                            "after:content-[''] after:absolute after:bottom-0 after:left-4 after:right-4 after:h-px after:bg-black/10",
                                            cell.column.columnDef.meta?.className
                                        )}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}

            </TableBody>
        </Table>
    );
}

export default CommonTable;