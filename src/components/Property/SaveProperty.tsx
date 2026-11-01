import React, { useCallback, useEffect, useState } from "react";
import { IMAGES } from "../../assets";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "../ui/card";
import { getSavedProperty } from "../../../src/actions/property";
import Property from "../ChildComponent/Common/Property";
import { getPropertyTypeList, getPropertyWishlistTypeList } from "../../../src/actions/propertyMaster";
import { useSearchParams } from "react-router-dom";

// const propertyTypes = [
//     {
//         icon: IMAGES.apartment,
//         title: "Apartment",
//         count: "234 Property",
//     },
//     {
//         icon: IMAGES.house,
//         title: "House",
//         count: "234 Property",
//     },
//     {
//         icon: IMAGES.granny_flat,
//         title: "Granny Flat",
//         count: "234 Property",
//     },
//     {
//         icon: IMAGES.duplex,
//         title: "Duplex",
//         count: "234 Property",
//     },
//     {
//         icon: IMAGES.villa,
//         title: "Villa",
//         count: "234 Property",
//     },
//     {
//         icon: IMAGES.office,
//         title: "Office",
//         count: "234 Property",
//     },
// ];

const SaveProperty = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTypeId = searchParams.get("type");

    const dropDownref = React.useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [openRowId, setOpenRowId] = useState<string | null>(null);
    const [pagination, setPagination] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [list, setList] = useState<any[]>([]);
    const [selectedTypeId, setSelectedTypeId] = useState<string | null>(initialTypeId);

    const { data: propertyTypes, isLoading: typesLoading } = useQuery({
        queryKey: ['property-wishlit-Type'],
        queryFn: () => getPropertyWishlistTypeList({}),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    // console.log(!typesLoading && propertyTypes, "<---propertytypes")

    const { data: savedProperties, isLoading } = useQuery({
        queryKey: ['savedProperties', currentPage, limit, selectedTypeId],
        queryFn: () => getSavedProperty({
            page: currentPage,
            limit,
            propertyType: selectedTypeId || undefined,
        }),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!propertyTypes // wait until types are loaded 
    });
    // console.log(savedProperties, "<---saved propertys")
    const properties = savedProperties?.result || [];
    // console.log(properties, "<----opt propertys")

    useEffect(() => {
        if (!typesLoading && propertyTypes?.result?.length > 0 && selectedTypeId === null) {
            const firstId = propertyTypes?.result[0].propertyType._id || null;
            setSelectedTypeId(firstId);
            setSearchParams({ type: firstId }, { replace: true });
        }
    }, [typesLoading, propertyTypes, selectedTypeId, setSearchParams]);

    // go back to the first page whenever the selected type changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedTypeId]);

    useEffect(() => {
        if (selectedTypeId) {
            setSearchParams({ type: selectedTypeId }, { replace: true });
        } else {
            setSearchParams({}, { replace: true });
        }
    }, [selectedTypeId, setSearchParams]);

    useEffect(() => {
        setList(savedProperties?.result || []);
        setPagination(savedProperties?.pagination || []);

    }, [savedProperties]);

    const totalPages = savedProperties?.pagination?.totalPages;
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleTypeSelect = useCallback((typeId: string) => {
        setSelectedTypeId((prev) => (prev === typeId ? null : typeId));
    }, []);

    // console.log("savedProperties", list[0]?.property_object_id);

    if (isLoading && typesLoading) {
        return (
            <div className="flex justify-center items-center mt-10 blur-md pointer-events-none">
                <div className="flex justify-center items-center flex-col">
                    <img
                        src={IMAGES.error}
                        alt="No Properties"
                        className="mb-4 w-[50%]"
                    />
                    <p className="text-2xl">
                        No properties are saved !
                    </p>
                </div>
            </div>
        )
    }

    if (properties && properties.length === 0) {
        return (
            <div className="flex justify-center items-center mt-10">
                <div className="flex justify-center items-center flex-col">
                    <img
                        src={IMAGES.error}
                        alt="No Properties"
                        className="mb-4 w-[50%]"
                    />
                    <p className="text-2xl">
                        No properties are saved !
                    </p>
                </div>
            </div>
        )
    }


    return (
        <div className="common-container bg-white rounded-2xl">
            <div className="w-full mx-auto flex flex-col gap-5">
                <div className="space-y-6 overflow-y-auto thin-scrollbar  scrollbar-hidden flex gap-2 pt-4 pl-2" >
                    <div className="w-1/5">
                        <div className={`flex flex-col items-center gap-3`}
                        >
                            <div
                                className={`w-full gap-4 ml-2`}
                            >
                                {typesLoading ? (
                                    <div className="text-center py-8 text-gray-500">Loading types...</div>
                                ) : (
                                    propertyTypes?.result?.map((property: any, index: number) => {
                                        const isSelected = selectedTypeId === property?.propertyType?._id;
                                        return (
                                            <Card
                                                key={index}
                                                // className="w-full bg-white rounded-2xl border border border-sidebar-ring hover:shadow-lg transition-shadow cursor-pointer my-2"
                                                className={`cursor-pointer transition-all hover:shadow-md ${isSelected
                                                    ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                                                    : "hover:border-gray-300"
                                                    }`}
                                                onClick={() => handleTypeSelect(property.propertyType?._id)}
                                            >
                                                <CardContent className="flex items-center justify-center gap-2 h-full px-2 py-5">
                                                    <img
                                                        className="w-12 h-12 md:w-10 md:h-10"
                                                        alt={`${property.name || 'Apartment'} icon`}
                                                        src={IMAGES[property?.propertyType?.img.toLowerCase() as keyof typeof IMAGES] || IMAGES.apartment}
                                                    />

                                                    <div className="flex flex-col items-center justify-center gap-1">
                                                        <div className="font-sans font-bold text-foreground sm:text-sm md:text-md text-center tracking-[0] leading-[25.2px]">
                                                            {property?.propertyType?.name || "N/A"}
                                                        </div>

                                                        <div className="font-sans font-medium text-primary-foreground text-xs md:text-sm text-center tracking-[0] leading-[19.6px]">
                                                            {property.count || "0"}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    }
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-4/5 m-2">
                        {
                            properties && properties?.length > 0 ? (
                                <div className="grid grid-cols-3">
                                    {properties.map((property: any, index: number) => (
                                        <div
                                            key={property?._id}
                                            className="px-2 col-span-1 mb-5"
                                        >
                                            <Property
                                                id={property?.property_details?._id}
                                                property={property?.property_details}
                                            // onCardClick={() => handleCardClick(property?.property_object_id?._id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-3">No data availabe</div>
                            )
                        }

                        <div className="flex justify-between mt-4">
                            <button onClick={handlePreviousPage} disabled={currentPage === 1} className="bg-gray-300 p-2 rounded">
                                Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-gray-300 p-2 rounded">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
                {/* <div className="flex justify-center items-center mt-10">
                    <div className="flex justify-center items-center flex-col">
                        <img src={IMAGES.error} alt="No Properties" className="mb-4 w-[50%]" />
                        <p className="text-2xl">As of now, no properties have been saved by you. We encourage you to save your property</p>
                    </div>
                </div> */}
            </div>
        </div>
    );
};
export default SaveProperty;
