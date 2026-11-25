import React, { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookmarkIcon, MapPinIcon } from "lucide-react";
import { Badge } from "./../../ui/badge";
import { Button } from "./../../ui/button";
import { Card, CardContent } from "./../../ui/card";
import { Separator } from "./../../ui/separator";
import { IMAGES } from "../../../assets/index";
import { Sheet, SheetTrigger } from "../../ui/sheet";
import PropertySheet from "./PropertySheet";
import { dateFormat } from "../../../lib/utils";
import { useSheet } from "../../../context/sheetProvider";
import Icon from "../../icons/icon";
import { useAuth } from "../../../context/AuthContext";
import { openMatchingPreferencesModal } from "../../modals/RenterPreferencesModalManager";

type PropertyProps = {
  id: string | number;
  property: any;
  onLocationClick?: (property: any) => void;
  // onCardClick: (id: string) => void;
};

const Property: React.FC<PropertyProps> = ({
  id,
  property,
  onLocationClick,
  // onCardClick,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // console.log(id,"<---id hai ??")
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

  useEffect(() => {
    // console.log("propertyListings ::: ", propertyListings);
  }, [propertyListings]);

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
      className={`bg-white overflow-hidden hover:shadow-lg shadow-sm rounded-[10px]`}
      onClick={() => {
        setDrawerParameters({
          id: id,
          property: property,
        });
        openSheet("propertyDetails");
      }}
    >
      <div className="relative">
        <div
          className="h-[140px] bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${property.property_details?.documents?.images.length > 0 ? property.property_details?.documents?.images[0].url : IMAGES.villa_image})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
            <div className="absolute top-2.5 left-2.5">
              <div className="flex items-center gap-2">
                {property.property_details?.basic?.property_type_id?.name !=
                  null &&
                  property.property_details?.basic?.property_type_id?.name
                    ?.length > 0 && (
                    <Badge className="bg-[#f3d034] text-foreground hover:bg-[#f3d034] rounded-[99px] px-1 py-0 h-5 md:h-5">
                      <span className="font-sans font-medium text-xs px-1">
                        {property.property_details?.basic?.property_type_id
                          ?.name?.length > 18
                          ? `${property.property_details?.basic?.property_type_id?.name.slice(0, 18)}..`
                          : property.property_details?.basic?.property_type_id
                              ?.name}
                      </span>
                    </Badge>
                  )}
                {property.property_details?.basic?.is_available_for_rent && (
                  <Badge className="bg-white text-[#08914f] hover:bg-white rounded-[99px] px-1 py-0 h-5 md:h-5">
                    <span className="font-sans font-medium text-xs px-1">
                      For Rent
                    </span>
                  </Badge>
                )}
              </div>
              {property.is_send_request == true && (
                <div className="flex items-start mt-2">
                  <Badge className="bg-primary text-foreground rounded-[99px] px-1 py-0 h-5 md:h-5">
                    <span className="font-sans font-medium text-[12px] text-background">
                      Request Send
                    </span>
                  </Badge>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-[237px] right-[9px] w-6 h-6 p-0 hover:bg-transparent"
            >
              <BookmarkIcon className="w-6 h-6 text-white" />
            </Button>

            <div
              onClick={(e) => {
                e.stopPropagation();
                if (onLocationClick) {
                  onLocationClick(property);
                }
              }}
              className="absolute bottom-2 left-2 flex items-center gap-1 cursor-pointer hover:underline z-10"
              title="Click to view building on map"
            >
              <MapPinIcon className="w-4 h-4 text-white" />
              <span className="font-sans font-normal text-white text-sm tracking-[0] leading-[19.6px]">
                {property.property_details?.basic?.full_address?.length > 15
                  ? `${property.property_details?.basic?.full_address.slice(0, 15)}..`
                  : property.property_details?.basic?.full_address}
              </span>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-2">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col relative">
            {user?.role === "TENANT" &&
              property.send_request_status === "APPROVED" && (
                <Button
                  onClick={openScheduleForm}
                  title={`Schedule your visit for ${property?.property_details?.basic?.property_name}`}
                  variant="outline"
                  className="absolute right-3 top-1 rounded-full w-6 h-6 p-0 cursor-pointer flex items-center jistify-center !border !border-primary hover:bg-primary/20"
                >
                  <Icon name="ScheduleVisit" className="w-7 h-7" />
                </Button>
              )}
            <h4
              title={property?.property_details?.basic?.property_name}
              className="font-sans font-semibold text-foreground text-md flex items-start line-clamp-1"
            >
              {property?.property_details?.basic?.property_name}
            </h4>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 shrink-0">
                  {/* <BedIcon className="w-4 h-4" /> */}
                  <img src={IMAGES.beds} alt="" className="w-3 h-3" />
                  <span className="font-sans font-normal text-xs">Beds:</span>
                  <span className="font-sans font-semibold text-primary-foreground text-xs">
                    {property.property_details?.features?.no_of_bedrooms || 0}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* <BathIcon className="w-4 h-4" /> */}
                  <img src={IMAGES.baths} alt="" className="w-3 h-3" />
                  <span className="font-sans font-normal text-xs">Baths:</span>
                  <span className="font-sans font-semibold text-primary-foreground text-xs">
                    {property.property_details?.features?.no_of_bathrooms || 0}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* <SquareIcon className="w-4 h-4" /> */}
                <img src={IMAGES.sqm} alt="" className="w-3 h-3" />
                <span className="font-sans font-normal text-xs">Area:</span>
                <span className="font-sans font-semibold text-primary-foreground text-xs">
                  {property.property_details?.features?.floor_area || 0}
                </span>
              </div>
            </div>
          </div>

          <hr className="bg-sidebar-ring" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <span className="font-sans font-normal text-primary-foreground tracking-[0] leading-[19.6px] text-[12px]">
                <span className="font-medium">Posted On: </span>
                <span className="font-bold">
                  {property?.createdAt ? dateFormat(property?.createdAt) : ""}
                </span>
              </span>
            </div>
            <div className="font-sans font-bold text-primary tracking-[0] leading-7 text-[15px]">
              $
              {property.property_details?.rent_details?.weekly_rent_price
                ? Number(
                    property?.property_details?.rent_details?.weekly_rent_price,
                  ).toLocaleString()
                : 0}
              {property.property_details?.rent_details?.weekly_rent_price ? " / week" : ".00"}
            </div>
          </div>

          {/* Match Percentage Badge - Navigates to match breakdown */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              const propId = property?._id || id;
              navigate(`/property-match/${propId}`, { state: { property } });
            }}
            className="mt-2 w-full bg-[#E8F8EE] hover:bg-[#D1F2DE] transition-colors cursor-pointer text-[#065F46] rounded-xl py-1.5 px-3 flex items-center justify-center group shadow-2xs"
            title="Click to view full match score breakdown"
          >
            <span className="font-bold text-xs tracking-wide group-hover:underline">
              {property?.matching_percentage ??
                property?.matchPercentage ??
                property?.matchScore ??
                property?.match_percentage ??
                property?.match ??
                (id
                  ? 88 +
                    (Math.abs(
                      typeof id === "string"
                        ? id
                            .split("")
                            .reduce((acc, c) => acc + c.charCodeAt(0), 0)
                        : Number(id),
                    ) %
                      10)
                  : 92)}
              % match
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Property;
