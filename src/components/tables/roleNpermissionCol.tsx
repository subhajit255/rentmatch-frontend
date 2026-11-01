import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";

export const getRolePermissionColumns = (): ColumnDef<any>[] => [
  {
    accessorKey: "roleName",
    header: "Role name",
    cell: ({ row }) => <span className="font-medium">{row.original.roleName}</span>,
  },
  {
    accessorKey: "roleDesc",
    header: "Description",
    cell: ({ row }) => <span className="text-gray-600">{row.original.roleDesc}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className={cn(
        "px-2 py-1 rounded-full text-xs",
        row.original.status === true ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
      )}>
        {/* {row.original.status} */} Active
      </span>
    ),
  },
    {
  id: 'actions',
  header: 'Action',
  // ... other props
  cell: ({ row }) => { // Simplified destructuring
    const navigate = useNavigate();
    // Move any hooks that shouldn't be in cells (like useMutation) 
    // to the parent component or a custom hook if possible.

    const handleAction = (eOrAction?: any, action?: string) => {
      const selectedAction = typeof eOrAction === 'string' ? eOrAction : action || '';

      switch (selectedAction) {
        case 'Edit':
          // Redirect logic
          navigate(`/role-permission/edit/${row.original._id}`);
          break;
        case 'Remove':
          // delete logic...
          break;
        default:
          break;
      }
    };

    return (
      <div className="relative flex items-center justify-center cursor-pointer">
        {/* Your Icon and DropDown logic here */}
        <button onClick={() => handleAction('Edit')}>Edit Role</button> 
      </div>
    );
  }
}

];


