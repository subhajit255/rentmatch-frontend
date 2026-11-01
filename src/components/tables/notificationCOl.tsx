import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { CellContext } from "@tanstack/react-table";
import Icon from "../icons/icon";
import DropDown from "../ui/dropDown";
import type { SyntheticEvent } from 'react';
import { deletePropertyTypeApi } from "../../actions/propertyMaster";
import { toast } from "../../custom-hooks/use-toast";
import { Badge } from "../ui/badge";


import { ColumnDef } from "@tanstack/react-table";
import { cn } from "../lib/utils";

export const getNotificationColumns = (): ColumnDef<any>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => <span className="text-gray-600">{row.original.message}</span>,
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => <span>{new Date(row.original.created_at).toLocaleDateString()}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className={cn(
        "px-2 py-1 rounded-full text-xs",
        row.original.status === "UNREAD" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
      )}>
        {row.original.status}
      </span>
    ),
  },
];


