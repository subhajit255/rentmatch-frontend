import React from "react";
import { TableHead, TableRow } from "../ui/table";

export const SkeletonRow = ({ columnCount = 1, rowCount = 1 }) => {  
    const columns = Array.from({ length: columnCount }, (_, i) => i);
    // const rows = Array.from({ length: rowCount }, (_, i) => i);
    const rows = Array.from({ length: 6 }, (_, i) => i);
  return (
    <>
      {rows.map((_, indx) => (
        <TableRow key={`row-${indx}`} className="animate-pulse">
          {columns.map((_, i) => (
            <TableHead key={`col-${i}`} className="px-4 py-3">
              <div className="rounded w-full bg-black/10 h-full"></div>
            </TableHead>
          ))}
        </TableRow  >
      ))}
    </>
  );
};