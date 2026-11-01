import React, { useState } from "react";
import Icon from "../icons/icon";
import { IMAGES } from "../../assets";
import { Required } from "../ui/miscellenious";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useModal } from "../../context/modalProvider";
import PropertyHorizontal from "../ChildComponent/PropertyHorizontal";
import { useAuth } from "../../context/AuthContext";

const ChatFormModal = ({ parameters }: { parameters: any, closeModal: any }) => {
  const { user } = useAuth()
  const { closeModal } = useModal();
  const { visitinfo } = parameters;

  console.log(user?.role, "<---user role")
  const defaultMessage = user?.role === "TENANT"
    ? `Hi! Is ${parameters.propertyDetails?.property_details?.basic?.property_name || "this property"} still available for rent? I'd love to get some more details.`
    : `Take a look at ${parameters.propertyDetails?.property_details?.basic?.property_name}`;
  const [reasons, setReason] = useState(defaultMessage);
  const isMessageEmpty = !reasons.trim();
  console.log(parameters?.propertyDetails, "<---------parameters")

  return <div className="bg-white hover:shadow-sm transition rounded-xl ">
    <div className="h-fit border-0 border-r border-border p-4 flex flex-col gap-3 ">
      <Label className="text-black font-semibold ">Send a message<Required /></Label>
      <PropertyHorizontal
        id={parameters?.propertyDetails?._id}
        property={parameters.propertyDetails}
      // onCardClick={() => handleCardClick(property?._id)}
      />
      <Textarea value={reasons} onChange={(e) => setReason(e?.target.value)} className="h-30" />
      {isMessageEmpty && (
        <span className="text-xs text-red-500 -mt-2">Message cannot be empty.</span>
      )}
      <Button
        onClick={() => { parameters?.fn(reasons); closeModal(); }}
        variant="secondary"
        size="rounded"
        disabled={isMessageEmpty}
      > Send message </Button>
    </div>

  </div>
}

export default ChatFormModal;