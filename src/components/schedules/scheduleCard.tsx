import React from "react";
import { Button } from "../ui/button";
import { IMAGES } from "../../assets";
import Icon from "../icons/icon";
import { toast } from "../../custom-hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { statusUpdateApi } from "../../actions/propertyMaster";
import { useModal } from "../../context/modalProvider";
// import DropDown from "../ui/dropDown";

function ScheduleCard({ status, _id, visitinfo, role }: { status: "new" | "accepted" | "rejected", _id: string, visitinfo: any, role: string }) {
  const queryClient = useQueryClient();
  const { openModal, setParameters } = useModal();

  const { mutate: statusChange, isPending } = useMutation({
    mutationFn: (data: { payload: any; _id: string }) => statusUpdateApi(data.payload, data._id),
    onSuccess: () => {
      // This will trigger refetch of ['users']
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast({
        title: `Schedule Status changed`,
        description: `Schedule status got changed successfully.`,
        variant: "success",
      });
      // navigate('/property-type/')
    },
    onError: (error) => {

      toast({
        title: `Failed to Update Schedule`,
        description: `An error occurred while Updating the property schedule. Please try again.`,
        variant: "error",
      })
      // setServerError(error.response?.data?.message || 'Can not able to add user.');
    },
  });

  const handleAction = (e: any, action: string) => {
    // console.log(`Action "${action}" triggered for schedule ID: ${_id}`);
    if (action === "REJECTED" || action === "CANCELLED") {
      setParameters({
        visitinfo: visitinfo,
        role: role,
        fn: (reason: string) => statusChange({
          payload: {
            "status": action, // ACCEPTED,REJECTED,CANCELLED
            "property_object_id": visitinfo?.property_object_id?._id,
            "reasons": reason
          },
          _id: visitinfo?._id
        })
      })
      openModal("rejectVisit")
      return;
    }
    statusChange({
      payload: {
        "status": action, // ACCEPTED,REJECTED,CANCELLED
        "property_object_id": visitinfo?.property_object_id?._id,
        "reasons": ""
      },
      _id: visitinfo?._id
    })
  };

  return (
    <div className="h-fit rounded-xl border border-border bg-white p-4 flex flex-col gap-3 hover:shadow-sm transition relative">

      {/* Date */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span className="h-7 w-7 rounded-full bg-[#E0F3FF] flex items-center justify-center">
            <Icon name="Calendar" color="#E0F3FF" fill="#61B3FF" className="w-4 h-4" />
          </span>
          <span className="text-base  2xl:text-lg font-semibold text-primary-foreground">
            {new Date(visitinfo?.date).toLocaleDateString("en-US", {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </span>
        </div>

        {visitinfo?.isNew && (
          <span className="px-2 py-0.5 text-xs rounded-full bg-active text-white">
            New
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-primary-foreground text-md/[1.2] line-clamp-1">
        Property Visit with {role === "TENANT" ?
          `${visitinfo?.receiver_id?.first_name ?? ""} ${visitinfo?.receiver_id?.last_name ?? ""}` :
          `${visitinfo?.visitor_id?.first_name ?? ""} ${visitinfo?.visitor_id?.last_name ?? ""}`}
      </h3>

      {/* Property */}
      <div className="border-y p-2 ">
        <div className="flex gap-3  rounded-md h-full items-center">
          <div className="w-20 rounded-l-md h-18 shrink-0">
            <img
              src={visitinfo?.property_object_id?.property_details?.documents?.images[0]?.url ?? IMAGES?.villa_image}
              className="w-full h-full rounded-l-lg object-cover rounded-l-md"
            />
          </div>
          <div className="flex-1 w-2/3 ">
            <p className="text-sm font-medium line-clamp-1">
              {visitinfo?.property_object_id?.property_details?.basic?.property_name}
            </p>
            <div className="flex gap-3 w-full">
              <p className="text-xs text-muted-foreground line-clamp-2 w-1/2">
                {visitinfo?.property_object_id?.property_details?.basic?.full_address}
              </p>
              <p className="text-sm font-semibold text-primary line-clamp-2 w-1/2">
                ${visitinfo?.property_object_id?.property_details?.rent_details?.weekly_rent_price}/week
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tenant */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={(role === "TENANT" ?
              visitinfo?.receiver_id?.profile_image :
              visitinfo?.visitor_id?.profile_image)
              ?? IMAGES.user_img}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="text-sm font-medium">
              {role === "TENANT" ?
                `${visitinfo?.receiver_id?.first_name ?? ""} ${visitinfo?.receiver_id?.last_name ?? ""}` :
                `${visitinfo?.visitor_id?.first_name ?? ""} ${visitinfo?.visitor_id?.last_name ?? ""}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {role === "TENANT" ?
                visitinfo?.receiver_id?.phone_number :
                visitinfo?.visitor_id?.phone_number}</p>
          </div>
        </div>

        {/* Actions */}
        {visitinfo?.status === "PENDING" && (
          <div className="flex gap-2">
            <Button onClick={(e) => handleAction(e, role === "TENANT" ? "CANCELLED" : "REJECTED")} className="w-8 h-8 rounded-full bg-destructive/10 text-destructive border-5 border-destructive p-0 hover:bg-destructive/20">
              ✕
            </Button>
            {role !== "TENANT" && <Button onClick={(e) => handleAction(e, "ACCEPTED")} className="w-8 h-8 rounded-full bg-active/10 text-active border-5 border-active p-0 hover:bg-active/20">
              ✓
            </Button>}
          </div>
        )}

        {visitinfo?.status === "ACCEPTED" && (
          <span className="text-xs px-3 py-1 rounded-full bg-active text-white">
            Accepted
          </span>
        )}

        {visitinfo?.status === "REJECTED" && (
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-destructive text-white">
              Rejected
            </span>
            <span title={visitinfo?.reasons ?? ""} className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center">
              <Icon name="Info" className="w-3 h-3 2xl:w-2 2xl:h-2" />
              {/* <InfoTooltip  /> */}
            </span>
          </ div>
        )}

        {visitinfo?.status === "CANCELLED" && (
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-destructive text-white">
              Cancelled
            </span>
            <span title={visitinfo?.reasons ?? ""} className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center">
              <Icon name="Info" className="w-3 h-3 2xl:w-2 2xl:h-2" />
              {/* <InfoTooltip  /> */}
            </span>
          </ div>
        )}
      </div>
    </div>
  );
}
export default ScheduleCard;