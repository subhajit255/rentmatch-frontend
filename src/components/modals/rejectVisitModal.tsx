import React, { useState } from "react";
import Icon from "../icons/icon";
import { IMAGES } from "../../assets";
import { Required } from "../ui/miscellenious";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const RejectVisitModals = ({ parameters, closeModal }: { parameters: any, closeModal: any }) => {
  const { visitinfo, role } = parameters;
  const [reasons, setReason] = useState("");

  return <div className="flex bg-white hover:shadow-sm transition rounded-xl ">
    <div className="h-fit w-1/2 border-0 border-r border-border p-4 flex flex-col gap-3 ">

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
        Property Visit with {(visitinfo?.visitor_id?.first_name ?? "") + " " + (visitinfo?.visitor_id?.last_name ?? "")}
      </h3>

      {/* Property */}
      <div className="border-y p-2 ">
        <div className="flex gap-3  rounded-md h-full items-center">
          <div className="w-20 rounded-l-md h-18">
            <img
              src={visitinfo?.property_object_id?.property_details?.documents?.images[0]?.url ?? IMAGES?.villa_image}
              alt=""
              className="w-full h-full rounded-l-lg object-cover rounded-l-md"
            />
          </div>
          <div className="flex-1  w-2/3 ">
            <p className="text-sm font-medium w-full line-clamp-1">
              {visitinfo?.property_object_id?.property_details?.basic?.property_name}
            </p>
            <div className="flex gap-3 w-full">
              <p className="text-xs text-muted-foreground ine-clamp-2 w-1/2">
                {visitinfo?.property_object_id?.property_details?.basic?.full_address}
              </p>
              <p className="text-sm font-semibold text-primary ine-clamp-2 w-1/2">
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
              `${visitinfo?.receiver_id?.first_name ?? ""} ${visitinfo?.receiver_id?.last_name ?? ""}` : 
              `${visitinfo?.visitor_id?.first_name ?? ""} ${visitinfo?.visitor_id?.last_name ?? ""}`}</p>
          </div>
        </div>
      </div>
    </div>
    <div className="w-1/2 flex flex-col gap-4 p-4">
      <Label className="text-black font-semibold ">Reason for reject <Required /></Label>
      <Textarea onChange={(e) => setReason(e?.target.value)} className="h-30" />
      <Button onClick={() => { parameters?.fn(reasons); closeModal(); }} variant="secondary" size="rounded"> Reject Request </Button>
    </div>
  </div>
}

export default RejectVisitModals;