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
import GoogleMapComponent from "../GoogleMapComponent";
import { ChevronDown, ChevronUp, EllipsisVertical } from "lucide-react";
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
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true, // Enable autoplay
  autoplaySpeed: 3000, // Duration for each slide (in milliseconds)
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
    <div className="bg-white p-4 sm:p-10 rounded-xl overflow-y-auto thin-scrollbar ">
      {/* HEAD SECTION  */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-sans font-semibold text-foreground text-xl tracking-[0] leading-7">
          {property?.property_details?.basic?.property_name &&
            property?.property_details?.basic?.property_name.length > 20
            ? `${property?.property_details?.basic?.property_name.slice(0, 20)}...`
            : property?.property_details?.basic?.property_name}
        </h3>
        {user?.role !== "GUEST" ? (
          user?.role === "TENANT" ? (
            <div className="flex justify-between items-center gap-2">
              <a
                className="p-[9px] border rounded-lg"
                href="#"
                onClick={() =>
                  property?.is_wishlist
                    ? tenantPropertyWishlistRemove(property?._id)
                    : tenantPropertyWishlistAdd(property?._id)
                }
              >
                <Icon
                  name="Favourite"
                  className={`w-5 h-5`}
                  fill={`${property?.is_wishlist ? "#F55C5C" : "transparent"}`}
                />
              </a>
              {/* <a className="p-[9px] border rounded-lg" href="#">
                <Icon name="ShareCusIcon" className={`w-5 h-5`} />
              </a> */}
            </div>
          ) : (
            <div className="flex justify-between items-center gap-2">
              {
                user?.id == (property?.created_by?._id || property?.created_by) ? (
                  <div className="flex items-center gap-2">
                    <div className="font-sanstext-card-foreground text-sm font-semibold">
                      Available for Rent?
                    </div>
                    <a
                      href="#" /* onClick={() => rentalAvailability(String(id))} */
                    >
                      {/* <ToggleButton defaultToggled={property?.property_details?.basic?.is_available_for_rent || false} /> */}
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
                    <a href="#" onClick={toggleDropdown}>
                      <EllipsisVertical className="text-[#00000054]" />
                    </a>
                  </div>
                ) : null}


                {isDropdownOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <a
                        onClick={handleEdit}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Edit
                      </a>
                      <a
                        href="#"
                        onClick={() => handleDelete(String(id))}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Delete
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        ) : null}
      </div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1">
            <img src={IMAGES.beds} alt="" className="w-[20px] h-[20px]" />
            <span className="font-sans font-normal text-lg text-card">
              Bedroom:
            </span>
            <span className="font-sans font-semibold text-primary-foreground text-lg">
              {property?.property_details?.features?.no_of_bedrooms || 0}
            </span>
          </div>

          {/* <div className="flex items-center gap-1">
            <img src={IMAGES.beds} alt="" className="w-[20px] h-[20px]" />
            <span className="font-sans font-normal text-lg text-card">
              Garage:
            </span>
            <span className="font-sans font-semibold text-primary-foreground text-lg">
              {property?.property_details?.features?.no_of_garage || 0}
            </span>
          </div> */}

          <div className="flex items-center gap-1">
            <img src={IMAGES.baths} alt="" className="w-[20px] h-[20px]" />
            <span className="font-sans font-normal text-lg text-card">
              Baths:
            </span>
            <span className="font-sans font-semibold text-primary-foreground text-lg">
              {property?.property_details?.features?.no_of_bathrooms || 0}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <img src={IMAGES.sqm} alt="" className="w-[20px] h-[20px]" />
            <span className="font-sans font-normal text-lg text-card">sqm:</span>
            <span className="font-sans font-semibold text-primary-foreground text-lg">
              {property?.property_details?.features?.floor_area || 0}
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="font-sans font-bold text-primary text-2xl">
            {"$" + property?.property_details?.rent_details?.weekly_rent_price
              ? Number(
                property?.property_details?.rent_details?.weekly_rent_price,
              ) * 4
              : 0 + ".00"}
          </div>
          <p className="text-xl font-normal text-muted-foreground">/month</p>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        {/* image section  */}
        <div>
          <div className={`grid grid-cols-1 gap-4 md:gap-6 mb-7`}>
            <Slider {...settings}>
              {property?.property_details?.documents?.images.map(
                (property: any) => (
                  <div key={property?._id} className="px-2">
                    <Card
                      key={property?._id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm"
                    >
                      <div className="relative">
                        <div
                          className="w-full h-[180px] bg-cover bg-center relative"
                          style={{
                            backgroundImage: `url(${property.url})`,
                          }}
                        ></div>
                      </div>
                    </Card>
                  </div>
                ),
              )}
            </Slider>
          </div>
        </div>

        {/* REQUEST SECTION  */}
        <div>
          {user?.id == (property?.created_by?._id || property?.created_by) ? (
            <div className="border rounded-md border-border-input">
              <p className="text-xl font-semibold flex justify-center py-[26px]">
                Requests
              </p>
              <div className={`grid grid-cols-1 gap-4 md:gap-6 mb-7`}>
                {list?.length === 0 ? (
                  <p className="flex items-center justify-center">
                    No Request Found
                  </p>
                ) : (
                  <Slider {...settings}>
                    {list?.map((sender: any) => (
                      <div key={sender._id} className="px-2">
                        <Card
                          key={sender._id}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm"
                        >
                          <div className="flex flex-col gap-2 p-4 items-center">
                            <div>
                              <img
                                src={IMAGES.dummy_img}
                                alt=""
                                className="w-[49px] h-[49px] rounded-full"
                              />
                            </div>
                            <div className="flex flex-col items-center">
                              <p className="text-sm font-semibold text-[#161E2D]">{`${sender?.requester?.first_name ?? ""} ${sender?.requester?.middle_name ?? ""} ${sender?.requester?.last_name ?? ""}`}</p>
                              <p className="text-xs font-semibold text-muted-foreground">
                                {sender?.requester?.phone_number ?? ""}
                              </p>
                            </div>
                            <div className="flex">
                              <Button
                                variant="ghost"
                                size="lg"
                                value-data={sender.id}
                                className="px-3 hover:bg-primary rounded-[99px] text-primary hover:text-white shadow-none border border-primary py-2 text-xs lg:text-sm 2xl:text-base"
                                onClick={() =>
                                  sender?._id !== undefined &&
                                  handleRequestAccept(sender?._id)
                                }
                                disabled={sender?.status == "APPROVED"}
                              >
                                {sender?.status == "APPROVED"
                                  ? "APPROVED"
                                  : "Accept Request"}
                              </Button>
                              {sender?.status == "APPROVED" ? <div
                                className="mt-2 ml-2"
                                onClick={() =>
                                  property?._id !== undefined && handleSendMessage(sender?.requester?._id)
                                }
                              >
                                <Icon name="MessageResponse" className={`w-5 h-5 ${1 > 0 ? "stroke-primary" : "stroke-[#A3ABB0]"}`} fill="none" />
                              </div> : null}

                            </div>

                          </div>
                        </Card>
                      </div>
                    ))}
                  </Slider>
                )}
              </div>
            </div>
          ) : (user?.role == "TENANT" || user?.role == "LANDLORD") && owner !== null ? (
            <Card
              className={`overflow-hidden hover:shadow-lg transition-shadow p-5 border border-[#1563DF54]`}
            >
              <h2 className="font-bold text-xl">
                {owner?.role} DETAILS
              </h2>
              <div className="flex mt-2 justify-between items-center">
                {/* <div className="relative flex items-center gap-3">
                    <img
                      src={IMAGES.user_img || "/placeholder.svg"}
                      alt=""
                      className="w-18 h-18 object-cover"
                    />
                    <h2 className="text-lg font-semibold">Landlord Details</h2>
                    
                  </div> */}

                <div className="mt-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      {/* Profile Image */}
                      <img
                        src={
                          owner?.profile_image ||
                          IMAGES.user_img ||
                          "/placeholder.svg"
                        }
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border"
                      />

                      {/* Primary Identification */}
                      <div>
                        <h3 className="text-lg font-semibold leading-tight">
                          {owner?.first_name} {owner?.middle_name}{" "}
                          {owner?.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          @{owner?.user_name}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    {/* <Button
        variant="ghost"
        className="px-6 rounded-3xl text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
        onClick={() => property?._id && handleRequestSend(property?._id)}
        disabled={property?.is_send_request}
      >
        {property?.is_send_request ? "Request Sent" : "Send Request"}
      </Button> */}
                  </div>

                  {/* Detailed Info Grid */}
                  <div className="grid grid-cols-1 gap-y-4 gap-x-4 pt-3 border-t border-gray-100">
                    <div className="text-sm">
                      {/* <span className="text-gray-500 block">Email Address</span>
                      <span className="font-medium">{owner?.email}</span> */}
                    </div>
                    <div className="text-sm">
                      {/* <span className="text-gray-500 block">Phone Number</span>
                      <span className="font-medium">
                        +{owner?.phone_extension || "1"} {owner?.phone_number}
                      </span> */}
                    </div>
                    {owner?.company_details?.company_name && (
                      <>
                        <div className="text-sm">
                          <span className="text-gray-500 block">Company</span>
                          <span className="font-medium">
                            {owner?.company_details.company_name}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500 block">
                            Company Address
                          </span>
                          <span className="font-medium text-xs leading-none">
                            {owner?.company_details.company_address}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {
                  user?.role === "TENANT" ? (
                    <div className="flex gap-2">
                      {property?.send_request_status == "APPROVED" ? (
                        <Button
                          variant="ghost"
                          size="lg"
                          /* value-data={property._id} */
                          className="px-3 bg-blue-500 pl-3 pr-3 rounded-3xl text-white bg-primary px-[30px] hover:border hover:border-primary hover:text-primary"
                          onClick={() =>
                            property?._id !== undefined &&
                            handleRequestSend(property?._id)
                          }
                          disabled={true}
                        >
                          Request Approved
                        </Button>
                      ) :
                        <Button
                          variant="ghost"
                          size="lg"
                          /* value-data={property._id} */
                          className="px-3 bg-blue-500 pl-3 pr-3 rounded-3xl text-white bg-primary px-[30px] hover:border hover:border-primary hover:text-primary"
                          onClick={() =>
                            property?._id !== undefined &&
                            handleRequestSend(property?._id)
                          }
                          disabled={property?.is_send_request == true}
                        >
                          {property?.is_send_request == true
                            ? "Request Sended"
                            : "Send Request"}
                        </Button>}
                      {property?.send_request_status == "APPROVED" ? (
                        <Button
                          variant="ghost"
                          size="lg"
                          /* value-data={property._id} */
                          className="px-3 bg-blue-500 pl-3 pr-3 rounded-3xl text-white bg-primary px-[30px] hover:border hover:border-primary hover:text-primary"
                          onClick={() =>
                            property?._id !== undefined && handleSendMessage(owner?._id)
                          }
                          disabled={property?.is_send_request == false}
                        >
                          Chat
                        </Button>
                      ) : null}
                    </div>
                  ) : null
                }


              </div>
            </Card>
          ) : (
            ""
          )}
        </div>

        {/* Overview section  */}
        <div className="">
          {/* <p className="text-base font-semibold mt-4">Overview</p> */}
          <p className="text-xl font-semibold mb-3">Overview</p>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-y-4 sm:grid-cols-4 sm:gap-y-0">
              <div className="flex gap-2 items-center">
                <div className="border p-2 rounded-md flex">
                  <Icon name="PropertyHome" className={`w-5 h-5`} />
                </div>
                <p className="flex flex-col text-card">
                  <span className="text-xs font-normal text-card">ID: </span>
                  <span className="text-sm font-semibold">
                    {property?.property_details?.basic?.property_no || "N/A"}
                  </span>
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="border p-2 rounded-md flex">
                  <Icon name="PropertyType" className={`w-5 h-5`} />
                </div>
                <p className="flex flex-col text-card">
                  <span className="text-xs font-normal text-card">Type: </span>
                  <span className="text-sm font-semibold">
                    {property?.property_details?.basic?.property_type_id
                      ?.name || ""}
                  </span>
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="border p-2 rounded-md flex">
                  <Icon name="Garage" className={`w-5 h-5`} />
                </div>
                <p className="flex flex-col text-card">
                  <span className="text-xs font-normal text-card">
                    Garages:{" "}
                  </span>
                  <span className="text-sm font-semibold">
                    {property?.property_details?.features?.no_of_garage || 0}
                  </span>
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="border p-2 rounded-md flex">
                  <Icon name="Bedroom" className={`w-5 h-5`} />
                </div>
                <p className="flex flex-col text-card">
                  <span className="text-xs font-normal text-card">
                    Bedrooms:{" "}
                  </span>
                  <span className="text-sm font-semibold">
                    {property?.property_details?.features?.no_of_bedrooms || 0}
                  </span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-4 sm:grid-cols-4 sm:gap-y-0">
              <div className="flex gap-2 items-center">
                <div className="border p-2 rounded-md flex">
                  <Icon name="Bathroom" className={`w-5 h-5`} />
                </div>
                <p className="flex flex-col text-card">
                  <span className="text-xs font-normal text-card">
                    Bathrooms:{" "}
                  </span>
                  <span className="text-sm font-semibold">
                    {property?.property_details?.features?.no_of_bathrooms || 0}
                  </span>
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="border p-2 rounded-md flex">
                  <Icon name="LandSize" className={`w-5 h-5`} />
                </div>
                <p className="flex flex-col text-card">
                  <span className="text-xs font-normal text-card">
                    Land Size:{" "}
                  </span>
                  <span className="text-sm font-semibold">
                    {property?.property_details?.features?.land_size || 0}
                  </span>
                </p>
              </div>
              {/* <div className="flex gap-2 items-center">
                <div className="border p-2 rounded-md flex">
                  <Icon name="YearBuilt" className={`w-5 h-5`} />
                </div> */}
                {/* <p className="flex flex-col text-card"> */}
                  {/* <span className="text-xs font-normal text-card">
                    Year Built:{" "}
                  </span> */}
                  {/* <span className="text-sm font-semibold">
                    {property?.property_details?.basic?.year_built
                      ? new Date(
                        property?.property_details?.basic?.year_built,
                      ).getFullYear()
                      : 0}
                  </span> */}
                {/* </p> */}
              {/* </div> */}
              <div className="flex gap-2 items-center">
                <div className="border p-2 rounded-md flex">
                  <Icon name="MeterScale" className={`w-5 h-5`} />
                </div>
                <p className="flex flex-col text-card">
                  <span className="text-xs font-normal text-card">Size: </span>
                  <span className="text-sm font-semibold">
                    {property?.property_details?.features?.floor_area || 0} sqm
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        {property?.property_details?.additional_information?.description !=
          null &&
          property?.property_details?.additional_information?.description
            .length > 0 && (
            <div>
              <p className="text-xl font-semibold">Description</p>
              <div className="py-3">
                <p className="font-normal text-xs text-muted-foreground">
                  {property?.property_details?.additional_information
                    ?.description.length > 200 && !isExpanded
                    ? `${property?.property_details?.additional_information?.description.slice(0, 200)}...`
                    : property?.property_details?.additional_information
                      ?.description}
                </p>
                {property?.property_details?.additional_information?.description
                  .length > 200 && (
                    <a
                      href="#"
                      onClick={handleToggle}
                      className="text-sm font-semibold text-primary underline"
                    >
                      {isExpanded ? "View Less" : "View More"}
                    </a>
                  )}
              </div>
            </div>
          )}
        <div>
          <p className="text-xl font-semibold">Map location</p>
          <div className="mt-4 mb-6">
            {/* <GoogleMapComponent /> */}
            {/* <MapIframe lat={property?.property_details?.basic?.latitude || -35.3063562} lng={property?.property_details?.basic?.longitude || 149.1267865} /> */}
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-0">
              <div className="grid grid-cols-3">
                <p className="text-xs font-normal text-card">Address</p>
                <p className="text-xs font-semibold text-primary">
                  {property?.property_details?.basic?.full_address || ""}
                </p>
              </div>
              <div className="grid grid-cols-3">
                <p className="text-xs font-normal text-card">Postal Code</p>
                <p className="text-xs font-semibold text-primary">
                  {property?.property_details?.basic?.pincode || ""}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-0">
              <div className="grid grid-cols-3">
                <p className="text-xs font-normal text-card">City</p>
                <p className="text-xs font-semibold text-primary">
                  {property?.property_details?.basic?.subrup || ""}
                </p>
              </div>
              <div className="grid grid-cols-3">
                <p className="text-xs font-normal text-card">Area</p>
                <p className="text-xs font-semibold text-primary">
                  {property?.property_details?.basic?.region_area || ""}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-0">
              <div className="grid grid-cols-3">
                <p className="text-xs font-normal text-card">State/Country</p>
                <p className="text-xs font-semibold text-primary">
                  {property?.property_details?.basic?.state || ""}
                </p>
              </div>
              <div className="grid grid-cols-3">
                <p className="text-xs font-normal text-card">Country</p>
                <p className="text-xs font-semibold text-primary">Australia</p>
              </div>
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
          <p className="text-xl font-semibold mb-3">Amenities And Features</p>
          {property?.property_details?.amenities_features &&
            property?.property_details?.amenities_features.length > 0 ? (
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 list-disc pl-5">
              {property?.property_details?.amenities_features.map(
                (
                  feature:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                      unknown,
                      string | React.JSXElementConstructor<any>
                    >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactPortal
                      | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                      | Iterable<React.ReactNode>
                      | null
                      | undefined
                    >
                    | null
                    | undefined,
                  index: React.Key | null | undefined,
                ) => (
                  <li key={index} className="text-xs font-normal text-card">
                    {feature}
                  </li>
                ),
              )}
            </ul>
          ) : (
            <p className="text-xs font-normal text-card">
              No amenities available
            </p>
          )}
          <div className="mt-2"></div>

          {property?.property_details?.outdoor && (
            (() => {
              const allOutdoorFeatures = [
                ...(property.property_details.outdoor.features || []),
                ...(property.property_details.outdoor.outdoor_entering_area || [])
              ];

              return allOutdoorFeatures.length > 0 ? (
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 list-disc pl-5">
                  {allOutdoorFeatures.map((feature, index) => (
                    <li key={index} className="text-xs font-normal text-card">
                      {feature as React.ReactNode}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs font-normal text-card">
                  No Outdoor feature available
                </p>
              );
            })()
          )}
        </div>


        {/* interior DETAILS  */}

        <div>

          <p className="text-xl font-semibold">Interior Details</p>
          {/* <div className="ml-3">
            <div className="mt-3 mb-3"></div>
            <div>
              <p className="text-sm mb-3">Heating or cooling</p>
              {property?.property_details?.interior &&
                property?.property_details?.interior.heating_and_cooling.length > 0 ? (
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 list-disc pl-5">
                  {property?.property_details?.interior.heating_and_cooling.map(
                    (
                      feature:
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<any>
                        >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactPortal
                          | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                          | Iterable<React.ReactNode>
                          | null
                          | undefined
                        >
                        | null
                        | undefined,
                      index: React.Key | null | undefined,
                    ) => (
                      <li key={index} className="text-xs font-normal text-card">
                        {feature}
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <p className="text-xs font-normal text-card">
                  Not  available
                </p>
              )}
            </div>

            <div className="mt-3">
              <p className="text-sm mb-3">kitchen Appliances</p>
              {property?.property_details?.interior &&
                property?.property_details?.interior.kitchen_appliances.length > 0 ? (
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 list-disc pl-5">
                  {property?.property_details?.interior.kitchen_appliances.map(
                    (
                      feature:
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<any>
                        >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactPortal
                          | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                          | Iterable<React.ReactNode>
                          | null
                          | undefined
                        >
                        | null
                        | undefined,
                      index: React.Key | null | undefined,
                    ) => (
                      <li key={index} className="text-xs font-normal text-card">
                        {feature}
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <p className="text-xs font-normal text-card">
                  Not  available
                </p>
              )}
            </div>
            <div className="mt-3">
              <p className="text-sm mb-3">Laundry features</p>
              {property?.property_details?.interior &&
                property?.property_details?.interior.laundry_features.length > 0 ? (
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 list-disc pl-5">
                  {property?.property_details?.interior.laundry_features.map(
                    (
                      feature:
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<any>
                        >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactPortal
                          | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                          | Iterable<React.ReactNode>
                          | null
                          | undefined
                        >
                        | null
                        | undefined,
                      index: React.Key | null | undefined,
                    ) => (
                      <li key={index} className="text-xs font-normal text-card">
                        {feature}
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <p className="text-xs font-normal text-card">
                  Not  available
                </p>
              )}
            </div>

          </div> */}

          {/* <div className="ml-3">
            {property?.property_details?.interior &&
              Object.entries(property.property_details.interior)
                .filter(([key, value]) => Array.isArray(value) && key !== "_id")
                .map(([key, features]) => (
                  <div key={key} className="mt-3">
                    <p className="text-sm mb-3 capitalize">
                      {key.replace(/_/g, " ")}
                    </p>

                    {Array.isArray(features) && features.length > 0 ? (
                      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 list-disc pl-5">
                        {features.map((feature, index) => (
                          <li key={index} className="text-xs font-normal text-card">
                            {String(feature)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs font-normal text-card">Not available</p>
                    )}
                  </div>
                ))}
          </div> */}

          <div className="ml-3 space-y-4">
            <div className="grid gap-6">
              {visibleDetails.map(([key, features]:any) => (
                <div key={key}>
                  <p className="text-sm font-semibold mb-2 capitalize text-foreground">
                    {key.replace(/_/g, " ")}
                  </p>
                  {features.length > 0 ? (
                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 list-disc pl-5">
                      {features.map((feature:any, index:any) => (
                        <li key={index} className="text-xs font-normal text-muted-foreground">
                          {String(feature)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs italic text-muted-foreground">Not available</p>
                  )}
                </div>
              ))}
            </div>

            {details.length > 3 && (
              <div className="pt-2 border-t border-dashed">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-primary hover:text-primary/80 p-0 h-auto font-medium flex items-center gap-1"
                >
                  {isExpanded ? (
                    <>Show less <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>View {details.length - 3} more interior details <ChevronDown className="w-4 h-4" /></>
                  )}
                </Button>
              </div>
            )}
          </div>


        </div>

        {/* additional_information */}

        {/* FULL RENT DETAILS  */}
        <div>
          <p className="text-xl font-semibold">Full Rent Details</p>
          <div className="mt-4 mb-6">{/* <GoogleMapComponent /> */}</div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-0">
              <div className="grid grid-cols-3">
                <p className="text-xs font-normal text-card">Rent Price</p>
                <p className="text-xs font-semibold text-primary">
                  {property?.property_details?.rent_details?.weekly_rent_price || ""}/ Week
                </p>
              </div>
              <div className="grid grid-cols-3">
                <p className="text-xs font-normal text-card">Available date</p>
                <p className="text-xs font-semibold text-primary">
                  {formatDate(property?.property_details?.rent_details?.available_from) || ""}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-0">
              <div className="grid grid-cols-3">
                <p className="text-xs font-normal text-card">Lease Terms</p>
                <p className="text-xs font-semibold text-primary">
                  {property?.property_details?.rent_details?.rent_details_lease_terms || ""} months
                </p>
              </div>
              <div className="grid grid-cols-3">
                <p className="text-xs font-normal text-card">Security deposit</p>
                <p className="text-xs font-semibold text-primary">
                  $: {property?.property_details?.rent_details?.bond_or_security_deposit || ""}
                </p>
              </div>
            </div>

          </div>
        </div>


        {/* VIDEOS AND FILES  */}
        {
          property?.property_details?.documents?.videos.length > 0 ? (
            <div className="">
              <p className="text-xl font-semibold mb-3">Videos</p>

              <div className={`grid grid-cols-1 gap-4 md:gap-6 mb-7`}>
                <Slider {...settings}>
                  {property?.property_details?.documents?.videos.map(
                    (property: any) => (
                      <div key={property?._id} className="px-2">
                        <Card
                          key={property?._id}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm"
                        >
                          <div className="relative">
                            <video
                              // key={index}
                              // ref={videoRef}
                              src={property?.url}
                              controls
                              playsInline
                              preload="metadata"
                              className="h-full w-full object-contain"
                            />
                          </div>
                        </Card>
                      </div>
                    ),
                  )}
                </Slider>
              </div>
            </div>
          ) : null
        }





        {property?.property_details?.documents?.floor_plans.length > 0 ?
          (
            <div className="">
              <p className="text-xl font-semibold mb-3">Floor Plans</p>

              <div className={`grid grid-cols-1 gap-4 md:gap-6 mb-7`}>
                <Slider {...settings}>
                  {property?.property_details?.documents?.floor_plans.map(
                    (property: any, index: number) => (
                      <div key={property?._id} className="px-2">
                        <Card
                          key={property?._id}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm"
                        >
                          <div className="relative">
                            <a
                              href={property?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block cursor-pointer"
                            >
                              <p className="text-blue-600 hover:underline p-4 text-center">
                                View Floor Plan {index + 1}
                              </p>
                            </a>
                          </div>
                        </Card>
                      </div>
                    ),
                  )}
                </Slider>
              </div>
            </div>
          )
          : null}

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
