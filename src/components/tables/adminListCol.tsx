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
import { statusChangeAdminApi } from "../../actions/cms/admin";


export const getAllAdminColumns = ({ setSelectedRows, openRowId, setOpenRowId, dropDownref, role = "Tenant", totalItems }: { setSelectedRows?: (rows: any[]) => void; openRowId?: any; setOpenRowId?: (id: any | ((prev: any) => any)) => void; dropDownref?: React.RefObject<any>, role: string, totalItems: number }) => [
  {
    accessorKey: 'name',
    id: 'Name',
    header: <div className="flex items-center gap-2"><span>{role}</span><Badge variant="count">{totalItems}</Badge></div>,
    meta: {
      className: 'w-60',
    },
    cell: (info: CellContext<any, unknown>) => {
      const { row } = info;
      const name = `${row?.original?.first_name ?? ""} ${row?.original?.middle_name ?? ""} ${row?.original?.last_name ?? ""}`

      return <div className="">{name}</div>
    },
  },
  // {
  //   accessorKey: 'admin_id',
  //   header: 'ID',
  //   cell: (info: CellContext<any, unknown>) => info.getValue(),
  //   meta: {
  //     className: 'w-40',
  //   },
  // },
  {
    accessorKey: 'email',
    header: 'Email ID',
    cell: (info: CellContext<any, unknown>) => info.getValue(),
    meta: {
      className: 'w-60',
    },
  },
  {
    accessorKey: 'plan',
    header: 'Created Date & Time',
    meta: {
      className: 'w-40',
    },
    cell: (info: CellContext<any, unknown>) => {
      const { row } = info;
      const splitedDate = row?.original.created_date?.split("T");

      return <div className="flex items-center">
        <span className="px-2 border-r">{splitedDate[0]?.split("-")?.reverse()?.join("/")}</span>
        <span className="px-2">{splitedDate[1]?.split(".")[0]}</span>
      </div>
    },
  },
  // {
  //   accessorKey: 'permissions',
  //   header: 'Permission',
  //   meta: {
  //     className: 'w-40',
  //   },
  //   cell: (info: CellContext<any, unknown>) => {
  //       const { row } = info;
  //       return <div className="flex flex-wrap">
  //           {/* {row?.original?.permissions.join(", ")} */}
  //       </div>
  //   },
  // },
  {
    accessorKey: 'is_active',
    header: 'Status',
    meta: {
      className: 'w-30',
    },
    cell: (info: CellContext<any, unknown>) => {
      const status = info.getValue();
      if (!status) {
        return <span className="text-active">Active</span>
      }
      else
        return <span className="text-warning">Expired</span>
    }
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    enableHiding: false,
    size: 35,
    meta: {
      className: 'w-10',
    },
    cell: (info: CellContext<any, unknown>) => {
      // const { openDrawer, setDrawerParameters } = useDrawer();
      const navigate = useNavigate();

      const { row } = info;
      const queryClient = useQueryClient();
      // const navigate = useNavigate();

      const { mutate: changeStateus } = useMutation({
        mutationFn: statusChangeAdminApi,
        onSuccess: () => {
          // This will trigger refetch of ['users']
          queryClient.invalidateQueries({ queryKey: ['user_management'] });
          toast({
            title: `Admin user Status Updated`,
            description: `Admin user status has been updated in the system.`,
            variant: "success",
          })
        },
        onError: (error) => {
          // setServerError(error.response?.data?.message || 'Can not able to add user.');
          toast({
            title: `Deactivation Failed`,
            description: `Could not deactivate the admin user. Please check try again.`,
            variant: "error",
          })
        },
      });
      const handleAction = (eOrAction?: SyntheticEvent | string, action?: string) => {
        setOpenRowId?.(null);
        // normalize parameters: DropDown might call (e, action) while other callers might pass just the action string
        const selectedAction = typeof eOrAction === 'string' ? eOrAction : action || '';

        // console.log("row.original", row.original);
        switch (selectedAction) {
          case 'Edit':
            navigate(`/add-admin/admin/${row?.original._id}`, { state: { ...row.original } });
            break;

          case 'Edit Permission':
            navigate(`/role-permission/edit/${row?.original._id}`, { state: { ...row.original } });
            break;
          case "Active":
            changeStateus({ id: row.original.id });
            break;

          case "Disable":
            changeStateus({ id: row.original.id });
            break;
          case 'Remove':
            // if (row.original._id) deletePropertyType(row.original._id);
            break;
          default:
            break;
        }
      }

      if (row?.original?.role !== "ADMIN") {
        return null;
      }

      return (
        <div
          ref={(el) => { dropDownref?.current && (dropDownref.current[row?.original?._id] = el); }}
          id={row.original._id} className="relative flex ites-center justify-center cursor-pointer"
          onClick={() => setOpenRowId?.((prev: any) => (prev && prev === row?.original?._id ? null : row?.original?._id))}>

          <Icon
            name="EllipsisVertical"
            className={"w-4 h-4 " + (openRowId === row.original.id ? " text-primary/10" : " text-primary")} />

          {openRowId === row.original._id && (() => {
            // Explicitly typing this array satisfies the 'actionType' requirement
            const dropDownList: any[] = [
              {
                name: row?.original?.is_active ? 'Active' : 'Disable',
                icon: row?.original?.is_active ? 'Check' : 'Cross'
              },
              ...(row.original.role === "ADMIN"
                ? [{ name: 'Edit Permission' as const, icon: 'Lock' }]
                : []),
            ];

            return (
              <DropDown
                className="absolute z-[9] right-2 min-w-[150px] top-[calc(100%+5px)]"
                list={dropDownList}
                handleAction={handleAction}
              />
            );
          })()}

        </div>
      )
    }
  },
]
