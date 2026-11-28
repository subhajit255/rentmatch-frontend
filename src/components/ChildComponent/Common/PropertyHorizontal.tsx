import React, { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Car } from "lucide-react";
import { Badge } from "./../../ui/badge";
import { Card, CardContent } from "./../../ui/card";
import { IMAGES } from "../../../assets/index";
// import { Sheet, SheetTrigger } from "../../ui/sheet";
// import PropertySheet from "./PropertySheet";
import { dateFormat } from "../../../lib/utils";
import { useSheet } from "../../../context/sheetProvider";
import { Button } from "../../ui/button";
import Icon from "../../icons/icon";
import { useAuth } from "../../../context/AuthContext";
import { openMatchingPreferencesModal } from "../../modals/RenterPreferencesModalManager";

type PropertyHorizontalProps = {
  id: string;
  property: any;
  isChatscreen?: boolean;
  onLocationClick?: (property: any) => void;
  hideMatchBadge?: boolean;
  // onCardClick: (id: string) => void;
};

const PropertyHorizontal: React.FC<PropertyHorizontalProps> = ({
  id,
  property,
  isChatscreen = false,
  onLocationClick,
  hideMatchBadge,
  // onCardClick,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwner = user?.role === "LANDLORD" || user?.role === "PROPERTY MANAGER";
  const shouldShowMatch = !hideMatchBadge && !isOwner;
  const { openSheet, setParameters: setDrawerParameters } = useSheet();
  const [propertyListings, setpropertyListings] = useState<any[]>([]);

  const { property_details } = property;
  const {
    basic,
    rent_details,
    features,
    additional_information,
    documents,
    ...rest
  } = property_details || {};

  useEffect(() => {
    // console.log("documents ::: ", documents);

    if (documents) {
      if (documents?.images)
        setpropertyListings((prev) => [...prev, ...documents?.images]);
      if (documents?.videos)
        setpropertyListings((prev) => [...prev, ...documents?.videos]);
      if (documents?.floorPlans)
        setpropertyListings((prev) => [...prev, ...documents?.floorPlans]);
    }
  }, [documents]);

  const openScheduleForm = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDrawerParameters({
      id: id,
      property: property,
    });
    openSheet("propertySchedularForm");
  };

  return (
    <Card
      key={id}
      className={`overflow-hidden hover:shadow-lg transition-shadow mb-5 relative`}
      onClick={() => {
        setDrawerParameters({
          id: id,
          property: property,
        });
        openSheet("propertyDetails");
      }}
    >
      <div className="flex">
        <div className="relative flex-shrink-0">
          <div className="relative w-36 sm:w-44 h-full min-h-[140px] flex-shrink-0">
            <img
              src={
                propertyListings[0]?.url ??
                IMAGES.villa_image ??
                "/placeholder.svg"
              }
              alt={property?.property_details?.basic?.property_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 z-10 max-w-[calc(100%-16px)]">
            {property.property_details?.basic?.property_type_id?.name && (
              <Badge className="bg-[#FCD34D] text-slate-900 hover:bg-[#FCD34D] rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap border-0 shadow-sm h-auto">
                {property.property_details?.basic?.property_type_id?.name}
              </Badge>
            )}
            {property.property_details?.basic?.is_available_for_rent && (
              <Badge className="bg-white text-[#15803D] hover:bg-white rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap border-0 shadow-sm h-auto">
                For Rent
              </Badge>
            )}
          </div>
          {property.is_send_request == true && (
            <div className="absolute bottom-2.5 left-2.5 flex gap-1.5 z-10">
              <Badge className="bg-[#2B52BA] text-white hover:bg-[#2B52BA] rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap border-0 shadow-sm h-auto">
                {property.send_request_status === "APPROVED"
                  ? "Approved"
                  : "Request Sent"}
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="flex-1 p-2 bg-white">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3
              title={property?.property_details?.basic?.property_name}
              className="font-semibold text-gray-900 text-lg truncate flex-1"
            >
              {property?.property_details?.basic?.property_name}
            </h3>

            {/* Match Percentage Badge - Navigates to match breakdown (only for tenants/renters) */}
            {shouldShowMatch && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  const propId = property?._id || id;
                  navigate(`/property-match/${propId}`, { state: { property } });
                }}
                className="bg-[#E8F8EE] hover:bg-[#D1F2DE] transition-colors cursor-pointer text-[#065F46] rounded-2xl px-2.5 py-1 flex flex-col items-center justify-center shrink-0 group shadow-2xs"
                title="Click to view full match score breakdown"
              >
                <span className="font-bold text-xs leading-tight group-hover:underline">
                  {property?.matching_percentage ?? property?.matchPercentage ?? property?.matchScore ?? property?.match_percentage ?? property?.match ?? 92}%
                </span>
                <span className="font-semibold text-[10px] leading-none">
                  match
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5 mb-2">
            {/* Beds and Baths */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {/* <BedIcon className="w-4 h-4" /> */}
                <img src={IMAGES.beds} alt="" className="w-3 h-3" />
                <span className="font-sans font-normal text-xs">Beds:</span>
                <span className="font-sans font-semibold text-primary-foreground text-xs">
                  {property.property_details?.features?.no_of_bedrooms || 0}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {/* <BathIcon className="w-4 h-4" /> */}
                <img src={IMAGES.baths} alt="" className="w-3 h-3" />
                <span className="font-sans font-normal text-xs">Baths:</span>
                <span className="font-sans font-semibold text-primary-foreground text-xs">
                  {property.property_details?.features?.no_of_bathrooms || 0}
                </span>
              </div>
            </div>

            {/* Parking on next line */}
            <div className="flex items-center gap-1">
              <Car className="w-3 h-3 text-slate-600" />
              <span className="font-sans font-normal text-xs">Parking:</span>
              <span className="font-sans font-semibold text-primary-foreground text-xs">
                {property.property_details?.features?.parking || property.property_details?.features?.no_of_garage || 0}
              </span>
            </div>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              if (onLocationClick) {
                onLocationClick(property);
              }
            }}
            className="flex items-center text-gray-600 mb-3 mt-1 hover:text-blue-600 cursor-pointer transition-colors group w-fit"
            title="Click to view building on map"
          >
            <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500 group-hover:text-blue-600 transition-colors shrink-0" />
            <span
              title={property.property_details?.basic?.full_address}
              className="text-[12px] line-clamp-1 group-hover:underline font-medium"
            >
              {property.property_details?.basic?.full_address}
            </span>
          </div>
          <hr className="bg-sidebar-ring" />
          <div className="flex justify-between items-center px-1 mt-2">
            <div className="font-sansflex gap-1 font-normal text-primary-foreground tracking-[0] leading-[19.6px] text-[12px]">
              <span className="text-gray-500 text-[12px]">Posted On:</span>
              <span className="font-bold">
                {property?.createdAt ? dateFormat(property?.createdAt) : ""}
              </span>
            </div>
            <span className="font-bold text-blue-600 text-[15px]">
              $
              {property?.property_details?.rent_details?.weekly_rent_price
                ? property?.property_details?.rent_details?.weekly_rent_price
                : 0}
              <span className="text-[12px] font-medium ml-0.5">
                <span className="text-black">/</span>{" "}
                <span className="text-blue-600">week</span>
              </span>
            </span>
          </div>
        </CardContent>
      </div>
      {isChatscreen && user?.role === "TENANT" ? (
        <Button
          onClick={openScheduleForm}
          title={`Schedule your visit for ${property?.property_details?.basic?.property_name}`}
          variant="outline"
          className="absolute right-3 top-3 rounded-full w-6 h-6 p-0 cursor-pointer flex items-center jistify-center !border !border-primary hover:bg-primary/20"
        >
          <Icon name="ScheduleVisit" className="w-4 h-4" />
        </Button>
      ) : null}
      {user?.role === "TENANT" &&
        property.send_request_status === "APPROVED" && (
          <Button
            onClick={openScheduleForm}
            title={`Schedule your visit for ${property?.property_details?.basic?.property_name}`}
            variant="outline"
            className="absolute right-3 top-3 rounded-full w-6 h-6 p-0 cursor-pointer flex items-center jistify-center !border !border-primary hover:bg-primary/20"
          >
            <Icon name="ScheduleVisit" className="w-4 h-4" />
          </Button>
        )}
    </Card>
  );
};

export default PropertyHorizontal;
