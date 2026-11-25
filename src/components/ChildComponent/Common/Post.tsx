import React, { useState } from "react";
import { Calendar, EllipsisVertical, MapPin } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
// import { IMAGES } from "../../../assets/index";
import ToggleButton from "../ToggleButton";
import { useNavigate } from "react-router-dom";
import Icon from "../../icons/icon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteMyPostApi,
  statusChangeOfMyPostApi,
} from "../../../actions/myPost";
import { toast } from "../../../custom-hooks/use-toast";
import DropDown from "../../ui/dropDown";
import { useModal } from "../../../context/modalProvider";
import { useClickOutside } from "../../../custom-hooks/use-clickOutside";
const responseQty = 0;

type PostProps = {
  postDetails: any;
  // key?: string | number;
  dropDownref?: React.RefObject<{ [key: string]: HTMLDivElement | null }>;
  openRowId?: string | null;
  setOpenRowId?: React.Dispatch<React.SetStateAction<string | null>>;
  isAdmin?: boolean;
};

const Post: React.FC<PostProps> = ({
  postDetails,
  // key,
  dropDownref,
  openRowId,
  setOpenRowId,
  isAdmin = false,
}) => {
  const navigate = useNavigate();
  const {
    _id,
    subject,
    move_in_requirements,
    about_post,
    property_type_object_id,
    location,
    balcony,
    bathrooms,
    bedrooms,
    start_price,
    end_price,
    start_size,
    end_size,
    is_active,
    updatedAt,
  } = postDetails;
  const [isToggled, setIsToggled] = useState<boolean>(is_active);
  const queryClient = useQueryClient();
  const { openModal, setParameters } = useModal();

  // Use the custom hook
  if (dropDownref) {
    useClickOutside(
      dropDownref,
      () => {
        setOpenRowId?.(null); // Close dropdown when clicking outside
      },
      true,
      openRowId,
    );
  }

  const { mutate: updatePostStatus, isPending } = useMutation({
    mutationFn: (id: string) => statusChangeOfMyPostApi(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["myPost"] });
      // console.log("data ::: ", data?.result?.status);
      const isActive = data?.result?.is_active;
      setIsToggled(isActive ? true : false);
      toast({
        title: `Post ${isActive ? "Activated" : "Deactivated"} Successfully`,
        description: `Your post has been ${isActive ? "activated" : "deactivated"} successfully.`,
        variant: "success",
      });
    },
    onError: (error) => {
      // console.log("error ::: ", error);
      toast({
        title: `Failed to Update Post`,
        description: `An error occurred while updating the post. Please try again.`,
        variant: "error",
      });
    },
  });

  const { mutate: deletePost } = useMutation({
    mutationFn: (id: string) => deleteMyPostApi(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["myPost"] });
      toast({
        title: `Post Deleted Successfully`,
        description: `Your post has been deleted successfully.`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: `Failed to Delete Post`,
        description: `An error occurred while deleting the post. Please try again.`,
        variant: "error",
      });
    },
  });

  const handleAction = (e: any, actionName: string) => {
    if (actionName === "Edit") {
      navigate(`/edit-post`, {
        state: {
          ...postDetails,
          property_type_object_id: postDetails?.property_type_object_id?._id,
          amenities: postDetails.amenities[0]?.split(",") || [],
          rooms: postDetails?.rooms?.toString(),
          bathrooms: postDetails?.bathrooms?.toString(),
          bedrooms: postDetails?.bedrooms?.toString(),
          balcony: postDetails?.balcony?.toString(),
          garages: postDetails?.garages?.toString(),
        },
      });
    } else if (actionName === "Remove") {
      // Call delete function here

      openModal("remove");
      setParameters({
        header: `Are you sure you want to permanently delete this record?`,
        description: `This action cannot be undone and may affect related data.`,
        fn: () => deletePost(_id),
      });
    }
  };

  return (
    <Card
      key={_id}
      className={`overflow-hidden relative z-[9] hover:shadow-md bg-white transition-shadow p-3 rounded-2xl border border-slate-200/80`}
    >
      <div className="flex justify-between">
        <CardContent className="flex-1 p-2">
          <div className="flex items-center gap-3">
            <h3
              title={subject}
              className="font-semibold text-gray-900 text-lg line-clamp-1"
            >
              {subject}
            </h3>
            {move_in_requirements === "less_than_15_days" && (
              <p className="font-sans font-medium border border-[#C10664] px-[10px] text-xs rounded-xl bg-[#C10664] text-white">
                Urgent
              </p>
            )}
          </div>
          <p title={about_post} className="font-sans text-xs text-slate-500 line-clamp-1 mt-0.5">
            {about_post}
          </p>

          <div className="flex items-center mb-3 mt-2 gap-10">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-3 w-3 mr-1" />
              <span title={location} className="text-xs line-clamp-1">
                {location}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-xs px-2">
                {/* {updatedAt?.split("T")[0]?.split("-").reverse().join("-")} */}
                {new Date(updatedAt)
                  .toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                  .replace(",", " |")}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-start sm:gap-1">
            <div className="flex items-center gap-1 pr-3">
              <span className="font-sans font-normal text-muted-foreground tracking-[0] leading-[19.6px] text-xs">
                Price:
              </span>
              <span className="font-sans font-semibold text-primary tracking-[0] leading-[19.6px] text-xs">
                ${start_price} - ${end_price}
              </span>
              <span className="text-[12px] font-medium ml-0.5">
                <span className="text-black">/</span>{" "}
                <span className="text-blue-600">week</span>
              </span>
            </div>

            <div className="flex items-center border-l border-l-sidebar-border px-3 gap-1">
              <span className="font-sans font-normal text-muted-foreground tracking-[0] leading-[19.6px] text-xs">
                Property Type:
              </span>
              <span className="font-sans font-semibold text-primary tracking-[0] leading-[19.6px] text-xs">
                {property_type_object_id?.name || "Appartment"}
              </span>
            </div>

            {/* <div
              className="flex items-center border-l border-l-sidebar-border px-3 gap-1">
              <span
                className="font-sans font-normal text-muted-foreground tracking-[0] leading-[19.6px] text-xs">
                Size:
              </span>
              <span
                className="font-sans font-semibold text-primary tracking-[0] leading-[19.6px] text-xs">
                {start_size} sqm - {end_size} sqm
              </span>
            </div> */}

            <div className="flex items-center border-l border-l-sidebar-border px-3 gap-1">
              <span className="font-sans font-normal text-muted-foreground tracking-[0] leading-[19.6px] text-xs">
                Bed Rooms:
              </span>
              <span className="font-sans font-semibold text-primary tracking-[0] leading-[19.6px] text-xs">
                {bedrooms}
              </span>
            </div>

            <div className="flex items-center border-l border-l-sidebar-border px-3 gap-1">
              <span className="font-sans font-normal text-muted-foreground tracking-[0] leading-[19.6px] text-xs">
                Bathrooms:
              </span>
              <span className="font-sans font-semibold text-primary tracking-[0] leading-[19.6px] text-xs">
                {bathrooms}
              </span>
            </div>
          </div>
        </CardContent>
        {!isAdmin ? (
          <div className="pl-4 border-l-[1px] border-l-black/10 flex flex-col justify-between py-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="font-sans text-xs sm:text-sm font-medium text-slate-700">
                  Status
                </div>
                <ToggleButton
                  onToggle={() => updatePostStatus(_id)}
                  isToggled={isToggled}
                />
              </div>
              {/* <EllipsisVertical className="text-[#00000054]" /> */}
              <div
                ref={(el) => {
                  dropDownref?.current && (dropDownref.current[_id] = el);
                }}
                id={_id}
                className="relative flex ites-center justify-center cursor-pointer"
                onClick={() =>
                  setOpenRowId?.((prev: any) =>
                    prev && prev === _id ? null : _id,
                  )
                }
              >
                <Icon
                  name="EllipsisVertical"
                  className={
                    "w-4 h-4 " +
                    (openRowId === _id ? " text-primary/10" : " text-primary")
                  }
                />
                {openRowId === _id && (
                  <DropDown
                    className="absolute z-[999] right-2 min-w-[150px] top-[calc(100%+5px)]"
                    list={[
                      { name: "Edit", icon: "PenBoxIcon" },
                      { name: "Remove", icon: "DeleteIcon" },
                    ]}
                    handleAction={handleAction}
                  />
                )}
              </div>
            </div>
            {/* <div className="flex items-center gap-2">
            <Icon name="MessageResponse" className={`w-5 h-5 ${responseQty > 0 ? "stroke-primary" : "stroke-[#A3ABB0]"}`} fill="none" />
            <div className={`font-sanstext-base font-medium ${responseQty > 0 ? 'text-primary' : 'text-[#A3ABB0]'}`}>
              {responseQty} Responses
            </div>
          </div> */}
            <div className="">
              <Button
                onClick={() => navigate(`/post-details/${_id}`)}
                variant="outline"
                className="px-4 hover:bg-primary rounded-[99px] text-primary hover:text-white shadow-none border border-primary px-5 py-2"
              >
                View Details
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default Post;
