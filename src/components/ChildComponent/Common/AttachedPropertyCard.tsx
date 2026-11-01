import React, { useEffect, useState } from "react";
import {
    MapPin,
} from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { IMAGES } from "../../../assets/index";
import { Checkbox } from "../../ui/checkbox";

type PropertyProps = {
    id: string;
    property: any;
    onCheckboxChange: (id: string) => void;
};

const AttachedPropertyCard: React.FC<PropertyProps> = ({
    id,
    property,
    onCheckboxChange
}) => {
    return (
        <Card
            key={property?._id}
            className={`overflow-hidden hover:shadow-lg transition-shadow mb-5`}>
            <div className="flex">
                <div className="relative w-33 h-35">
                    <img
                        /* src={propertyListings[0]?.url ?? IMAGES.villa_image ?? "/placeholder.svg"} */
                        src={
                            property?.property_details?.documents?.images &&
                            property?.property_details?.documents?.images[0]?.url ||
                            IMAGES.villa_image
                        }
                        alt={property?.property_details?.basic?.property_name}
                        className="w-33 h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                        <Checkbox value={property?._id} onChange={() => onCheckboxChange(property?._id)}/>
                    </div>
                </div>
                <CardContent className="flex-1 p-2 bg-white">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                            {property?.property_details?.basic?.property_name?.length > 20 ? `${property?.property_details?.basic?.property_name.slice(0, 20)}...` : property?.property_details?.basic?.property_name}
                        </h3>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-600 mb-3 mt-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="text-[12px]">
                                {property.property_details?.basic?.full_address?.length > 35 ? `${property.property_details?.basic?.full_address.slice(0, 35)}...` : property.property_details?.basic?.full_address}
                            </span>
                        </div>
                        <span className="font-bold text-blue-600 text-[15px]">
                            ${property.property_details?.rent_details?.weekly_rent_price ? Number(property.property_details?.rent_details?.weekly_rent_price) * 4 : 0}.00 / month
                        </span>
                    </div>
                    <hr className="bg-sidebar-ring" />
                    <div className="flex flex-col items-start sm:gap-1">
                        <div className="flex items-center gap-1 pr-3">
                            <span
                                className="font-sans font-normal text-muted-foreground tracking-[0] leading-[19.6px] text-xs">
                                Property Type:
                            </span>
                            <span
                                className="font-sans font-semibold text-primary tracking-[0] leading-[19.6px] text-xs">
                                {property?.property_details?.basic?.property_type_id?.name || "-"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 pr-3">
                            <span
                                className="font-sans font-normal text-muted-foreground tracking-[0] leading-[19.6px] text-xs">
                                Size:
                            </span>
                            <span
                                className="font-sans font-semibold text-primary tracking-[0] leading-[19.6px] text-xs">
                                {property?.property_details?.features?.land_size ? property?.property_details?.features?.land_size + " sqm" : "-"}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
};

export default AttachedPropertyCard;
