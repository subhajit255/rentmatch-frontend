import React, { useEffect, useState } from "react";
import { Calendar, EllipsisVertical, MapPin } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { IMAGES } from "../../../assets/index";
import ToggleButton from "../ToggleButton";
import { useNavigate } from "react-router-dom";
import Icon from "../../icons/icon";
// import {
//     Sheet,
//     SheetTrigger,
// } from "../../../components/ui/sheet";
// import PropertySheet from "./PropertySheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../../../custom-hooks/use-toast";
import { deletePropertyApi, rentalAvailabilityApi } from "../../../actions/property";
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
    console.log(property, "<---prop ind")
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // const [showDetails, setShowDetails] = useState(false); // State to control visibility
    const { openModal, setParameters, closeModal } = useModal();
    const { openSheet, setParameters: setDrawerParameters, closeSheet } = useSheet();

    const { _id, property_details, is_active } = property || {};
    const { basic, rent_details, features, additional_information, documents, ...rest } = property_details || {};

    if (dropDownref) {
        useClickOutside(dropDownref, () => {
            setOpenRowId?.(null); // Close dropdown when clicking outside
        }, true, openRowId);
    }

    // useEffect(() => {
    //     // console.log("basic ::: ", basic);
    //     // console.log("rent_details ::: ", rent_details);
    //     // console.log("features ::: ", features);
    //     // console.log("additional_information ::: ", additional_information);
    //     // console.log("rest ::: ", rest);
    // }, [basic, rent_details, features, additional_information, rest]);

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const { mutate: deleteProperty } = useMutation({
        mutationFn: deletePropertyApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['property'] });
            toast({
                title: `Property Deleted`,
                description: `Property has been deleted in the system.`,
                variant: "success",
            })
            closeModal()
        },
        onError: (error) => {
            // setServerError(error.response?.data?.message || 'Can not able to add user.');
            toast({
                title: `Delete Failed`,
                description: `Could not delete the property. Please check try again.`,
                variant: "error",
            })
        },
    });

    // const handleDelete = (_id: string) => {
    //     // console.log("Delete plan action triggered.");

    //     openModal("remove")
    //     setParameters({
    //         header: `Are you sure you want to permanently delete this record?`,
    //         description: `This action cannot be undone and may affect related data.`,
    //         fn: () => deleteProperty(_id)
    //     })
    // }

    const { mutate: rentalAvailability, isPending: isRentalAvailabilityPending } = useMutation({
        mutationFn: rentalAvailabilityApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['property'] });
            queryClient.invalidateQueries({ queryKey: ['propertyDetails'] });
            toast({
                title: `Rental Availability Updated`,
                description: `Property rental availability has been updated in the system.`,
                variant: "success",
            })
        },
        onError: (error) => {
            // setServerError(error.response?.data?.message || 'Can not able to add user.');
            toast({
                title: `Rental Availability Failed`,
                description: `Could not updated the property rental availability. Please check try again.`,
                variant: "error",
            })
        },
    });

    // const handleEditPlan = () => {
    //     // console.log("property ::: ", property);

    //     navigate("/property/edit/", { state: { ...property } })
    // }

    const handleAction = (e: any, actionName: string) => {
    if (actionName === "Edit") {
      navigate("/property/edit/", { state: { ...property } })
    } else if (actionName === "Remove") {
      // Call delete function here
      openModal("remove")
        setParameters({
            header: `Are you sure you want to permanently delete this record?`,
            description: `This action cannot be undone and may affect related data.`,
            fn: () => deleteProperty(_id)
        })

    }
  };

    return (
        <Card
            key={_id}
            className={`overflow-hidden hover:shadow-lg bg-white transition-shadow mb-5 p-2 border border-card-border`}
        >
            <div className="flex gap-2 justify-between items-center">
                <div className="flex gap-4 2xl:gap-8 items-center">
                    <div className="w-[186px]">
                        <img src={documents ? documents?.images[0]?.url ??  IMAGES.villa_image : IMAGES.villa_image} alt="" className="h-[124px] w-full rounded-2xl" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <h3 title={property?.property_details?.basic?.property_name} className="font-semibold text-foreground sm:text-md md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl line-clamp-1">
                                {stringLengthFormat(property?.property_details?.basic?.property_name, 30)}
                            </h3>
                        </div>
                        <ul className="flex items-center gap-4">
                            <li>
                                <div className="flex items-center gap-1">
                                    <img src={IMAGES.beds} alt="" className="w-4 h-4" />
                                    <span className="font-sans font-normal text-sm xl:text-base 2xl:text-xl text-card">
                                        Beds:
                                    </span>
                                    <span className="font-sans font-semibold text-primary-foreground text-sm xl:text-base 2xl:text-xl">
                                        {property?.property_details?.features?.no_of_bedrooms || 0}
                                    </span>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center gap-1">
                                    <img src={IMAGES.baths} alt="" className="w-4 h-4" />
                                    <span className="font-sans font-normal text-sm xl:text-base 2xl:text-xl text-card">
                                        Baths:
                                    </span>
                                    <span className="font-sans font-semibold text-primary-foreground text-sm xl:text-base 2xl:text-xl">
                                        {property?.property_details?.features?.no_of_bathrooms || 0}
                                    </span>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center gap-1">
                                    <img src={IMAGES.sqm} alt="" className="w-4 h-4" />
                                    <span className="font-sans font-normal text-sm xl:text-base 2xl:text-xl text-card">
                                        sqm:
                                    </span>
                                    <span className="font-sans font-semibold text-primary-foreground text-sm xl:text-base 2xl:text-xl">
                                        {property?.property_details?.features?.floor_area || 0}
                                    </span>
                                </div>
                            </li>
                        </ul>
                        <div className="flex items-center justify-between gap-10">
                            <div className="flex items-center text-gray-600">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span 
                                title={property?.property_details?.basic?.full_address || ""} 
                                className="text-base text-primary font-medium line-clamp-1">
                                    {stringLengthFormat(property?.property_details?.basic?.full_address, 50 )}
                                    {/* {property?.property_details?.basic?.full_address || ""} */}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between gap-4 2xl:gap-8">
                    <div className="flex items-center text-gray-600 mb-1 items-end">
                        <p>
                            <span className="text-base xl:text-lg 2xl:text-xl font-semibold">Rent : </span>
                            <span className="text-base xl:text-lg 2xl:text-xl font-semibold text-primary">{"$" + property?.property_details?.rent_details?.weekly_rent_price ? Number(property?.property_details?.rent_details?.weekly_rent_price) * 4 : 0 + ".00"}</span>
                            <span className="text-sm xl:text-base 2xl:text-xl font-normal text-muted-foreground">/month</span>
                        </p>
                    </div>
                    <div
                        className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-4">
                                <div className="font-sanstext-card-foreground text-sm font-semibold">
                                    Available for Rent?
                                </div>
                                {/* <a href="#" onClick={() => rentalAvailability(String(id))}> */}
                                <ToggleButton onToggle={() => { if (!isRentalAvailabilityPending) rentalAvailability(id); }}isToggled={property?.property_details?.basic?.is_available_for_rent || false} />

                                {/* <ToggleButton defaultToggled={property?.property_details?.basic?.is_available_for_rent || false} /> */}
                                {/* </a> */}
                            </div>
                        </div>
                            {/* Insted of 1 enter the response quentity */}
                        {/* <div className="flex items-center gap-2">
                            <Icon name="MessageResponse" className={`w-5 h-5 ${1 > 0 ? "stroke-primary" : "stroke-[#A3ABB0]"}`} fill="none" />
                            <div className={`font-sanstext-base font-medium ${1 > 0 ? 'text-primary' : 'text-[#A3ABB0]'}`}>
                                {1} Responses
                            </div>
                        </div> */}
                        <div className="">
                            <Button className="px-4 bg-white hover:bg-primary rounded-[99px] text-primary hover:text-white shadow-none border border-primary px-5 py-2"
                                onClick={() => {
                                    setDrawerParameters({
                                        id: id,
                                        property: property,
                                    });
                                    openSheet("propertyDetails");
                                }}>
                                View Details
                            </Button>
                            {/* <Sheet>
                                <SheetTrigger className="px-4 hover:bg-primary rounded-[99px] text-primary hover:text-white shadow-none border border-primary px-5 py-2">View Details</SheetTrigger>
                                <PropertySheet id={id}
                                    property={property}
                                />
                            </Sheet> */}
                        </div>
                    </div>
                    {/* <div className="relative inline-block text-left">
                        <div>
                            <a href="#" onClick={toggleDropdown}>
                                <EllipsisVertical className="text-[#00000054]" />
                            </a>
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                                <ul className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                    <li onClick={handleEditPlan} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                                        Edit
                                    </li>
                                    <li onClick={() => handleDelete(_id)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                                        Delete
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div> */}
                    <div
                        ref={(el) => { dropDownref?.current && (dropDownref.current[_id] = el); }}
                        id={_id}
                        className="relative inline-block text-left cursor-pointer"
                        onClick={() => setOpenRowId?.((prev: any) => (prev && prev === _id ? null : _id))}
                    >
                        <Icon
                            name="EllipsisVertical"
                            className={"w-4 h-4 " + (openRowId === _id ? " text-primary/10" : " text-primary")}
                        />
                        {openRowId === _id &&
                            <DropDown className="absolute z-10 right-2 min-w-[150px]"
                                list={[{ name: 'Edit', icon: 'PenBoxIcon' }, { name: 'Remove', icon: 'DeleteIcon' }]}
                                handleAction={handleAction} />}
                    </div>

                </div>
            </div>
        </Card>
    );
};

export default MyProperty;
