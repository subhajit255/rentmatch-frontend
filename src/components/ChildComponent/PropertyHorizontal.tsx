import React from "react";
import {
  MapPin,
} from "lucide-react";
import { Badge } from "./../ui/badge";
import { Card, CardContent } from "./../ui/card";
import { IMAGES } from "../../assets/index";
import { dateFormat } from "../../lib/utils";

type PropertyHorizontalProps = {
  id?: number;
  // title?: string;
  // location?: string;
  // price?: string;
  // beds?: number;
  // baths?: number;
  // sqm?: string;
  // image?: string;
  // featured?: boolean;
  // forRent?: boolean;
  // postedDate?: string;
  // type?: string;
  // status?: string;
  property: any;
  // onCardClick: (id: string) => void;
};

const PropertyHorizontal: React.FC<PropertyHorizontalProps> = ({
  id,
  property,
  // onCardClick,
}) => {
  return (
    <Card
      key={id}
      className="overflow-hidden hover:shadow-lg shadow-sm mb-5 mt-1 mx-1"
    >
      <div className="flex">
        <div className="relative w-48 h-37">
          <img
            src={property.property_details?.documents?.images.length > 0 ? property.property_details?.documents?.images[0].url  : IMAGES.villa_image}
            alt={property?.property_details?.basic?.property_type_id?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-chart-3 text-foreground hover:bg-chart-3 rounded-[99px] px-2 py-0 h-5 md:h-5">
              <span className="font-sans font-medium text-xs px-1">
                Featured
              </span>
            </Badge>
            {property.property_details?.basic?.is_available_for_rent && (
              <Badge className="bg-white text-destructive-foreground hover:bg-white rounded-[99px] px-2 py-0 h-5 md:h-5">
                <span className="font-sans font-medium text-xs px-1">
                  For Rent
                </span>
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="flex-1 pl-2 pr-2 pt-2">
          <div className="flex justify-between items-start mb-2">
            <h3 title={property?.property_details?.basic?.property_name} className="font-semibold text-gray-900 text-lg line-clamp-1">
              {property?.property_details?.basic?.property_name}
            </h3>
          </div>
          <div className="flex flex-wrap items-start gap-2 md:gap-4">
            <div className="flex items-center gap-1">
              {/* <BedIcon className="w-4 h-4" /> */}
              <img src={IMAGES.beds} alt="" className="w-[15px]" />
              <span className="font-sans font-normal text-muted-foreground text-xs md:text-sm tracking-[0] leading-[19.6px]">
                Beds:
              </span>
              <span className="font-sans font-semibold text-primary-foreground text-xs md:text-sm tracking-[0] leading-[19.6px]">
                {property.property_details?.features?.no_of_bedrooms || 0}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* <BathIcon className="w-4 h-4" /> */}
              <img src={IMAGES.baths} alt="" className="w-[15px]" />
              <span className="font-sans font-normal text-muted-foreground text-xs md:text-sm tracking-[0] leading-[19.6px]">
                Baths:
              </span>
              <span className="font-sans font-semibold text-primary-foreground text-xs md:text-sm tracking-[0] leading-[19.6px]">
                {property.property_details?.features?.no_of_bathrooms || 0}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* <SquareIcon className="w-4 h-4" /> */}
              <img src={IMAGES.sqm} alt="" className="w-[15px]" />
              <span className="font-sans font-normal text-muted-foreground text-xs md:text-sm tracking-[0] leading-[19.6px]">
                sqm:
              </span>
              <span className="font-sans font-semibold text-primary-foreground text-xs md:text-sm tracking-[0] leading-[19.6px]">
                {property.property_details?.features?.floor_area || 0}
              </span>
            </div>
          </div>
          <div className="flex items-center text-gray-600 mb-3 mt-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {property.property_details?.basic?.full_address.length > 35 ? `${property.property_details?.basic?.full_address.slice(0, 35)}..` : property.property_details?.basic?.full_address}
            </span>
          </div>
          <hr />
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-500">Posted On: {property.property_details?.rent_details?.available_from ? dateFormat(property.property_details?.rent_details?.available_from) : ""}</div>
            <span className="text-2xl font-bold text-blue-600">${property.property_details?.rent_details?.weekly_rent_price ? Number(property.property_details?.rent_details?.weekly_rent_price) * 4 : 0}.00</span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default PropertyHorizontal;
