import React, { useEffect, useRef, useState } from "react";
import { IMAGES } from "../../../src/assets";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostDetails } from "../../../src/actions/myPost";
import { Calendar, MapPin, Lock, CheckCircle2 } from "lucide-react";
import Icon from "../icons/icon";
import { deletePropertyApi, getProperty } from "../../../src/actions/property";
import PropertyDropDown from "../ui/propertyDropDown";
import { useModal } from "../../../src/context/modalProvider";
import { useClickOutside } from "../../../src/custom-hooks/use-clickOutside";

const TenantPostDetails = () => {
    const { openModal, setParameters, closeModal } = useModal();
    const [openRowId, setOpenRowId] = useState<string | null>(null);
    const [isRequestDropdownOpen, setIsRequestDropdownOpen] = useState(false);
    const [post, setPost] = useState<any>(null);
    const [list, setList] = useState<any[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.pathname.split('/').pop();
    const { data: postDetails, isLoading, error } = useQuery({
        queryKey: ['postDetails', id],
        queryFn: () => getPostDetails(id!),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    const { data: property, isLoading: propertyLoading, error: propertyError } = useQuery({
        queryKey: ['property'],
        queryFn: () => getProperty(1, 100),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setPost(postDetails?.result || null);
        setList(property?.result || []);
    }, [postDetails, property]);

    // const amenitiesArray = post?.amenities ? post?.amenities[0].split(',') : [];

    const handleAction = (e: any, actionName: string) => {
        if (actionName === "Edit") {
            navigate("/tenant-post-details/" + id);
        } else if (actionName === "Remove") {
            // Call delete function here
            openModal("remove")
            setParameters({
                header: `Are you sure you want to permanently delete this record?`,
                description: `This action cannot be undone and may affect related data.`,
                fn: () => deletePropertyApi(id!)
            })

        }
    };

    const dropdownWrapperRef = useRef<HTMLDivElement | null>(null);

    useClickOutside(
        dropdownWrapperRef,
        () => {
            setOpenRowId(null);
        },
        true,
        openRowId
    );


    return (
        <div className="common-container">
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-center gap-4">
                    <div>
                        <img src={IMAGES.user_img} alt="" className="w-[139px] h-[139px] rounded-full object-cover border border-dashed border-primary" />
                    </div>
                    {/* <div>
                        <h2 className="text-2xl font-semibold">{post?.created_by?.first_name || ""} {post?.created_by?.last_name || ""}</h2>
                        <p className="text-sm text-muted-foreground">{post?.created_by?.email || ""}</p>
                        <p className="text-sm text-muted-foreground">{post?.created_by?.phone_extension || ""} {post?.created_by?.phone_number || ""}</p>
                        <p className="text-sm text-muted-foreground">{post?.created_by?.gender || ""}</p>
                    </div> */}

                    <div>
                        {post?.invitation_status === "APPROVED" ? (
                            <>
                                <h2 className="text-2xl font-semibold flex items-center gap-2">
                                    {post?.created_by?.first_name || ""} {post?.created_by?.last_name || ""}
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                                    </span>
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {post?.created_by?.email || ""}
                                </p>
                                {post?.created_by?.phone_number && (
                                    <p className="text-sm text-muted-foreground">
                                        {post?.created_by?.phone_extension || ""} {post?.created_by?.phone_number}
                                    </p>
                                )}
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl font-semibold">
                                    {post?.created_by?.user_name?.toUpperCase()?.startsWith("RM-")
                                        ? `Renter ${post.created_by.user_name.toUpperCase()}`
                                        : post?.created_by?.member_id?.toUpperCase()?.startsWith("RM-")
                                        ? `Renter ${post.created_by.member_id.toUpperCase()}`
                                        : "Renter (Identity Private)"}
                                </h2>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                                    Identity & contact details stay private until renter accepts your invitation.
                                </p>
                            </>
                        )}
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {post?.created_by?.gender || ""}
                        </p>
                    </div>

                </div>
                <div ref={dropdownWrapperRef} className="relative flex border rounded-lg py-2">
                    <div
                        id={id}
                        className="relative inline-block text-left cursor-pointer"
                        onClick={() => {
                            if (!post?.is_send_request) {
                                setIsRequestDropdownOpen(prev => !prev);
                                setOpenRowId((prev) => (prev === id ? null : id!));
                            }
                        }}
                    >
                        <Button
                            variant="ghost"
                            size="lg"
                            disabled={
                                post?.is_send_request == true || list.length === 0
                            }
                            className="px-3 hover:bg-white bg-primary rounded-[99px] hover:text-primary text-white shadow-none border border-primary px-4 py-2 text-xs lg:text-sm 2xl:text-base"
                        >
                            {post?.invitation_status === "APPROVED"
                                ? "Connected"
                                : post?.is_send_request == true
                                ? "Invitation Sent"
                                : "Send Request"}
                        </Button>
                        {(
                            // openRowId === id &&
                            isRequestDropdownOpen &&
                            !!list?.length) && (
                                <div
                                    className="absolute z-10 right-2"
                                    onClick={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    <PropertyDropDown
                                        className="w-[min(400px,calc(100vw-2rem))] max-h-[400px] overflow-y-auto scrollbar-hidden"
                                        list={list}
                                        postId={id}
                                        onClose={() => setIsRequestDropdownOpen(false)}
                                    />
                                </div>
                            )}
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <Card className={`overflow-hidden transition-shadow hover:shadow-lg py-4 px-5 mb-8 border border-white bg-white`}>
                    <div className="flex justify-between">
                        <CardContent className="flex-1 p-2">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-gray-900 text-lg">
                                        {post?.subject || ""}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    {post?.move_in_requirements === "less_than_15_days" && (
                                        <p
                                            className="font-sans font-medium border border-[#C10664] px-[10px] text-xs rounded-xl bg-[#C10664] text-white">
                                            Urgent
                                        </p>
                                    )}
                                    <p className="font-sans font-medium text-xs">
                                        {post?.move_in_requirements ?
                                            post.move_in_requirements
                                                .replace(/_/g, ' ')
                                                .replace(/^./, (char: any) => char.toUpperCase())
                                            : ""
                                        }
                                    </p>
                                </div>
                                <p className="font-sanstext-xs">
                                    {post?.about_post || ""}
                                </p>

                                <div className="flex items-center mb-3 mt-2 gap-10">
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        <span className="text-xs">
                                            {post?.location || ""}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        <span className="text-xs px-2">
                                            {new Date(post?.created_date).toLocaleString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false
                                            }).replace(",", " |")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="flex flex-wrap items-start sm:gap-1 py-3">
                                <div className="flex items-center gap-1 pr-3">
                                    <span
                                        className="font-sans font-normal text-muted-foreground tracking-[0] leading-[19.6px] text-xs">
                                        Price:
                                    </span>
                                    <span
                                        className="font-sans font-semibold text-primary tracking-[0] leading-[19.6px] text-xs">
                                        ${parseFloat(post?.start_price)?.toFixed(2) || 0} - ${parseFloat(post?.end_price)?.toFixed(2) || 0}
                                    </span>
                                </div>

                                <div
                                    className="flex items-center border-l border-l-border px-3 gap-1">
                                    <span
                                        className="font-sans font-normal text-muted-foreground tracking-[0] leading-[19.6px] text-xs">
                                        Property Type:
                                    </span>
                                    <span
                                        className="font-sans font-semibold text-primary tracking-[0] leading-[19.6px] text-xs">
                                        {post?.property_type_object_id?.name || ''}

                                    </span>
                                </div>

                                <div
                                    className="flex items-center border-l border-l-border px-3 gap-1">
                                    <span
                                        className="font-sans font-normal text-muted-foreground tracking-[0] leading-[19.6px] text-xs">
                                        Size:
                                    </span>
                                    <span
                                        className="font-sans font-semibold text-primary tracking-[0] leading-[19.6px] text-xs">
                                        {parseFloat(post?.start_size)?.toFixed(2) || 0} sqm - {parseFloat(post?.end_size)?.toFixed(2) || 0} sqm
                                    </span>
                                </div>

                                <div
                                    className="flex items-center border-l border-l-border px-3 gap-1">
                                    <span
                                        className="font-sans font-normal text-muted-foreground tracking-[0] leading-[19.6px] text-xs">
                                        No Of Bed Rooms -
                                    </span>
                                    <span
                                        className="font-sans font-semibold text-primary tracking-[0] leading-[19.6px] text-xs">
                                        {post?.bedrooms || 0}
                                    </span>
                                </div>

                                <div
                                    className="flex items-center border-l border-l-border px-3 gap-1">
                                    <span
                                        className="font-sans font-normal text-muted-foreground tracking-[0] leading-[19.6px] text-xs">
                                        No Of Bathroom -
                                    </span>
                                    <span
                                        className="font-sans font-semibold text-primary tracking-[0] leading-[19.6px] text-xs">
                                        {post?.bathrooms || 0}
                                    </span>
                                </div>

                                <div
                                    className="flex items-center border-l border-l-border px-3 gap-1">
                                    <span
                                        className="font-sans font-normal text-muted-foreground tracking-[0] leading-[19.6px] text-xs">
                                        Garages -
                                    </span>
                                    <span
                                        className="font-sans font-semibold text-primary tracking-[0] leading-[19.6px] text-xs">
                                        {post?.garages || 0}
                                    </span>
                                </div>

                                <div
                                    className="flex items-center border-l border-l-border px-3 gap-1">
                                    <span
                                        className="font-sans font-normal text-muted-foreground tracking-[0] leading-[19.6px] text-xs">
                                        Balcony -
                                    </span>
                                    <span
                                        className="font-sans font-semibold text-primary tracking-[0] leading-[19.6px] text-xs">
                                        {post?.balcony || 0}
                                    </span>
                                </div>
                            </div>
                            <hr />
                            <div>
                                <h4 className="font-semibold text-gray-900 mt-3 mb-2">Required Amenities</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                                    {post?.amenities.length > 0 && post?.amenities[0]?.split(",")?.map((amenity: string, index: number) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Icon name="CircleCheckIcon" className="w-4 h-4 text-white" fill="#38AC79" />
                                            <span className="text-xs font-medium text-gray-700">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </div>
                </Card>
            </div>
        </div>
    );
};
export default TenantPostDetails;
