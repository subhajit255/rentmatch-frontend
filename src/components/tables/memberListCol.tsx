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


export const getAllMemberColumns = ({ setSelectedRows, openRowId, setOpenRowId, dropDownref, role = "Tenant", totalItems }:
  { setSelectedRows?: (rows: any[]) => void; openRowId?: any; setOpenRowId?: (id: any | ((prev: any) => any)) => void; dropDownref?: React.RefObject<any>, role: string, totalItems: number }) => {
  const columns = [
    {
      accessorKey: 'name',
      id: 'Name',
      header: <div className="flex items-center gap-2"><span>Name</span><Badge variant="count">{totalItems}</Badge></div>,
      meta: {
        className: 'w-40',
      },
      cell: (info: CellContext<any, unknown>) => {
        const navigate = useNavigate();
        const { row } = info;
        const name = `${row?.original?.first_name ?? ""} ${row?.original?.middle_name ?? ""} ${row?.original?.last_name ?? ""}`

        return <div className="cursor-pointer" onClick={() => navigate("/member-detail/" + row.original._id)}>{name}</div>
      }
    },
    {
      accessorKey: 'member_id',
      id: 'member_id',
      header: 'ID',
      cell: (info: CellContext<any, unknown>) => info.getValue(),
      meta: {
        className: 'w-30',
      },
    },
    {
      accessorKey: 'email',
      header: 'Email ID',
      cell: (info: CellContext<any, unknown>) => info.getValue(),
      meta: {
        className: 'w-40',
      },
    },
    // {
    //   accessorKey: 'plan',
    //   header: 'Plan',
    //   cell: (info: CellContext<any, unknown>) => info.getValue(),
    //   meta: {
    //     className: 'w-40',
    //   },
    // },
    // {
    //   accessorKey: 'isActive',
    //   header: 'Status',
    //   meta: {
    //     className: 'w-30',
    //   },
    //   cell: (info: CellContext<any, unknown>) => {
    //     const status = info.getValue();
    //     if (status === "active") {
    //       return <span className="text-active">Active</span>
    //     }
    //     if (status === "inActive")
    //       return <span className="text-warning">Expired</span>
    //     if (status === "canceled")
    //       return <span className="text-destructive">Canceled</span>
    //   }
    // },
    
    // {
    //   id: 'actions',
    //   header: '',
    //   enableSorting: false,
    //   enableHiding: false,
    //   size: 35,
    //   meta: {
    //     className: 'w-10',
    //   },
    //   cell: (info: CellContext<any, unknown>) => {
    //     // const { openDrawer, setDrawerParameters } = useDrawer();
    //     const { row } = info;
    //     const queryClient = useQueryClient();
    //     const navigate = useNavigate();

    //     const { mutate: deletePropertyType } = useMutation({
    //       mutationFn: deletePropertyTypeApi,
    //       onSuccess: () => {
    //         // This will trigger refetch of ['users']
    //         queryClient.invalidateQueries({ queryKey: ['propertyType'] });
    //         toast({
    //           title: `Property type Deleted`,
    //           description: `Property type has been deleted in the system.`,
    //           variant: "success",
    //         })
    //       },
    //       onError: (error) => {
    //         // setServerError(error.response?.data?.message || 'Can not able to add user.');
    //         toast({
    //           title: `Delete Failed`,
    //           description: `Could not delete the property type. Please check try again.`,
    //           variant: "error",
    //         })
    //       },
    //     });

    //     const handleAction = (eOrAction?: SyntheticEvent | string, action?: string) => {
    //       setOpenRowId?.(null);
    //       // normalize parameters: DropDown might call (e, action) while other callers might pass just the action string
    //       const selectedAction = typeof eOrAction === 'string' ? eOrAction : action || '';

    //       // console.log("row.original", row.original);
    //       switch (selectedAction) {
    //         case 'View':
    //           //   openDrawer("viewFaq")
    //           //   setDrawerParameters({...row.original})
    //           break;
    //         case 'Edit':
    //           // navigate('/property-type/edit', { state: { ...row.original } });
    //           break;
    //         case "Active":
    //           // updateFAQS({id: row.original.id, is_faqflag: !row.original.is_faqflag});
    //           break;
    //         case 'Remove':
    //           // if (row.original._id) deletePropertyType(row.original._id);
    //           break;
    //         default:
    //           break;
    //       }
    //     }

    //     return (<div
    //       ref={(el) => { dropDownref?.current && (dropDownref.current[row?.original?._id] = el); }}
    //       id={row.original._id} className="relative flex ites-center justify-center cursor-pointer"
    //       onClick={() => setOpenRowId?.((prev: any) => (prev && prev === row?.original?._id ? null : row?.original?._id))}>
    //       <Icon
    //         name="EllipsisVertical"
    //         className={"w-4 h-4 " + (openRowId === row.original.id ? " text-primary/10" : " text-primary")} />
    //       {openRowId === row.original._id &&
    //         <DropDown className="absolute z-[9] right-2 min-w-[150px] top-[calc(100%+5px)]"
    //           list={[{ name: 'Edit', icon: 'PenBoxIcon' }, { name: row?.original?.is_active ? 'Disable' : 'Active', icon: row?.original?.is_active ? 'Cross' : 'Check' }, { name: 'Remove', icon: 'DeleteIcon' }]}
    //           handleAction={handleAction} />}
    //     </div>
    //     )
    //   }
    // },
  ]
  if (role !== "tenant") {
    columns.splice(
      3, // index to insert (after email)
      0, // deleteCount (0 = do not delete anything)
      {
        accessorKey: 'subscription_details',
        header: 'Plan',
        cell: (info: any) => {
          const planName = info.getValue();


          return <span >
            {planName?.subscription_id?.name || "N/A"}
          </span>
        },
        meta: { className: 'w-40' }
      }
    );
  }
  return columns
}

