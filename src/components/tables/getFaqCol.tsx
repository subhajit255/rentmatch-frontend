import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { CellContext } from "@tanstack/react-table";
import Icon from "../icons/icon";
import DropDown from "../ui/dropDown";
import type { SyntheticEvent } from "react";
import { toast } from "../../custom-hooks/use-toast";
import { deleteFaqApi } from "../../../src/actions/cms/faq";
import { useModal } from "../../context/modalProvider";

export const getFaqColumns = ({
  openRowId,
  setOpenRowId,
  dropDownref,
}: {
  setSelectedRows?: (rows: any[]) => void;
  openRowId?: any;
  setOpenRowId?: (id: any | ((prev: any) => any)) => void;
  dropDownref?: React.RefObject<any>;
}) => [
  {
    accessorKey: "name",
    id: "Name",
    header: "Questions",
    meta: {
      className: "w-20",
    },
    cell: (info: CellContext<any, unknown>) => {
      const { row } = info;
      return (
        <div className="flex gap-3 items-center">
          <Icon
            name={row.original.img ?? "Apartment"}
            className="w-5 h-5"
            color={"var(--primary)"}
          />
          <span className="font-medium">{row?.original.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Answers",
    cell: (info: CellContext<any, unknown>) => info.getValue(),
    meta: {
      className: "w-60",
    },
  },
  {
    id: "actions",
    header: "Action",
    enableSorting: false,
    enableHiding: false,
    size: 35,
    meta: {
      className: "w-10",
    },
    cell: (info: CellContext<any, unknown>) => {
      const { row } = info;
      const queryClient = useQueryClient();
      const navigate = useNavigate();
      const { openModal, setParameters } = useModal();

      const { mutate: deleteFaq } = useMutation({
        mutationFn: deleteFaqApi,
        onSuccess: () => {
          // This will trigger refetch of ['users']
          queryClient.invalidateQueries({ queryKey: ["faq"] });
          toast({
            title: `Faq Deleted`,
            description: `Faq has been deleted in the system.`,
            variant: "success",
          });
        },
        onError: (error) => {
          toast({
            title: `Delete Failed`,
            description: `Could not delete the Faq. Please check try again.`,
            variant: "error",
          });
        },
      });

      const handleAction = (
        eOrAction?: SyntheticEvent | string,
        action?: string,
      ) => {
        setOpenRowId?.(null);
        const selectedAction =
          typeof eOrAction === "string" ? eOrAction : action || "";

        // console.log("row.original", row.original);
        switch (selectedAction) {
          case "View":
            break;
          case "Edit":
            navigate("/faq/edit", { state: { ...row.original } });
            break;
          case "Active":
            break;
          case "Remove":
            if (row.original._id) {
              openModal("remove");
              setParameters({
                header: `Are you sure, want to delete this faq?`,
                description: ``,
                fn: () => deleteFaq(row.original._id),
              });
            }
            // deleteFaq(row.original._id);
            break;
          default:
            break;
        }
      };

      return (
        <div
          ref={(el) => {
            dropDownref?.current &&
              (dropDownref.current[row?.original?._id] = el);
          }}
          id={row.original._id}
          className="relative flex ites-center justify-center cursor-pointer"
          onClick={() =>
            setOpenRowId?.((prev: any) =>
              prev && prev === row?.original?._id ? null : row?.original?._id,
            )
          }
        >
          <Icon
            name="EllipsisVertical"
            className={
              "w-4 h-4 " +
              (openRowId === row.original.id
                ? " text-primary/10"
                : " text-primary")
            }
          />
          {openRowId === row.original._id && (
            <DropDown
              className="absolute z-[9] right-2 min-w-[150px] top-[calc(100%+5px)]"
              list={[
                { name: "Edit", icon: "PenBoxIcon" },
                {
                  name: row?.original?.is_active ? "Disable" : "Active",
                  icon: row?.original?.is_active ? "Cross" : "Check",
                },
                { name: "Remove", icon: "DeleteIcon" },
              ]}
              handleAction={handleAction}
            />
          )}
        </div>
      );
    },
  },
];
