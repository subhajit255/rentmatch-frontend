import React, { MouseEvent, useEffect, useState } from "react";
import { MapPin } from "lucide-react";
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

type PropertyHorizontalProps = {
  id: string;
  property: any;
  isChatscreen?: boolean
  // onCardClick: (id: string) => void;
};


const PropertyHorizontal: React.FC<PropertyHorizontalProps> = ({
  id,
  property,
  isChatscreen = false
  // onCardClick,
}) => {
  const { user } = useAuth();
  const { openSheet, setParameters: setDrawerParameters } = useSheet();
  const [propertyListings, setpropertyListings] = useState<any[]>([]);

  const { property_details } = property;
  const { basic, rent_details, features, additional_information, documents, ...rest } = property_details || {};

  useEffect(() => {
    // console.log("documents ::: ", documents);

    if (documents) {

      if (documents?.images)
        setpropertyListings(prev => ([...prev, ...documents?.images]))
      if (documents?.videos)
        setpropertyListings(prev => ([...prev, ...documents?.videos]))
      if (documents?.floorPlans)
        setpropertyListings(prev => ([...prev, ...documents?.floorPlans]))
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
  }

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
        <div className="relative ">
          <div className="relative w-33 h-35 flex-shrink-0">
            <img
              src={propertyListings[0]?.url ?? IMAGES.villa_image ?? "/placeholder.svg"}
              alt={property?.property_details?.basic?.property_name}
              className="w-33 h-full object-cover"
            />
          </div>
          <div className="absolute top-3 left-3 flex gap-2">
            {property.property_details?.basic?.property_type_id?.name && (
              <Badge className="bg-chart-3 text-foreground hover:bg-chart-3 rounded-[99px] px-1 py-0 h-5 md:h-5">
                <span
                  className="font-sans font-medium text-[12px]"
                >
                  {property.property_details?.basic?.property_type_id?.name.length > 6 ? `${property.property_details?.basic?.property_type_id?.name.slice(0, 6)}..` : property.property_details?.basic?.property_type_id?.name}
                </span>
              </Badge>
            )}
            {property.property_details?.basic?.is_available_for_rent && (
              <Badge className="bg-white text-[#08914f] hover:bg-white rounded-[99px] px-1 py-0 h-5 md:h-5">
                <span
                  className="font-sans font-medium text-[12px]"
                >
                  For Rent
                </span>
              </Badge>
            )}
          </div>
          {property.is_send_request == true && (
            <div className="absolute bottom-3 right-3 flex gap-2">
              <Badge className="bg-primary text-foreground rounded-[99px] px-1 py-0 h-5 md:h-5">
                <span
                  className="font-sans font-medium text-xs px-2 flex items-center justify-center text-background"
                >
                 {property.send_request_status === 'APPROVED' ? "Approved" : "Request Sent" } 
                </span>
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="flex-1 p-2 bg-white">
          <div className="flex justify-between items-start mb-2">
            <h3 title={property?.property_details?.basic?.property_name} className="font-semibold text-gray-900 text-lg truncate w-[200px]">
              {property?.property_details?.basic?.property_name}
            </h3>
          </div>
          <div className="flex flex-wrap items-start gap-2 md:gap-2">
            <div className="flex items-center gap-1">
              {/* <BedIcon className="w-4 h-4" /> */}
              <img src={IMAGES.beds} alt="" className="w-3 h-3" />
              <span
                className="font-sans font-normal text-xs"
              >
                Beds:
              </span>
              <span
                className="font-sans font-semibold text-primary-foreground text-xs"
              >
                {property.property_details?.features?.no_of_bedrooms || 0}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* <BathIcon className="w-4 h-4" /> */}
              <img src={IMAGES.baths} alt="" className="w-3 h-3" />
              <span
                className="font-sans font-normal text-xs"
              >
                Baths:
              </span>
              <span
                className="font-sans font-semibold text-primary-foreground text-xs"
              >
                {property.property_details?.features?.no_of_bathrooms || 0}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* <SquareIcon className="w-4 h-4" /> */}
              <img src={IMAGES.sqm} alt="" className="w-3 h-3" />
              <span
                className="font-sans font-normal text-xs"
              >
                sqm:
              </span>
              <span
                className="font-sans font-semibold text-primary-foreground text-xs"

              >
                {property.property_details?.features?.floor_area || 0}
              </span>
            </div>
          </div>
          <div className="flex items-center text-gray-600 mb-3 mt-2">
            <MapPin className="h-3 w-3 mr-1" />
            <span
              title={property.property_details?.basic?.full_address}
              className="text-[12px] line-clamp-1">
              {property.property_details?.basic?.full_address}
            </span>
          </div>
          <hr className="bg-sidebar-ring" />
          <div className="flex justify-between items-center px-1 mt-2">
            <div className="font-sansflex gap-1 font-normal text-primary-foreground tracking-[0] leading-[19.6px] text-[12px]">
              <span className="text-gray-500 text-[12px]">Posted On:</span>
              <span className="font-bold">{property?.createdAt ? dateFormat(property?.createdAt) : ""}</span>
            </div>
            <span className="font-bold text-blue-600 text-[15px]">
              ${property?.property_details?.rent_details?.weekly_rent_price ? property?.property_details?.rent_details?.weekly_rent_price : 0}
            </span>
          </div>
        </CardContent>
      </div>
      {
        isChatscreen && user?.role === "TENANT" ? <Button onClick={openScheduleForm} title={`Schedule your visit for ${property?.property_details?.basic?.property_name}`} variant="outline" className="absolute right-3 top-3 rounded-full w-6 h-6 p-0 cursor-pointer flex items-center jistify-center !border !border-primary hover:bg-primary/20">
        <Icon name="ScheduleVisit" className="w-4 h-4" />
      </Button> : null
      }
      {user?.role === "TENANT" && property.send_request_status === "APPROVED" && <Button onClick={openScheduleForm} title={`Schedule your visit for ${property?.property_details?.basic?.property_name}`} variant="outline" className="absolute right-3 top-3 rounded-full w-6 h-6 p-0 cursor-pointer flex items-center jistify-center !border !border-primary hover:bg-primary/20">
        <Icon name="ScheduleVisit" className="w-4 h-4" />
      </Button>}
    </Card>
  );
};

export default PropertyHorizontal;
