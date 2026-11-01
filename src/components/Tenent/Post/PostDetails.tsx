import { ArrowLeft, Calendar, Loader, MapPin } from "lucide-react";
import { IMAGES } from "../../../../src/assets";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../ui/card";
import ToggleButton from "../../ChildComponent/ToggleButton";
import Icon from "../../icons/icon";
import DropDown from "../../ui/dropDown";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllProperty } from "../../../../src/actions/property";
import Property from "../../ChildComponent/Common/Property";
import PostRequest from "../../ChildComponent/Common/PostRequest";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { useNavigate, useLocation } from "react-router-dom";
import { deleteMyPostApi, getPostDetails, postReceiveRequestApi, statusChangeOfMyPostApi } from "../../../../src/actions/myPost";
import { toast } from "../../../../src/custom-hooks/use-toast";
import { queryClient } from "../../../../src/lib/queryClient";
import { useClickOutside } from "../../../../src/custom-hooks/use-clickOutside";
import { useModal } from "../../../../src/context/modalProvider";

const PostDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.pathname.split('/').pop();
    const [list, setList] = useState<any[]>([]);
    const [requestList, setRequestList] = useState<any[]>([]);
    const [post, setPost] = useState<any>(null);
    const [pagination, setPagination] = useState<any>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [isToggled, setIsToggled] = useState<boolean>(false);
    const dropDownref = React.useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [openRowId, setOpenRowId] = useState<string | null>(null);
    const { openModal, setParameters } = useModal();
    const responseQty = 2; // Example response quantity

    const handleCardClick = (id: string) => {
        setSelectedId(selectedId === id ? null : id); // Toggle selection
    };

    const { data: property, isLoading } = useQuery({
        queryKey: ['allProperty', currentPage, limit],
        queryFn: () => getAllProperty({ page: currentPage, limit }),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const { data: postDetails, isLoading: isPostDetailsLoading } = useQuery({
        queryKey: ['postDetails', id],
        queryFn: () => getPostDetails(id!),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!id,
    });

    console.log(postDetails, "postDetails")

    const { data: postRequestList, isLoading: isPostRequestListLoading, isFetching, status } = useQuery({
        queryKey: ['postRequestList', id],
        queryFn: () => postReceiveRequestApi(id!),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!id,
    });

    useEffect(() => {
        // setList(property?.result || []);
        // setPagination(property?.pagination || []);
        if (property) {
            setList(property.result || []);
            setPagination(property.pagination || []);
        }
        // backend returns { result: { properties: [] } }
        setRequestList(postRequestList?.result?.properties ?? []);
        // setPost(postDetails?.result || null);
        // setIsToggled(postDetails?.result?.is_active);
        if (postDetails) {
            setPost(postDetails.result || null);
            setIsToggled(postDetails.result?.is_active ?? false);
        }

    }, [property, postDetails, postRequestList]);


    const totalPages = pagination?.totalPages;
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

    const { mutate: updatePostStatus, isPending } = useMutation({
        mutationFn: (id: string) => statusChangeOfMyPostApi(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['postDetails'] });
            queryClient.invalidateQueries({ queryKey: ['myPost'] });
            const isActive = data?.result?.is_active;
            setIsToggled(isActive ? true : false);
            toast({
                title: `Post ${isActive ? 'Activated' : 'Deactivated'} Successfully`,
                description: `Your post has been ${isActive ? 'activated' : 'deactivated'} successfully.`,
                variant: "success",
            });
        },
        onError: (error) => {
            // console.log("error ::: ", error);
            toast({
                title: `Failed to Update Post`,
                description: `An error occurred while updating the post. Please try again.`,
                variant: "error",
            })
        },
    });

    const { mutate: deletePost } = useMutation({
        mutationFn: (postId: string) => deleteMyPostApi(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myPost'] });
            toast({
                title: `Post Deleted Successfully`,
                description: `Your post has been deleted.`,
                variant: "success",
            });
            navigate("/my-posts");
        },
        onError: () => {
            toast({
                title: `Failed to Delete Post`,
                description: `An error occurred while deleting the post. Please try again.`,
                variant: "error",
            })
        },
    });

    if (dropDownref) {
        useClickOutside(dropDownref, () => {
            setOpenRowId?.(null); // Close dropdown when clicking outside
        }, true, openRowId);
    }

    const handleAction = (e: any, actionName: string) => {
        if (actionName === "Edit") {
            navigate(`/edit-post`,
                {
                    state: {
                        ...postDetails?.result,
                        property_type_object_id: postDetails?.result?.property_type_object_id?._id,
                        amenities: postDetails?.result?.amenities?.[0]?.split(",") || [],
                        garages: postDetails?.result?.garages?.toString() ?? "",
                        bathrooms: postDetails?.result?.bathrooms?.toString() ?? "",
                        bedrooms: postDetails?.result?.bedrooms?.toString() ?? "",
                        balcony: postDetails?.result?.balcony?.toString() ?? ""
                    }
                });
        } else if (actionName === "Remove") {
            openModal("remove")
            setParameters({
                header: `Are you sure you want to permanently delete this record?`,
                description: `This action cannot be undone and may affect related data.`,
                fn: () => deletePost(post?._id)
            })
        }
    };

    if (isPostDetailsLoading) {
        <div>Loading.........</div>
    }
    return (
        <div className="common-container">
            <div className="w-full mx-auto flex flex-col gap-5">
                <div className="flex justify-between">
                    <div className="flex items-center justify-between mb-6 rounded-lg">
                        <h2 className="text-md font-bold text-gray-900">Post Details</h2>
                    </div>
                    <div className="flex border rounded-lg py-2">
                        <a
                            href="/my-posts"
                            onClick={(e) => { e.preventDefault(); navigate("/my-posts") }}
                            className="bg-primary px-6 flex items-center gap-2 rounded-3xl text-white hover:text-primary hover:bg-white border border-primary py-2"
                        >
                            <ArrowLeft />
                            Back
                        </a>
                    </div>
                </div>
                <div className="space-y-6 overflow-y-auto thin-scrollbar  scrollbar-hidden" >
                    <div className="bg-white rounded-lg p-2">
                        <Card className={`overflow-hidden relative z-[9] transition-shadow mb-5 p-2 border border-card-border`}>
                            <div className="flex justify-between">
                                <CardContent className="flex-1 p-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-gray-900 text-lg">
                                            {post?.subject || ""}
                                        </h3>
                                        {post?.move_in_requirements === "less_than_15_days" && (
                                            <p
                                                className="font-sans font-medium border border-[#C10664] px-[10px] text-xs rounded-xl bg-[#C10664] text-white">
                                                Urgent
                                            </p>
                                        )}
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
                                    <div className="flex flex-wrap items-start sm:gap-1">
                                        <div className="flex items-center gap-1 pr-3">
                                            <span
                                                className="font-sans font-normal text-muted-foreground tracking-[0] leading-[19.6px] text-xs">
                                                Price:
                                            </span>
                                            <span
                                                className="font-sans font-semibold text-primary tracking-[0] leading-[19.6px] text-xs">
                                                ${post?.start_price || 0} - ${post?.end_price || 0}
                                            </span>
                                        </div>

                                        <div
                                            className="flex items-center border-l border-l-sidebar-border px-3 gap-1">
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
                                            className="flex items-center border-l border-l-sidebar-border px-3 gap-1">
                                            <span
                                                className="font-sans font-normal text-muted-foreground tracking-[0] leading-[19.6px] text-xs">
                                                Size:
                                            </span>
                                            <span
                                                className="font-sans font-semibold text-primary tracking-[0] leading-[19.6px] text-xs">
                                                {post?.start_size} sqm - {post?.end_size} sqm
                                            </span>
                                        </div>

                                        <div
                                            className="flex items-center border-l border-l-sidebar-border px-3 gap-1">
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
                                            className="flex items-center border-l border-l-sidebar-border px-3 gap-1">
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
                                            className="flex items-center border-l border-l-sidebar-border px-3 gap-1">
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
                                            className="flex items-center border-l border-l-sidebar-border px-3 gap-1">
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
                                </CardContent>
                                <div
                                    className="pl-4 border-l-[1px] border-l-black/10 flex items-center gap-5 py-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="font-sanstext-foreground sm:text-sm md:text-md tracking-[0] leading-[25.2px]">
                                                Status
                                            </div>
                                            <ToggleButton onToggle={() => updatePostStatus(post?._id)} isToggled={isToggled} />
                                        </div>
                                        <div
                                            ref={(el) => { dropDownref?.current && (dropDownref.current[post?._id] = el); }}
                                            id={post?._id}
                                            className="relative flex ites-center justify-center cursor-pointer"
                                            onClick={() => setOpenRowId?.((prev: any) => (prev && prev === post?._id ? null : post?._id))}
                                        >
                                            <Icon
                                                name="EllipsisVertical"
                                                className={"w-4 h-4 " + (openRowId === post?._id ? " text-primary/10" : " text-primary")}
                                            />
                                            {openRowId === post?._id &&
                                                <DropDown className="absolute z-[999] right-2 min-w-[150px] top-[calc(100%+5px)]"
                                                    list={[{ name: 'Edit', icon: 'PenBoxIcon' }, { name: 'Remove', icon: 'DeleteIcon' }]}
                                                    handleAction={handleAction} />}
                                        </div>
                                    </div>
                                    {/* <div className="flex items-center gap-2">
                                        <Icon name="MessageResponse" className={`w-5 h-5 ${requestList?.length > 0 ? "stroke-primary" : "stroke-[#A3ABB0]"}`} fill="none" />
                                        <div className={`font-sanstext-base font-medium ${requestList?.length > 0 ? 'text-primary' : 'text-[#A3ABB0]'}`}>
                                            {requestList?.length > 0 ? requestList?.length : "No"} Responses
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </Card>
                        <hr />
                        <div className="flex px-2">
                            <div className="w-3/5 py-3">
                                <div className="flex items-center justify-between mb-2 px-2">
                                    <h2 className="font-semibold text-gray-900 text-xl mb-2">Available Property</h2>
                                    <Select defaultValue="default">
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="default">
                                                Sort by (Default)
                                            </SelectItem>
                                            <SelectItem value="price-low">
                                                Price: Low to High
                                            </SelectItem>
                                            <SelectItem value="price-high">
                                                Price: High to Low
                                            </SelectItem>
                                            <SelectItem value="newest">Newest First</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-3">
                                    {list.map((property: any, index: number) => (
                                        property.property_details?.basic?.is_available_for_rent === true && (
                                            <div
                                                key={property._id}
                                                className="px-2 col-span-1 mb-5"
                                            >
                                                <Property
                                                    id={property?._id}
                                                    property={property}
                                                // onCardClick={() => handleCardClick(property._id)}
                                                />
                                            </div>
                                        )
                                    ))}
                                </div>
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
                            <div className="w-2/5 px-2 py-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-lg">Responses</h4>
                                    {requestList?.length > 0 && (
                                        <p className="bg-active text-white rounded-full px-1">{requestList?.length > 0 ? requestList?.length : 0}</p>
                                    )}
                                </div>
                                {requestList?.length > 0 ? (
                                    <div className="bg-[#BED7FF33] p-2 rounded-lg space-y-4 min-h-[70vh] max-h-[70vh] overflow-y-auto thin-scrollbar  scrollbar-hidden">
                                        {requestList?.map((property: any, index: number) => (
                                            <PostRequest type={false} property={property} id={property?._id} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-[#BED7FF33] p-2 rounded-lg space-y-4 min-h-[70vh] max-h-[70vh] overflow-y-auto thin-scrollbar  scrollbar-hidden">
                                        <div className="flex items-center justify-center mt-20">
                                            <p>No Response Found</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostDetails;