import React, { useEffect, useState } from "react";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { IMAGES } from "../../../assets/index";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card } from "../../ui/card";
import ToggleButton from "../ToggleButton";
import Icon from "../../icons/icon";
import { FormatArea } from "../../common/FormatArea";
import GoogleMapComponent from "../GoogleMapComponent";
import { ChevronDown, ChevronUp, EllipsisVertical, Car } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptRejectPropertyRequestApi,
  deletePropertyApi,
  getPropertyDetailsApi,
  getPropertyRequestsApi,
  getTenantRequestsPropertyWiseApi,
  rentalAvailabilityApi,
  sendPropertyRequestApi,
  tenantPropertyWishlistAddApi,
  tenantPropertyWishlistRemoveApi,
} from "../../../actions/property";
import { toast } from "../../../../src/custom-hooks/use-toast";
import { useModal } from "../../../context/modalProvider";
import { useAuth } from "../../../context/AuthContext";
import { Button } from "../../ui/button";
import { sendMessage } from "../../../actions/chatApis";
import { useNavigate } from "react-router-dom";
import { useSheet } from "../../../context/sheetProvider";
import { MapIframe } from "../../mapIframne";

const formatDate = (dateString: any) => {
  // 1. Guard against empty, null, or undefined values
  if (!dateString) return "";

  const date = new Date(dateString);

  // 2. Double-check if the date object itself is valid
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

type PostProps = {
  id: string;
  // property: any;
};

interface Message {
  _id?: string;
  id?: string;
  sender: { id: string | undefined; email?: string };
  receiver?: { id: string; email?: string };
  content: string;
  createdAt: string;
  // ... other fields
}

const propertyListings = [
  {
    id: 1,
    image: IMAGES.villa_image,
  },
  {
    id: 2,
    image: IMAGES.villa_image,
  },
  {
    id: 3,
    image: IMAGES.villa_image,
  },
  {
    id: 4,
    image: IMAGES.villa_image,
  },
  {
    id: 4,
    image: IMAGES.villa_image,
  },
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3500,
};

const PropertySheet: React.FC<PostProps> = ({
  id,
  // property,
}) => {
  // console.log(id, "<---sheet id")
  const [list, setList] = useState<any[]>([]);
  const [property, setProperty] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { openModal, setParameters, closeModal } = useModal();
  const [messageText, setMessageText] = useState("");
  const [receiverId, setReceiverId] = useState('')
  //   const navigate = useNavigate();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [propertyListings, setpropertyListings] = useState<any[]>([]);
  const { closeSheet } = useSheet();
  const [isExpandedInterior, setIsExpandedInterior] = useState(false)


  const { property_details } = property?.property_details || {};
  const {
    basic,
    rent_details,
    features,
    additional_information,
    documents,
    ...rest
  } = property_details || {};

  useEffect(() => {
    if (documents) {
      if (documents?.images)
        setpropertyListings((prev) => [...prev, ...documents?.images]);
      if (documents?.videos)
        setpropertyListings((prev) => [...prev, ...documents?.videos]);
      if (documents?.floorPlans)
        setpropertyListings((prev) => [...prev, ...documents?.floorPlans]);
    }
  }, [documents]);

  const {
    data: propertyDetails,
    isLoading: isPropertyLoading,
    error: propertyError,
  } = useQuery({
    queryKey: ["propertyDetails", id],
    queryFn: () => getPropertyDetailsApi(id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  //   console.log(propertyDetails, "<----propertyDetails");

  const {
    data: requestList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["requestList", id],
    queryFn: () => getTenantRequestsPropertyWiseApi(id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: property?.created_by?._id === user?.id,
    retry: 2,
  });
  useEffect(() => {
    setList(requestList?.result || []);
    setProperty(propertyDetails || null);
    setOwner(propertyDetails?.created_by || null);
  }, [requestList, propertyDetails]);
  // console.log(propertyDetails, "<---prptydetails")

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const { mutate: deleteProperty } = useMutation({
    mutationFn: deletePropertyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property'] });
      queryClient.invalidateQueries({ queryKey: ["savedProperties"] });
      queryClient.invalidateQueries({ queryKey: ["allProperty"] });
      queryClient.invalidateQueries({ queryKey: ["propertyDetails"] });
      toast({
        title: `Property Deleted`,
        description: `Property has been deleted in the system.`,
        variant: "success",
      });
      closeModal();
    },
    onError: (error) => {
      // setServerError(error.response?.data?.message || 'Can not able to add user.');
      toast({
        title: `Delete Failed`,
        description: `Could not delete the property. Please check try again.`,
        variant: "error",
      });
    },
  });

  const handleDelete = (id: string) => {
    openModal("remove");
    setParameters({
      header: `Are you sure, want to delete this property?`,
      description: ``,
      fn: () => deleteProperty(id),
    });
  };
  const { mutate: rentalAvailability, isPending: isRentalAvailabilityPending } = useMutation({
    mutationFn: rentalAvailabilityApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property'] });
      queryClient.invalidateQueries({ queryKey: ["allProperty"] });
      queryClient.invalidateQueries({ queryKey: ["savedProperties"] });
      queryClient.invalidateQueries({ queryKey: ["propertyDetails"] });
      toast({
        title: `Rental Availability Updated`,
        description: `Property rental availability has been updated in the system.`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: `Rental Availability Failed`,
        description: `Could not updated the property rental availability. Please check try again.`,
        variant: "error",
      });
    },
  });

  const { mutate: sendPropertyRequest } = useMutation({
    mutationFn: (property_object_id: string) =>
      sendPropertyRequestApi(property_object_id),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ['property'] });
      queryClient.invalidateQueries({ queryKey: ["allProperty"] });
      queryClient.invalidateQueries({ queryKey: ["savedProperties"] });
      queryClient.invalidateQueries({ queryKey: ["propertyDetails"] });
      toast({
        title: `Request Send`,
        description: `Request successfully send.`,
        variant: "success",
      });
      closeModal();
    },
    onError: (error) => {
      toast({
        title: `Request Send Failed`,
        description: `Could not send the request. Please check try again.`,
        variant: "error",
      });
    },
  });

  const { mutate: acceptRejectPropertyRequest } = useMutation({
    mutationFn: (request_id: string) =>
      acceptRejectPropertyRequestApi({
        request_property_id: request_id,
        status: "approved",
        discription: "",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property"] });
      queryClient.invalidateQueries({ queryKey: ["propertyDetails"] });
      queryClient.invalidateQueries({ queryKey: ["allProperty"] });
      queryClient.invalidateQueries({ queryKey: ["savedProperties"] });
      queryClient.invalidateQueries({ queryKey: ["requestList"] });

      toast({
        title: `Request Accepted`,
        description: `Request successfully accepted.`,
        variant: "success",
      });
      closeModal();
    },
    onError: (error) => {
      toast({
        title: `Request Accept Failed`,
        description: `Could not accept the request. Please check try again.`,
        variant: "error",
      });
    },
  });

  const handleRequestSend = (property_object_id: string) => {
    openModal("remove");
    setParameters({
      header: `Are you sure!`,
      description: `Do you want to send request?`,
      actionBtn: `Confirm`,
      fn: () => sendPropertyRequest(property_object_id),
    });
  };

  // const sendMutation = useMutation({
  //   mutationFn: (content: string) =>
  //     sendMessage({
  //       receiver: owner?._id,
  //       content,
  //     }),

  //   onMutate: async (content) => {
  //     // Optimistic update
  //     const optimisticMsg: Message = {
  //       _id: `temp-${Date.now()}`,
  //       sender: { id: user?.id },
  //       content,
  //       createdAt: new Date().toISOString(),
  //     };

  //     // Snapshot previous value
  //     const previousMessages = queryClient.getQueryData<Message[]>([
  //       "chat",
  //       user?.id,
  //     ]);

  //     // Optimistically append
  //     queryClient.setQueryData<Message[]>(["chat", user?.id], (old = []) => [
  //       ...old,
  //       optimisticMsg,
  //     ]);

  //     return { previousMessages }; // for rollback
  //   },

  //   onError: (err, content, context) => {
  //     // Rollback on error
  //     if (context?.previousMessages) {
  //       queryClient.setQueryData(["chat", user?.id], context.previousMessages);
  //     }
  //     console.error("Failed to send message:", err);
  //   },

  //   onSuccess: (responseData, sentContent) => {
  //     queryClient.invalidateQueries({ queryKey: ["chat", user?.id] });
  //      queryClient.invalidateQueries({ queryKey: ["chat-content"] });
  //     setMessageText(""); // clear input
  //   },
  // });

  const { mutateAsync: sendMutationAsync, isPending } = useMutation({
    mutationFn: (content: string) => sendMessage({ receiver: receiverId, content, property_id: property?._id }),
    onMutate: async (content) => { /* ... existing optimistic logic ... */ },
    onError: (err, content, context) => { /* ... existing rollback logic ... */ },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["chat-content"] });
      setMessageText("");
    },
  });

  const handleSendMessage = (rsvrId: string) => {
    // console.log(rsvrId, "<-- receiver id");
    if (rsvrId !== '') {
      setReceiverId(rsvrId)
      openModal("chat1stTime");
      setParameters({
        fn: (reason: string) => submitChat(reason),
        propertyDetails: propertyDetails
      });

    } else {
      toast({
        title: `Unable to send message!`,
        description: ``,
        variant: "error",
      });
    }
  };

  const submitChat = async (messageText: string) => {
    const trimmed = messageText.trim();
    // const trimmed = "Are you available to chat ?";
    if (!trimmed || isPending || !user?.id) return;
    try {
      const res = await sendMutationAsync(trimmed);
      console.log("Sucess", res)

      window.location.href = "/message";
    } catch (error) {
      console.error("Mutation failed, redirect aborted.");
    }
  };

  const handleRequestAccept = (request_id: string) => {
    openModal("remove");
    setParameters({
      header: `Are you sure!`,
      description: `Do you want to accept this request?`,
      actionBtn: `Confirm`,
      fn: () => acceptRejectPropertyRequest(request_id),
    });
  };

  const { mutate: tenantPropertyWishlistAdd } = useMutation({
    mutationFn: (property_object_id: string) =>
      tenantPropertyWishlistAddApi(property_object_id),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ['savedProperties'] });
      // queryClient.invalidateQueries({ queryKey: ['property'] });
      queryClient.invalidateQueries({ queryKey: ["allProperty"] });
      queryClient.invalidateQueries({ queryKey: ["savedProperties"] });
      queryClient.invalidateQueries({ queryKey: ["propertyDetails"] });
      toast({
        title: `Add To Favourite`,
        description: `Property successfully add to your favourite list.`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: `Add To Favourite Failed`,
        description: `Could not add the property to your favourite list. Please check try again.`,
        variant: "error",
      });
    },
  });

  const { mutate: tenantPropertyWishlistRemove } = useMutation({
    mutationFn: (id: string) => tenantPropertyWishlistRemoveApi(id),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ['savedProperties'] });
      // queryClient.invalidateQueries({ queryKey: ['property'] });
      queryClient.invalidateQueries({ queryKey: ["allProperty"] });
      queryClient.invalidateQueries({ queryKey: ["savedProperties"] });
      queryClient.invalidateQueries({ queryKey: ["propertyDetails"] });
      toast({
        title: `Remove From Favourite`,
        description: `Property successfully remove from your favourite list.`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: `Remove From Favourite Failed`,
        description: `Could not remove the property from your favourite list. Please check try again.`,
        variant: "error",
      });
    },
  });

  const handleEdit = () => {
    navigate("/property/edit/", { state: { ...property } });
    closeSheet()
  }

  const interiorData = property?.property_details?.interior;
  if (!interiorData) return null;
  // Filter out metadata
  const details = Object.entries(interiorData).filter(
    ([key, value]) => Array.isArray(value) && key !== "_id"
  );

  // Show only first 3 categories when collapsed
  const visibleDetails = isExpanded ? details : details.slice(0, 3);

  return (
    // <SheetContent className="w-[400px] sm:w-[540px] !max-w-full" >
    <div className="bg-white p-4 sm:p-6 rounded-xl overflow-y-auto thin-scrollbar space-y-5 text-slate-800">
      {/* HEAD SECTION  */}
      <div className="flex justify-between items-center pr-8">
        <h3 className="font-sans font-bold text-slate-900 text-lg tracking-tight leading-snug">
          {property?.property_details?.basic?.property_name &&
            property?.property_details?.basic?.property_name.length > 28
            ? `${property?.property_details?.basic?.property_name.slice(0, 28)}...`
            : property?.property_details?.basic?.property_name}
        </h3>
        {user?.role !== "GUEST" ? (
          user?.role === "TENANT" ? (
            <div className="flex justify-between items-center gap-2 shrink-0">
              <a
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                href="#"
                onClick={() =>
                  property?.is_wishlist
                    ? tenantPropertyWishlistRemove(property?._id)
                    : tenantPropertyWishlistAdd(property?._id)
                }
              >
                <Icon
                  name="Favourite"
                  className="w-4 h-4"
                  fill={`${property?.is_wishlist ? "#F55C5C" : "transparent"}`}
                />
              </a>
            </div>
          ) : (
            <div className="flex justify-between items-center gap-2 shrink-0">
              {
                user?.id == (property?.created_by?._id || property?.created_by) ? (
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-semibold text-slate-700">
                      Available for Rent?
                    </div>
                    <a href="#">
                      <ToggleButton
                        isToggled={
                          property?.property_details?.basic
                            ?.is_available_for_rent || false
                        }
                        onToggle={() => { if (!isRentalAvailabilityPending) rentalAvailability(String(id)); }}
                      />
                    </a>
                  </div>
                ) : null
              }

              <div className="relative inline-block text-left">
                {user?.id == (property?.created_by?._id || property?.created_by) ? (
                  <div>
                    <a href="#" onClick={toggleDropdown} className="p-1 block">
                      <EllipsisVertical className="w-4 h-4 text-slate-400 hover:text-slate-700 transition-colors" />
                    </a>
                  </div>
                ) : null}

                {isDropdownOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden py-1">
                    <a
                      onClick={handleEdit}
                      className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Edit
                    </a>
                    <a
                      href="#"
                      onClick={() => handleDelete(String(id))}
                      className="block px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      Delete
                    </a>
                  </div>
                )}
              </div>
            </div>
          )
        ) : null}
      </div>

      {/* Property Meta & Price */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-3 text-slate-600">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            <img src={IMAGES.beds} alt="" className="w-3.5 h-3.5 object-contain" />
            <span className="text-xs font-medium text-slate-500">Beds:</span>
            <span className="text-xs font-bold text-slate-900">
              {property?.property_details?.features?.no_of_bedrooms || 0}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            <img src={IMAGES.baths} alt="" className="w-3.5 h-3.5 object-contain" />
            <span className="text-xs font-medium text-slate-500">Baths:</span>
            <span className="text-xs font-bold text-slate-900">
              {property?.property_details?.features?.no_of_bathrooms || 0}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            <Car className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-xs font-medium text-slate-500">Parking:</span>
            <span className="text-xs font-bold text-slate-900">
              {property?.property_details?.features?.parking || property?.property_details?.features?.no_of_garage || 0}
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="font-extrabold text-blue-600 text-lg">
            ${property?.property_details?.rent_details?.weekly_rent_price
              ? Number(property?.property_details?.rent_details?.weekly_rent_price).toLocaleString()
              : 0}
          </span>
          <span className="text-xs text-slate-500 font-medium">/week</span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* image section  */}
        {property?.property_details?.documents?.images?.length > 0 && (
          <div className="w-full">
            <div className="rounded-2xl overflow-hidden shadow-2xs border border-slate-100">
              <Slider {...settings}>
                {property?.property_details?.documents?.images.map(
                  (img: any, idx: number) => (
                    <div key={img?._id || idx} className="outline-none">
                      <div className="w-full h-[220px] bg-slate-100">
                        <img
                          src={img?.url || IMAGES.villa_image}
                          alt="Property"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ),
                )}
              </Slider>
            </div>
          </div>
        )}

        {/* REQUEST SECTION  */}
        <div>
          {user?.id == (property?.created_by?._id || property?.created_by) ? (
            <div className="border rounded-2xl border-slate-200/80 p-4 bg-slate-50/50">
              <p className="text-sm font-bold text-slate-800 mb-3">
                Tenant Requests
              </p>
              <div className="grid grid-cols-1 gap-3">
                {list?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">
                    No requests found
                  </p>
                ) : (
                  <Slider {...settings}>
                    {list?.map((sender: any) => (
                      <div key={sender._id} className="px-1 outline-none">
                        <div className="bg-white rounded-xl border border-slate-100 p-3 shadow-2xs flex flex-col gap-2 items-center">
                          <img
                            src={IMAGES.dummy_img}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                          <div className="flex flex-col items-center">
                            <p className="text-xs font-bold text-slate-900">{`${sender?.requester?.first_name ?? ""} ${sender?.requester?.middle_name ?? ""} ${sender?.requester?.last_name ?? ""}`}</p>
                            <p className="text-[11px] text-slate-500">
                              {sender?.requester?.phone_number ?? ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full text-xs font-semibold px-3 py-1 h-7 border border-blue-600 text-blue-600 hover:bg-blue-50"
                              onClick={() =>
                                sender?._id !== undefined &&
                                handleRequestAccept(sender?._id)
                              }
                              disabled={sender?.status == "APPROVED"}
                            >
                              {sender?.status == "APPROVED"
                                ? "Approved"
                                : "Accept Request"}
                            </Button>
                            {sender?.status == "APPROVED" && (
                              <button
                                type="button"
                                className="p-1 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                                onClick={() =>
                                  property?._id !== undefined && handleSendMessage(sender?.requester?._id)
                                }
                              >
                                <Icon name="MessageResponse" className="w-4 h-4 stroke-primary" fill="none" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                )}
              </div>
            </div>
          ) : (user?.role == "TENANT" || user?.role == "LANDLORD") && owner !== null ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {owner?.role || "Landlord"} Details
                </span>
                {property?.send_request_status === "APPROVED" && (
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Approved
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={owner?.profile_image || IMAGES.user_img || "/placeholder.svg"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 leading-tight truncate">
                      {owner?.first_name} {owner?.middle_name} {owner?.last_name}
                    </h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      @{owner?.user_name || "landlord"}
                    </p>
                    {owner?.company_details?.company_name && (
                      <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                        {owner?.company_details.company_name}
                      </p>
                    )}
                  </div>
                </div>

                {user?.role === "TENANT" && (
                  <div className="flex items-center gap-2 shrink-0">
                    {property?.send_request_status === "APPROVED" ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold px-4 py-1.5 h-8 border border-emerald-200"
                          disabled={true}
                        >
                          Request Approved
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 h-8 transition-colors"
                          onClick={() => property?._id !== undefined && handleSendMessage(owner?._id)}
                        >
                          Chat
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2 h-9 transition-colors shadow-xs disabled:opacity-60"
                        onClick={() => property?._id !== undefined && handleRequestSend(property?._id)}
                        disabled={property?.is_send_request === true}
                      >
                        {property?.is_send_request === true ? "Request Sent" : "Send Request"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Overview section  */}
        <div>
          <p className="text-sm font-bold text-slate-900 mb-2.5">Overview</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { icon: "PropertyHome", label: "Property ID", value: property?.property_details?.basic?.property_no || "N/A" },
              { icon: "PropertyType", label: "Type", value: property?.property_details?.basic?.property_type_id?.name || "Apartment" },
              { icon: "Garage", label: "Garages", value: property?.property_details?.features?.no_of_garage ?? 0 },
              { icon: "Bedroom", label: "Bedrooms", value: property?.property_details?.features?.no_of_bedrooms ?? 0 },
              { icon: "Bathroom", label: "Bathrooms", value: property?.property_details?.features?.no_of_bathrooms ?? 0 },
              { icon: "LandSize", label: "Land Size", value: property?.property_details?.features?.land_size ? <FormatArea value={property.property_details.features.land_size} /> : "N/A" },
              { icon: "MeterScale", label: "Size", value: property?.property_details?.features?.floor_area ? <FormatArea value={property.property_details.features.floor_area} /> : "N/A" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center shrink-0 text-slate-600 shadow-2xs">
                  <Icon name={item.icon} className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider truncate">
                    {item.label}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 truncate" title={String(item.value)}>
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {property?.property_details?.additional_information?.description && (
          <div>
            <p className="text-sm font-bold text-slate-900 mb-2">Description</p>
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {property?.property_details?.additional_information?.description.length > 200 && !isExpanded
                  ? `${property?.property_details?.additional_information?.description.slice(0, 200)}...`
                  : property?.property_details?.additional_information?.description}
              </p>
              {property?.property_details?.additional_information?.description.length > 200 && (
                <button
                  type="button"
                  onClick={handleToggle}
                  className="text-xs font-semibold text-blue-600 hover:underline mt-1.5 inline-block"
                >
                  {isExpanded ? "View Less" : "View More"}
                </button>
              )}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-bold text-slate-900 mb-2.5">Map location</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Address</span>
              <span className="text-xs font-semibold text-slate-800 truncate block mt-0.5" title={property?.property_details?.basic?.full_address || "N/A"}>
                {property?.property_details?.basic?.full_address || "N/A"}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Postal Code</span>
              <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                {property?.property_details?.basic?.pincode || "N/A"}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">City / Suburb</span>
              <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                {property?.property_details?.basic?.subrup || "N/A"}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Area / State</span>
              <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                {[property?.property_details?.basic?.region_area, property?.property_details?.basic?.state].filter(Boolean).join(", ") || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* <div>
          <div className="mt-4 mb-6">
            <MapIframe lat={property?.property_details?.basic?.latitude || -35.3063562} lng={property?.property_details?.basic?.longitude || 149.1267865} />
          </div>

        </div> */}
        {/* \AMENITIES  */}
        <div>
          <p className="text-sm font-bold text-slate-900 mb-2.5">Amenities And Features</p>
          {property?.property_details?.amenities_features &&
            property?.property_details?.amenities_features.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {property?.property_details?.amenities_features.map((feature: any, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60"
                >
                  {String(feature)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No amenities available</p>
          )}

          {property?.property_details?.outdoor && (() => {
            const allOutdoorFeatures = [
              ...(property.property_details.outdoor.features || []),
              ...(property.property_details.outdoor.outdoor_entering_area || [])
            ];

            return allOutdoorFeatures.length > 0 ? (
              <div className="mt-2.5">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                  Outdoor Features
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {allOutdoorFeatures.map((feature: any, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60"
                    >
                      {String(feature)}
                    </span>
                  ))}
                </div>
              </div>
            ) : null;
          })()}
        </div>

        {/* interior DETAILS  */}
        <div>
          <p className="text-sm font-bold text-slate-900 mb-2.5">Interior Details</p>
          <div className="space-y-3">
            <div className="grid gap-3">
              {visibleDetails.map(([key, features]: any) => (
                <div key={key} className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold mb-1.5 capitalize text-slate-800">
                    {key.replace(/_/g, " ")}
                  </p>
                  {features.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {features.map((feature: any, index: any) => (
                        <span key={index} className="inline-flex items-center text-[11px] font-medium bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/70">
                          {String(feature)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] italic text-slate-400">Not available</p>
                  )}
                </div>
              ))}
            </div>

            {details.length > 3 && (
              <div className="pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium text-xs flex items-center gap-1"
                >
                  {isExpanded ? (
                    <>Show less <ChevronUp className="w-3.5 h-3.5" /></>
                  ) : (
                    <>View {details.length - 3} more interior details <ChevronDown className="w-3.5 h-3.5" /></>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* FULL RENT DETAILS  */}
        <div>
          <p className="text-sm font-bold text-slate-900 mb-2.5">Full Rent Details</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Weekly Rent</span>
              <span className="text-xs font-bold text-blue-600 block mt-0.5">
                ${property?.property_details?.rent_details?.weekly_rent_price || 0} / week
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Available Date</span>
              <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                {formatDate(property?.property_details?.rent_details?.available_from) || "Immediate"}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Lease Terms</span>
              <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                {property?.property_details?.rent_details?.rent_details_lease_terms ? `${property.property_details.rent_details.rent_details_lease_terms} months` : "Flexible"}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Security Deposit</span>
              <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                ${property?.property_details?.rent_details?.bond_or_security_deposit || 0}
              </span>
            </div>
          </div>
        </div>

        {/* VIDEOS AND FILES  */}
        {property?.property_details?.documents?.videos?.length > 0 && (
          <div>
            <p className="text-sm font-bold text-slate-900 mb-2.5">Videos</p>
            <div className="rounded-2xl overflow-hidden border border-slate-100">
              <Slider {...settings}>
                {property?.property_details?.documents?.videos.map((vid: any, idx: number) => (
                  <div key={vid?._id || idx} className="outline-none">
                    <video
                      src={vid?.url}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-[220px] object-cover bg-black"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )}

        {property?.property_details?.documents?.floor_plans?.length > 0 && (
          <div>
            <p className="text-sm font-bold text-slate-900 mb-2.5">Floor Plans</p>
            <div className="flex flex-wrap gap-2">
              {property?.property_details?.documents?.floor_plans.map((fp: any, index: number) => (
                <a
                  key={fp?._id || index}
                  href={fp?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors"
                >
                  View Floor Plan {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* <div>
                        <p className="text-xl font-semibold mb-3">What's Nearby?</p>
                        <p className="text-xs font-normal mb-3 text-card">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aspernatur pariatur laudantium sint aliquid est et facere vel voluptatum, enim suscipit?</p>
                        <ul className="grid grid-cols-2 gap-3">
                            <li className="text-xs font-normal text-card grid grid-cols-3">
                                <p className="text-xs font-normal text-card">School</p>
                                <p className="text-xs font-semibold text-primary">0.7 Km</p>
                            </li>
                            <li className="text-xs font-normal text-card grid grid-cols-3">
                                <p className="text-xs font-normal text-card">Hospital</p>
                                <p className="text-xs font-semibold text-primary">0.7 Km</p>
                            </li>
                            <li className="text-xs font-normal text-card grid grid-cols-3">
                                <p className="text-xs font-normal text-card">University</p>
                                <p className="text-xs font-semibold text-primary">0.7 Km</p>
                            </li>
                            <li className="text-xs font-normal text-card grid grid-cols-3">
                                <p className="text-xs font-normal text-card">Metro Station</p>
                                <p className="text-xs font-semibold text-primary">0.7 Km</p>
                            </li>
                            <li className="text-xs font-normal text-card grid grid-cols-3">
                                <p className="text-xs font-normal text-card">Grocery Center</p>
                                <p className="text-xs font-semibold text-primary">0.7 Km</p>
                            </li>
                            <li className="text-xs font-normal text-card grid grid-cols-3">
                                <p className="text-xs font-normal text-card">Gym, Wellness</p>
                                <p className="text-xs font-semibold text-primary">0.7 Km</p>
                            </li>
                            <li className="text-xs font-normal text-card grid grid-cols-3">
                                <p className="text-xs font-normal text-card">Market</p>
                                <p className="text-xs font-semibold text-primary">0.7 Km</p>
                            </li>
                            <li className="text-xs font-normal text-card grid grid-cols-3">
                                <p className="text-xs font-normal text-card">River</p>
                                <p className="text-xs font-semibold text-primary">0.7 Km</p>
                            </li>
                        </ul>
                    </div> */}
      </div>
    </div>
    // </SheetContent>
  );
};

export default PropertySheet;
