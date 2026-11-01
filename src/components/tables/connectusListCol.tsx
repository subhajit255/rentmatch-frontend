import React from "react";
import { CellContext } from "@tanstack/react-table";
import { Badge } from "../ui/badge";


export const connectUslAdminColumns = ({ setSelectedRows, openRowId, setOpenRowId, dropDownref, role = "Tenant", totalItems }: { setSelectedRows?: (rows: any[]) => void; openRowId?: any; setOpenRowId?: (id: any | ((prev: any) => any)) => void; dropDownref?: React.RefObject<any>, role: string, totalItems: number }) => [
    {
        accessorKey: 'name',
        id: 'Name',
        header: <div className="flex items-center gap-2">Name</div>,
        meta: {
            className: 'w-60',
        },
        cell: (info: any) => info.getValue(),
    },
    {
        accessorKey: 'email',
        id: 'Email',
        header: 'Email ID',
        cell: (info: any) => info.getValue(),
        meta: {
            className: 'w-60',
        },
    },
    {
        accessorKey: 'phone',
        id: 'Phone',
        header: 'Contact no',
        meta: {
            className: 'w-40',
        },
        cell: (info: any) => info.getValue(),
    },
    {
        accessorKey: 'description',
        id: 'Description',
        header: 'Description',
        cell: (info: any) => {
            const desc = info.getValue();
            const [isExpanded, setIsExpanded] = React.useState(false);
            if (!desc) {
                return <span className="text-active">N/A</span>;
            }

            const isLong = desc.length > 30;
            const displayText = isLong && !isExpanded
                ? `${desc.slice(0, 30)}...`
                : desc;

            return <span
                className="cursor-pointer block"
                onClick={() => setIsExpanded(!isExpanded)}
                title={!isExpanded ? "Click to expand" : "Click to collapse"}
            >
                {displayText}


            </span>
        },
        meta: {
            className: 'w-40',
        },
    }
]
