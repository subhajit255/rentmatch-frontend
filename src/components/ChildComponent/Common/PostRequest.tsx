import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { IMAGES } from "../../../../src/assets";
import { MapPin } from "lucide-react";
import { useSheet } from "../../../../src/context/sheetProvider";

type PostProps = {
    type?: boolean;
    property?: any;
    id?: string;
}

const PostRequest: React.FC<PostProps> = ({ type, property, id }) => {
    const { openSheet, setParameters: setDrawerParameters } = useSheet();
    // console.log(id, "<====???")
    return (
        <Card
            key={1}
            className={`overflow-hidden hover:shadow-lg transition-shadow mb-5 border-[1px]`}
        /* onClick={() => onCardClick(String(id))} */
        >
            <div className="flex">
                <div className="relative w-33 h-35">
                    <img
                        src={IMAGES.villa_image || "/placeholder.svg"}
                        alt={`property`}
                        className="w-33 h-full object-cover"
                    />
                </div>
                <CardContent className="flex-1 p-2 bg-white">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                            {property?.property_details?.basic?.property_name.length > 30 ? `${property?.property_details?.basic?.property_name.slice(0, 30)}...` : property?.property_details?.basic?.property_name || ""}
                        </h3>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-600">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="text-[12px]">
                                {property?.property_details?.basic?.full_address.length > 35 ? `${property?.property_details?.basic?.full_address.slice(0, 35)}...` : property?.property_details?.basic?.full_address || ""}
                            </span>
                        </div>
                        <span className="font-bold text-blue-600 text-[15px]">
                            ${property.property_details?.rent_details?.weekly_rent_price ? Number(property.property_details?.rent_details?.weekly_rent_price) * 4 : 0}.00
                        </span>
                    </div>
                    <hr className="bg-sidebar-ring my-2" />
                    <div className="flex justify-between items-center">
                        {type ? (
                            <div className="flex items-center gap-2">
                                <img src={IMAGES.user_img} alt="" className="w-[48px] h-[48px] rounded-full object-cover" />
                                <div>
                                    <p className="text-sm font-medium">Anonymous</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <img src={IMAGES.dummy_img} alt="" className="w-[48px] h-[48px] rounded-full object-cover" />
                                <div>
                                    <p className="text-sm font-medium">{property?.created_by?.first_name || ""} {property?.created_by?.last_name || ""}</p>
                                    <p className="text-xs text-gray-500">{property?.created_by?.phone_number || ""}</p>
                                </div>
                            </div>
                        )}
                        <div>
                            <button className="bg-white text-primary px-3 py-1 rounded-2xl text-sm border border-primary" onClick={() => {
                                setDrawerParameters({
                                    id: id
                                });
                                openSheet("propertyDetails");
                            }}>View Details</button>
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
};

export default PostRequest;
