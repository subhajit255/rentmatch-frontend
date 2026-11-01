import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { CellContext } from "@tanstack/react-table";
import Icon from "../icons/icon";
import DropDown from "../ui/dropDown";
import type { SyntheticEvent } from 'react';
import { deletePropertyTypeApi } from "../../actions/propertyMaster";
import { toast } from "../../custom-hooks/use-toast";


export const getProtoTypeColumns = ({ setSelectedRows, openRowId, setOpenRowId, dropDownref, hasPermissionToEdit, hasPermissionToDelete }: { setSelectedRows?: (rows: any[]) => void; openRowId?: any; setOpenRowId?: (id: any | ((prev: any) => any)) => void; dropDownref?: React.RefObject<any>; hasPermissionToEdit?: boolean; hasPermissionToDelete?: boolean }) => [
  {
    accessorKey: 'name',
    id: 'Name',
    header: 'Name',
    meta: {
      className: 'w-20',
    },
    cell: (info: CellContext<any, unknown>) => {
      const { row } = info;
      return (
        <div className="flex gap-3 items-center">
          <Icon name={row.original.img ?? "Apartment"} className="w-5 h-5" color={"var(--primary)"} />
          <span className="font-medium">{row?.original.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: (info: CellContext<any, unknown>) => info.getValue(),
    meta: {
      className: 'w-60',
    },
  },
  {
    id: 'actions',
    header: 'Action',
    enableSorting: false,
    enableHiding: false,
    size: 35,
    meta: {
      className: 'w-10',
    },
    cell: (info: CellContext<any, unknown>) => {
      // const { openDrawer, setDrawerParameters } = useDrawer();
      const { row } = info;
      const queryClient = useQueryClient();
      const navigate = useNavigate();

      const menuItems: Array<{ name: 'Edit' | 'Disable' | 'Active' | 'Remove'; icon: string }> = [];

      if (hasPermissionToEdit) {
        menuItems.push({ name: 'Edit', icon: 'PenBoxIcon' });
        menuItems.push({
          name: row?.original?.is_active ? 'Disable' : 'Active',
          icon: row?.original?.is_active ? 'Cross' : 'Check'
        });
      }

      if (hasPermissionToDelete) {
        menuItems.push({ name: 'Remove', icon: 'DeleteIcon' });
      }

      const typedMenuItems = menuItems as any;

      const { mutate: deletePropertyType } = useMutation({
        mutationFn: deletePropertyTypeApi,
        onSuccess: () => {
          // This will trigger refetch of ['users']
          queryClient.invalidateQueries({ queryKey: ['propertyType'] });
          toast({
            title: `Property type Deleted`,
            description: `Property type has been deleted in the system.`,
            variant: "success",
          })
        },
        onError: (error) => {
          // setServerError(error.response?.data?.message || 'Can not able to add user.');
          toast({
            title: `Delete Failed`,
            description: `Could not delete the property type. Please check try again.`,
            variant: "error",
          })
        },
      });

      // const { mutate: updateFAQS } = useMutation({
      // mutationFn: (params) => updateFAQ(params),
      //     onSuccess: () => {
      //         // This will trigger refetch of ['users']
      //         queryClient.invalidateQueries({ queryKey: ['faq'] });
      //         toast({
      //           title: `FAQ Updated`,
      //           description: `FAQ has been updated in the system.`,
      //           variant: "success",
      //         })
      //     },
      //     onError: (error) => {            
      //         // setServerError(error.response?.data?.message || 'Can not able to add user.');
      //         toast({
      //             title: `Update Failed`,
      //             description: error?.response?.data?.message || `Could not update the FAQ. Please try again.`,
      //             variant: "error",
      //         }) 
      //     },
      // });
      const handleAction = (eOrAction?: SyntheticEvent | string, action?: string) => {
        setOpenRowId?.(null);
        // normalize parameters: DropDown might call (e, action) while other callers might pass just the action string
        const selectedAction = typeof eOrAction === 'string' ? eOrAction : action || '';

        // console.log("row.original", row.original);
        switch (selectedAction) {
          case 'View':
            //   openDrawer("viewFaq")
            //   setDrawerParameters({...row.original})
            break;
          case 'Edit':
            navigate('/property-type/edit', { state: { ...row.original } });
            break;
          case "Active":
            // updateFAQS({id: row.original.id, is_faqflag: !row.original.is_faqflag});
            break;
          case 'Remove':
            if (row.original._id) deletePropertyType(row.original._id);
            break;
          default:
            break;
        }
      }

      return (<div
        ref={(el) => { dropDownref?.current && (dropDownref.current[row?.original?._id] = el); }}
        id={row.original._id} className="relative flex ites-center justify-center cursor-pointer"
        onClick={() => setOpenRowId?.((prev: any) => (prev && prev === row?.original?._id ? null : row?.original?._id))}>
        <Icon
          name="EllipsisVertical"
          className={"w-4 h-4 " + (openRowId === row.original.id ? " text-primary/10" : " text-primary")} />
        {openRowId === row.original._id && menuItems.length > 0 &&
          <DropDown className="absolute z-[9] right-2 min-w-[150px] top-[calc(100%+5px)]"
            // list={[{ name: 'Edit', icon: 'PenBoxIcon' }, { name: row?.original?.is_active ? 'Disable' : 'Active', icon: row?.original?.is_active ? 'Cross' : 'Check' }, { name: 'Remove', icon: 'DeleteIcon' }]}
            list={typedMenuItems}
            handleAction={handleAction} />}
      </div>
      )
    }
  },
]
