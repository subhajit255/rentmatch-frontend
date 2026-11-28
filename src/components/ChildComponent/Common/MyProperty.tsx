import React, { useState } from "react";
import { MapPin, Car } from "lucide-react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { IMAGES } from "../../../assets/index";
import ToggleButton from "../ToggleButton";
import { useNavigate } from "react-router-dom";
import Icon from "../../icons/icon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../../../custom-hooks/use-toast";
import {
  deletePropertyApi,
  rentalAvailabilityApi,
} from "../../../actions/property";
import { useModal } from "../../../context/modalProvider";
import { useClickOutside } from "../../../custom-hooks/use-clickOutside";
import DropDown from "../../ui/dropDown";
import { useSheet } from "../../../context/sheetProvider";
import { stringLengthFormat } from "../../../lib/utils";

type PostProps = {
  id: string;
  property?: any;
  dropDownref?: React.RefObject<{ [key: string]: HTMLDivElement | null }>;
  openRowId?: string | null;
  setOpenRowId?: React.Dispatch<React.SetStateAction<string | null>>;
};

const MyProperty: React.FC<PostProps> = ({
  id,
  property,
  dropDownref,
  openRowId,
  setOpenRowId,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { openModal, setParameters, closeModal } = useModal();
  const { openSheet, setParameters: setDrawerParameters } = useSheet();

  const { _id, property_details } = property || {};
  const {
    basic,
    rent_details,
    features,
    documents,
  } = property_details || {};

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

  const { mutate: deleteProperty } = useMutation({
    mutationFn: deletePropertyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property"] });
      toast({
        title: `Property Deleted`,
        description: `Property has been deleted in the system.`,
        variant: "success",
      });
      closeModal();
    },
    onError: () => {
      toast({
        title: `Delete Failed`,
        description: `Could not delete the property. Please try again.`,
        variant: "error",
      });
    },
  });

  const { mutate: rentalAvailability, isPending: isRentalAvailabilityPending } =
    useMutation({
      mutationFn: rentalAvailabilityApi,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["property"] });
        queryClient.invalidateQueries({ queryKey: ["propertyDetails"] });
        toast({
          title: `Rental Availability Updated`,
          description: `Property rental availability has been updated in the system.`,
          variant: "success",
        });
      },
      onError: () => {
        toast({
          title: `Rental Availability Failed`,
          description: `Could not update the property rental availability. Please try again.`,
          variant: "error",
        });
      },
    });

  const handleAction = (_e: any, actionName: string) => {
    if (actionName === "Edit") {
      navigate("/property/edit/", { state: { ...property } });
    } else if (actionName === "Remove") {
      openModal("remove");
      setParameters({
        header: `Are you sure you want to permanently delete this record?`,
        description: `This action cannot be undone and may affect related data.`,
        fn: () => deleteProperty(_id),
      });
    }
  };

  const weeklyRent = Number(rent_details?.weekly_rent_price) || 0;
  const monthlyRent = weeklyRent > 0 ? weeklyRent * 4 : 0;

  return (
    <Card
      key={_id}
      className="overflow-hidden hover:shadow-md bg-white transition-all rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 mb-3"
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Left: Thumbnail & Property Info */}
        <div className="flex gap-3.5 sm:gap-4 items-center flex-1 min-w-0">
          <div className="w-[140px] sm:w-[150px] h-[95px] shrink-0 rounded-xl overflow-hidden bg-slate-100">
            <img
              src={
                documents?.images?.[0]?.url ??
                IMAGES.villa_image
              }
              alt={basic?.property_name || "Property"}
              className="h-full w-full object-cover rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <h3
              title={basic?.property_name}
              className="font-bold text-slate-900 text-base md:text-lg leading-snug truncate"
            >
              {stringLengthFormat(basic?.property_name, 35)}
            </h3>

            {/* Beds / Baths / Area */}
            <ul className="flex items-center gap-3.5">
              <li>
                <div className="flex items-center gap-1">
                  <img src={IMAGES.beds} alt="" className="w-3.5 h-3.5 opacity-80" />
                  <span className="text-xs text-slate-500 font-normal">Beds:</span>
                  <span className="text-xs font-bold text-slate-800">
                    {features?.no_of_bedrooms || 0}
                  </span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-1">
                  <img src={IMAGES.baths} alt="" className="w-3.5 h-3.5 opacity-80" />
                  <span className="text-xs text-slate-500 font-normal">Baths:</span>
                  <span className="text-xs font-bold text-slate-800">
                    {features?.no_of_bathrooms || 0}
                  </span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-slate-600 opacity-80" />
                  <span className="text-xs text-slate-500 font-normal">Parking:</span>
                  <span className="text-xs font-bold text-slate-800">
                    {features?.parking || features?.no_of_garage || 0}
                  </span>
                </div>
              </li>
            </ul>

            {/* Address */}
            <div className="flex items-center text-slate-500">
              <MapPin className="h-3.5 w-3.5 mr-1 shrink-0 text-slate-400" />
              <span
                title={basic?.full_address || ""}
                className="text-xs text-slate-500 font-normal truncate"
              >
                {stringLengthFormat(basic?.full_address, 55)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Rent, Availability Toggle, View Details Button, Three-dot Menu */}
        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          {/* Rent */}
          <div className="text-left sm:text-right">
            <span className="text-xs font-medium text-slate-400 block sm:inline mr-1">
              Rent :
            </span>
            <span className="text-base font-bold text-blue-600">
              ${monthlyRent}
            </span>
            <span className="text-xs font-normal text-slate-400 ml-1">
              /month
            </span>
          </div>

          {/* Toggle & View Details */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-700">
                Available for Rent?
              </span>
              <ToggleButton
                onToggle={() => {
                  if (!isRentalAvailabilityPending) rentalAvailability(id);
                }}
                isToggled={basic?.is_available_for_rent || false}
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-slate-300 hover:border-blue-600 hover:text-blue-600 text-slate-700 font-semibold text-xs px-4 py-1 h-7.5 bg-white shadow-2xs transition-colors cursor-pointer"
              onClick={() => {
                setDrawerParameters({
                  id: id,
                  property: property,
                });
                openSheet("propertyDetails");
              }}
            >
              View Details
            </Button>
          </div>

          {/* Three-dots menu */}
          <div
            ref={(el) => {
              dropDownref?.current && (dropDownref.current[_id] = el);
            }}
            id={_id}
            className="relative inline-block text-left cursor-pointer"
            onClick={() =>
              setOpenRowId?.((prev: any) => (prev && prev === _id ? null : _id))
            }
          >
            <Icon
              name="EllipsisVertical"
              className={
                "w-4 h-4 " +
                (openRowId === _id ? " text-slate-400" : " text-slate-500 hover:text-slate-700")
              }
            />
            {openRowId === _id && (
              <DropDown
                className="absolute z-10 right-0 mt-2 min-w-[140px] shadow-lg rounded-xl border border-slate-100 bg-white"
                list={[
                  { name: "Edit", icon: "PenBoxIcon" },
                  { name: "Remove", icon: "DeleteIcon" },
                ]}
                handleAction={handleAction}
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MyProperty;
