import React, { useEffect, useState } from "react";
import PropertyTypeCard from "./PropertyTypeCard";
import PropertyListing from "./PropertyListing";
import { Card, CardContent } from "../ui/card";
import { IMAGES } from "../../assets";
import PercentageViewer from "../ChildComponent/PercentageViewer";
import ToggleButton from "../ChildComponent/ToggleButton";
import { useAuth } from "../../context/AuthContext";
import { transmissionLowerCase } from "../../lib/utils";
import { cn } from "../lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDashboardData,
  getDashboardPropertyData,
} from "../../actions/common";
import {
  acceptRejectPostRequestApi,
  getTenantInvitationsApi,
} from "../../actions/myPost";
import { Link } from "react-router-dom";
import { ChartBarMultiple } from "../cards/barCharts";
import ProgressAnalysis from "../cards/progressAnalysis";
import {
  Mail,
  Phone,
  CalendarDays,
  Heart,
  Users,
  FileText,
  MessageSquare,
  Calendar,
  Headphones,
  ShieldCheck,
  X,
  CheckCircle2,
  Building,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "../../custom-hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { openMatchingPreferencesModal } from "../modals/RenterPreferencesModalManager";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [percentage, setPercentage] = useState<number>(75);
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Landlord invitation state (dynamic from backend)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [acceptedLandlordName, setAcceptedLandlordName] = useState<string | null>(null);

  const { data: invitationsData } = useQuery({
    queryKey: ["tenant-invitations"],
    queryFn: getTenantInvitationsApi,
    enabled: user?.role === "TENANT",
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["dash-kpi"],
    queryFn: () => getDashboardData(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: propertyWithCount, isLoading: countKpiLoading } = useQuery({
    queryKey: ["dash-prop-kpi"],
    queryFn: () => getDashboardPropertyData(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getMemberSince = () => {
    const dateVal = (user as any)?.createdAt || (user as any)?.created_at;
    if (dateVal) {
      try {
        return new Date(dateVal).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      } catch (e) {
        // fallback
      }
    }
    return "May 2026";
  };

  const getRoleLabel = (role?: string) => {
    if (!role) return "Member";
    switch (role.toUpperCase()) {
      case "TENANT":
        return "Tenant Member";
      case "LANDLORD":
        return "Landlord Member";
      case "PROPERTY MANAGER":
        return "Property Manager";
      case "SUPER ADMIN":
        return "Super Admin";
      case "ADMIN":
        return "Admin";
      default:
        return role;
    }
  };

  // backend dashboardCount returns the same admin payload for ADMIN and SUPER ADMIN
  const isSuperAdmin = user?.role === "SUPER ADMIN" || user?.role === "ADMIN";

  const kpiCards = isSuperAdmin
    ? [
        {
          title: "Total Users",
          desc: "Registered user accounts",
          // admin payload carries the member count in totalPostSaved
          value: data?.data?.totalPostSaved || 0,
          bgClass: "bg-[#F3F7FD] text-primary",
          icon: <Users className="w-6 h-6 text-primary" />,
        },
        {
          title: "Total Subscribers",
          desc: "Subscribed members",
          value: data?.data?.totalMemberSubscription || 0,
          bgClass: "bg-[#E9FFEE] text-emerald-600",
          icon: <Users className="w-6 h-6 text-emerald-600" />,
        },
        {
          title: "Total Revenue",
          desc: "Total revenue earned",
          value: data?.data?.totalPost || 0,
          bgClass: "bg-[#FBF6E5] text-[#FFA920]",
          icon: <FileText className="w-6 h-6 text-[#FFA920]" />,
        },
        {
          title: "Total Properties",
          desc: "Properties listed",
          value: data?.data?.totalMyProperty || 0,
          bgClass: "bg-[#F4F8FF] text-blue-600",
          icon: <Heart className="w-6 h-6 text-blue-600" />,
        },
        {
          title: "Total Inspections",
          desc: "Inspections scheduled",
          value: data?.data?.totalScheduled || 0,
          bgClass: "bg-[#FFF0F0] text-rose-600",
          icon: <Calendar className="w-6 h-6 text-rose-600" />,
        },
        {
          title: "Total Visitors",
          desc: "Unique visitors",
          value: data?.data?.totalQueryFeedback || 0,
          bgClass: "bg-[#F4F8FF] text-primary",
          icon: <Headphones className="w-6 h-6 text-primary" />,
        },
      ]
    : [
        {
          title: "Saved Rentals",
          desc: "Properties you saved",
          value:
            data?.data?.totalPropertySaved ?? data?.data?.totalPostSaved ?? 0,
          bgClass: "bg-[#F3F7FD] text-primary",
          icon: <Heart className="w-6 h-6 text-primary" />,
        },
        {
          title: "Match Requests",
          desc: "Renters connected",
          value:
            data?.data?.totalPropertyRequests ??
            data?.data?.totalPostRequests ??
            0,
          bgClass: "bg-[#E9FFEE] text-emerald-600",
          icon: <Users className="w-6 h-6 text-emerald-600" />,
        },
        {
          title: "Listings Live",
          desc: "Your active properties",
          value: data?.data?.totalPost || 0,
          bgClass: "bg-[#F3E8FF] text-purple-600",
          icon: <FileText className="w-6 h-6 text-purple-600" />,
        },
        {
          title: "New Messages",
          desc: "Unread messages",
          value: data?.data?.totalNewMessages || 0,
          bgClass: "bg-[#FFFBEB] text-amber-600",
          icon: <MessageSquare className="w-6 h-6 text-amber-600" />,
        },
        {
          title: "Inspections Booked",
          desc: "Upcoming inspections",
          value: data?.data?.totalScheduled || 0,
          bgClass: "bg-[#FFF0F0] text-rose-600",
          icon: <Calendar className="w-6 h-6 text-rose-600" />,
        },
        {
          title: "Support Ticket",
          desc: "Open support requests",
          value: data?.data?.totalQueryFeedback || 0,
          bgClass: "bg-[#E0F2FE] text-sky-600",
          icon: <Headphones className="w-6 h-6 text-sky-600" />,
        },
      ];

  let bannerTitle = `Welcome back, ${user?.first_name || "User"}! 👋`;
  let bannerDesc =
    "Post your rental requirements once and let landlords, agents, and property managers come to you.";
  let button1Text = "Post Rental Request";
  let button1Link = "/create-post";
  let button2Text = "Explore Rentals";
  let button2Link = "/explore-properties";

  if (user?.role === "SUPER ADMIN" || user?.role === "ADMIN") {
    bannerTitle = `Welcome back, Admin ${user?.first_name || ""}! 👋`;
    bannerDesc =
      "Manage users, subscriptions, properties, and system-wide configurations.";
    button1Text = "View Analytics";
    button1Link = "/data-and-analytics";
    button2Text = "Manage Plans";
    button2Link = "/subscription/plans";
  } else if (user?.role === "LANDLORD" || user?.role === "PROPERTY MANAGER") {
    bannerTitle = `Welcome back, ${user?.first_name || "Owner"}! 👋`;
    bannerDesc =
      "Post your properties once and let tenants and house seekers find you instantly.";
    button1Text = "Post Property";
    button1Link = "/property/create";
    button2Text = "Find Tenants";
    button2Link = "/find-tenants";
  }

  const invitations = Array.isArray(invitationsData?.result)
    ? invitationsData.result
    : [];
  const pendingInvitations = invitations.filter(
    (inv: any) => inv.status === "PENDING",
  );
  const invitationCount = pendingInvitations.length;

  const { mutate: respondToInvitation, isPending: isResponding } = useMutation({
    mutationFn: acceptRejectPostRequestApi,
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tenant-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["dash-kpi"] });
      if (variables.status === "APPROVED") {
        toast({
          title: "Invitation Accepted!",
          description:
            "Your identity has been shared with the landlord. You can now connect and message.",
          variant: "success",
        });
      } else {
        setAcceptedLandlordName(null);
        toast({
          title: "Invitation Declined",
          description: "You have declined this landlord's connection invitation.",
          variant: "default",
        });
      }
    },
    onError: () => {
      setAcceptedLandlordName(null);
      toast({
        title: "Action Failed",
        description: "Could not update invitation status. Please try again.",
        variant: "error",
      });
    },
  });

  const handleAcceptInvitation = (inv: any) => {
    const landlord = inv?.requested_by;
    const landlordName =
      landlord?.company_details?.company_name ||
      `${landlord?.first_name || ""} ${landlord?.last_name || ""}`.trim() ||
      "the landlord";
    setAcceptedLandlordName(landlordName);
    respondToInvitation({
      request_post_id: inv._id,
      status: "APPROVED",
    });
  };

  const handleDeclineInvitation = (inv: any) => {
    respondToInvitation({
      request_post_id: inv._id,
      status: "REJECTED",
    });
  };

  return (
    <>
      <div className="flex flex-col gap-6 common-container pb-8">
        {/* Landlord Invitation Notification Banner */}
        {user?.role === "TENANT" && invitationCount > 0 && (
          <div className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
            {/* Green vertical bar on the left */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#10b981] rounded-l-2xl" />

            <div className="pl-3 sm:pl-4">
              <p className="text-sm sm:text-[15px] font-medium text-slate-800 leading-snug">
                <span className="font-semibold text-slate-900">
                  {invitationCount}{" "}
                  {invitationCount === 1 ? "landlord has" : "landlords have"}
                </span>{" "}
                invited you to connect. Your identity stays private until you
                accept.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 pl-3 sm:pl-0">
              <button
                type="button"
                onClick={() => {
                  setAcceptedLandlordName(null);
                  setReviewModalOpen(true);
                }}
                className="inline-flex items-center justify-center bg-[#2838a3] hover:bg-[#1e2c88] active:scale-98 text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-sm transition-all whitespace-nowrap cursor-pointer"
              >
                Review invitations
              </button>
            </div>
          </div>
        )}

        {/* Top Row: Welcome Banner & User Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Welcome Banner */}
          <div className="lg:col-span-8 col-span-12 bg-primary rounded-3xl p-6 md:p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-[0px_4px_20px_rgba(51,82,164,0.15)] min-h-[320px]">
            {/* Ambient background shapes for premium look */}
            <div className="absolute right-0 bottom-0 w-[280px] h-[280px] bg-white/5 rounded-full blur-3xl -mr-16 -mb-16 pointer-events-none" />
            <div className="absolute left-1/3 top-1/4 w-[160px] h-[160px] bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

            {/* Content Top */}
            <div className="z-10 w-full">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
                  {bannerTitle.replace(/!\s*👋$/, "")}
                </h1>
                <p className="text-sm md:text-base text-blue-100/90 font-medium max-w-lg leading-relaxed">
                  {bannerDesc}
                </p>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  to={button1Link}
                  className="bg-[#FFA920] hover:bg-[#ffb63b] text-[#1E1E1E] font-bold text-sm md:text-base px-7 py-3 rounded-full transition-all duration-200 shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {button1Text}
                </Link>
                <Link
                  to={button2Link}
                  className="border-2 border-white/90 hover:border-white text-white font-bold text-sm md:text-base px-7 py-2.5 rounded-full hover:bg-white/10 transition-all duration-200"
                >
                  {button2Text}
                </Link>
              </div>
            </div>

            {/* Bottom 3D Object Illustration */}
            <div className="relative mt-6 w-full flex items-center justify-start pl-4 z-10">
              <img
                src={IMAGES.object}
                alt="RentMatch 3D Illustration"
                className="w-36 h-28 md:w-44 md:h-36 object-contain drop-shadow-xl"
                onError={(e) => {
                  e.currentTarget.src = IMAGES.object_slide;
                }}
              />
            </div>
          </div>

          {/* User Profile Card */}
          {user?.role !== "GUEST" && (
            <div className="lg:col-span-4 col-span-12 bg-white rounded-3xl border border-gray-100 p-6 md:p-7 shadow-sm flex flex-col justify-start">
              {/* Profile Details */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative shrink-0">
                  <img
                    src={user?.avatar || IMAGES.user_img}
                    alt="User profile avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-50 p-0.5 shadow-sm"
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    {user?.first_name || ""} {user?.last_name || ""}
                  </h2>
                  <p className="text-sm font-semibold text-blue-600 mt-0.5">
                    {getRoleLabel(user?.role)}
                  </p>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">
                    ID: {user?.member_id || "N/A"}
                  </p>
                </div>
              </div>

              <hr className="border-gray-100 mb-4" />

              {/* Contacts info list */}
              <div className="flex flex-col gap-3">
                {/* Email */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <Mail size={16} className="text-gray-400 shrink-0" />
                    <span
                      className="truncate font-semibold text-gray-700"
                      title={user?.email}
                    >
                      {user?.email}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0">
                    <img
                      src={IMAGES.verified}
                      alt="Verified"
                      className="w-3 h-3 shrink-0"
                    />
                    Verified
                  </span>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400 shrink-0" />
                    <span className="font-semibold text-gray-700">
                      {user?.phone_number || "N/A"}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0">
                    <img
                      src={IMAGES.verified}
                      alt="Verified"
                      className="w-3 h-3 shrink-0"
                    />
                    Verified
                  </span>
                </div>

                {/* Calendar / Join Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500 font-semibold mt-1">
                  <CalendarDays size={16} className="text-gray-400 shrink-0" />
                  <span>Member Since {getMemberSince()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Row 2: KPI Metrics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpiCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:shadow-md hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center font-bold text-xl",
                  card.bgClass,
                )}
              >
                {card.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-3xl font-extrabold text-gray-900 leading-none">
                  {card.value}
                </span>
                <span className="text-base font-bold text-gray-800 leading-tight">
                  {card.title}
                </span>
                <span className="text-xs text-gray-400 font-semibold leading-none mt-0.5">
                  {card.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Property Types */}
        {!countKpiLoading ? (
          <PropertyTypeCard
            propertyTypeCounts={propertyWithCount?.result || []}
          />
        ) : null}
        {/* <PropertyListing /> */}
      </div>

      {/* Review Invitations Modal */}
      <Dialog.Root open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 animate-in fade-in duration-200" />
          <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white p-6 rounded-3xl shadow-2xl z-50 border border-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <Dialog.Title className="text-base font-bold text-gray-900 leading-tight">
                    Landlord {invitationCount > 1 ? `Invitations (${invitationCount})` : "Invitation"}
                  </Dialog.Title>
                  <p className="text-xs text-emerald-700 font-medium">
                    Identity Protected ({(user as any)?.user_name || user?.member_id || "Renter"})
                  </p>
                </div>
              </div>
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors">
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>

            {/* Content Body */}
            {acceptedLandlordName ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
                <h4 className="text-base font-bold text-gray-900">
                  Invitation Accepted!
                </h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Your identity has now been shared with{" "}
                  <span className="font-semibold text-gray-800">
                    {acceptedLandlordName}
                  </span>
                  . You can now chat directly to schedule an inspection.
                </p>
                <div className="pt-3 flex justify-center gap-3">
                  {pendingInvitations.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setAcceptedLandlordName(null)}
                      className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-all"
                    >
                      Review Next ({pendingInvitations.length})
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setReviewModalOpen(false);
                      setAcceptedLandlordName(null);
                      navigate("/message");
                    }}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-[#2838a3] hover:bg-[#1e2c88] rounded-full shadow-sm transition-all"
                  >
                    Go to Messages
                  </button>
                </div>
              </div>
            ) : pendingInvitations.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-700">
                  No pending invitations
                </p>
                <p className="text-xs text-slate-500">
                  You have reviewed all landlord invitations.
                </p>
              </div>
            ) : (
              <div className="py-4 space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  A landlord has reviewed your preferences and invited you to
                  connect. Your real name and contact details remain hidden
                  until you choose to accept.
                </p>

                {pendingInvitations.map((inv: any) => {
                  const landlord = inv?.requested_by || {};
                  const landlordName =
                    landlord?.company_details?.company_name ||
                    `${landlord?.first_name || ""} ${landlord?.last_name || ""}`.trim() ||
                    "Verified Landlord";
                  const initials = landlordName
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w: string) => w[0]?.toUpperCase())
                    .join("") || "LL";
                  const roleLabel =
                    landlord?.role === "PROPERTY MANAGER"
                      ? "Verified Property Manager"
                      : "Verified Landlord";
                  const invitedProp = inv?.properties?.[0]?.property_object_id;
                  const propBasic = invitedProp?.property_details?.basic;
                  const propFeatures = invitedProp?.property_details?.features;
                  const propRent = invitedProp?.property_details?.rent_details;
                  const postInfo = inv?.property_post_object_id;

                  return (
                    <div
                      key={inv._id}
                      className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
                            {initials}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-gray-900 leading-snug">
                              {landlordName}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {roleLabel}
                            </span>
                          </div>
                        </div>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            openMatchingPreferencesModal();
                          }}
                          className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200/80 transition-colors cursor-pointer px-2.5 py-1 rounded-full shadow-2xs hover:underline"
                          title="Click to view or adjust your matching preferences"
                        >
                          Preferences
                        </span>
                      </div>

                      {invitedProp ? (
                        <div className="bg-white rounded-xl p-3 border border-slate-100 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">
                              {propBasic?.property_name || "Rental Property"}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                              {propFeatures?.no_of_bedrooms || 0} Beds ·{" "}
                              {propFeatures?.no_of_bathrooms || 0} Baths ·{" "}
                              {propFeatures?.parking || propFeatures?.no_of_garage || 0} Parking
                            </p>
                          </div>
                          <span className="font-bold text-sm text-blue-600 shrink-0">
                            ${propRent?.weekly_rent_price || 0} / week
                          </span>
                        </div>
                      ) : postInfo ? (
                        <div className="bg-white rounded-xl p-3 border border-slate-100">
                          <p className="text-xs font-bold text-gray-900">
                            Regarding: {postInfo?.subject || "Your Rental Post"}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {postInfo?.rentalCityPreference || postInfo?.location || ""}
                          </p>
                        </div>
                      ) : null}

                      <p className="text-xs text-gray-600 italic bg-white/70 p-2.5 rounded-lg border border-slate-100">
                        "
                        {inv?.details?.trim() ||
                          "Hi! We have a property matching your requirements and would love to invite you for an inspection and chat."}
                        "
                      </p>

                      {/* Action Buttons */}
                      <div className="pt-1 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          disabled={isResponding}
                          onClick={() => handleDeclineInvitation(inv)}
                          className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                        >
                          Decline
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setReviewModalOpen(false);
                              navigate("/my-posts");
                            }}
                            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                          >
                            View in My Posts
                          </button>
                          <button
                            type="button"
                            disabled={isResponding}
                            onClick={() => handleAcceptInvitation(inv)}
                            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-sm transition-colors disabled:opacity-50"
                          >
                            Accept & Connect
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default Dashboard;
