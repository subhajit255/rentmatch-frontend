import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LandLordOrPM_SavePostApi,
  postRequestSendApi,
} from "../../actions/myPost";
import { getProperty } from "../../actions/property";
import { toast } from "../../custom-hooks/use-toast";
import {
  Lock,
  MapPin,
  Calendar,
  Star,
  User,
  Check,
  CheckCircle2,
  X,
  Mail,
  Phone,
  Clock,
  MessageSquare,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

const DUMMY_MATCHES = [92, 88, 94, 91, 89, 95];

const PostCard = ({ postDetails, isGuest, index = 0 }: any) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [inviteMessage, setInviteMessage] = useState(
    "Hi! We have a property matching your requirements and would love to invite you for an inspection and chat.",
  );

  const {
    _id,
    created_by,
    move_in_requirements,
    end_price,
    start_price,
    location,
    rentalCityPreference,
    rentalStatePreference,
    created_date,
    is_wishlisted,
    pets,
    invitation_status,
    is_send_request,
  } = postDetails || {};

  const effectiveStatus =
    invitation_status || (is_send_request ? "PENDING" : "NONE");
  const isConnected = effectiveStatus === "APPROVED";
  const isPendingInvite = effectiveStatus === "PENDING";

  const { data: myPropertiesData } = useQuery({
    queryKey: ["my-properties-for-invite"],
    queryFn: () => getProperty(1, 100),
    enabled: inviteModalOpen && !isGuest,
    staleTime: 2 * 60 * 1000,
  });
  const myProperties = Array.isArray(myPropertiesData?.result)
    ? myPropertiesData.result
    : [];

  const rawUsername = (
    created_by?.user_name ||
    created_by?.member_id ||
    created_by?.username ||
    ""
  ).trim();

  // Format unique renter name: Renter RM-<unique_id>
  const renterDisplayName = useMemo(() => {
    if (rawUsername.toUpperCase().startsWith("RM-")) {
      return `Renter ${rawUsername.toUpperCase()}`;
    }
    if (rawUsername.toLowerCase().startsWith("renter rm-")) {
      return rawUsername;
    }
    // Deterministic fallback from ID or username
    const seedStr = (
      created_by?._id ||
      _id ||
      rawUsername ||
      "4812"
    ).toString();
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash * 31 + seedStr.charCodeAt(i)) % 9000;
    }
    const uniqueSuffix = 1000 + Math.abs(hash);
    return `Renter RM-${uniqueSuffix}`;
  }, [rawUsername, created_by, _id]);

  const locationText = useMemo(() => {
    const parts = [
      rentalCityPreference || location,
      rentalStatePreference,
    ].filter(Boolean);
    if (parts.length > 0) return parts.join(", ");
    return location || "Preferred location";
  }, [location, rentalCityPreference, rentalStatePreference]);

  const moveInText = useMemo(() => {
    if (move_in_requirements) {
      if (move_in_requirements === "less_than_15_days") {
        return "Move in within 15 days";
      }
      const d = new Date(move_in_requirements);
      if (!isNaN(d.getTime())) {
        const day = d.getDate();
        const month = d.toLocaleString("en-US", { month: "short" });
        const year = d.getFullYear();
        return `Move in By ${day} ${month} ${year}`;
      }
      return `Move in: ${move_in_requirements}`;
    }
    if (created_date) {
      const d = new Date(created_date);
      if (!isNaN(d.getTime())) {
        const day = d.getDate();
        const month = d.toLocaleString("en-US", { month: "short" });
        const year = d.getFullYear();
        return `Move in From ${day} ${month} ${year}`;
      }
    }
    return "Move in available now";
  }, [move_in_requirements, created_date]);

  const formattedPrice = useMemo(() => {
    const start = Number(start_price);
    const end = Number(end_price);
    if (!isNaN(start) && !isNaN(end) && (start > 0 || end > 0)) {
      if (start > 0 && end > 0) {
        return `$${start.toLocaleString()} to $${end.toLocaleString()}`;
      } else if (end > 0) {
        return `Up to $${end.toLocaleString()}`;
      } else {
        return `From $${start.toLocaleString()}`;
      }
    }
    if (postDetails?.price) {
      const p = String(postDetails.price).trim();
      return p.replace(/per week/gi, "").trim();
    }
    return "$600 to $700";
  }, [start_price, end_price, postDetails]);

  const matchPercent =
    postDetails?.match_percentage ||
    DUMMY_MATCHES[Math.abs(index) % DUMMY_MATCHES.length];

  const realTenantName =
    `${created_by?.first_name || ""} ${created_by?.last_name || ""}`.trim();
  const cardDisplayName =
    isConnected && realTenantName ? realTenantName : renterDisplayName;

  const { mutate: sendInvitation, isPending: isSendingInvite } = useMutation({
    mutationFn: postRequestSendApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["all_post"] });
      queryClient.invalidateQueries({ queryKey: ["postDetails", _id] });
      setInviteModalOpen(false);
      toast({
        title: res?.already_sent ? "Already Invited" : "Invitation Sent!",
        description: res?.already_sent
          ? res?.message
          : "The renter will see your invitation in their dashboard. Their details stay private until they accept.",
        variant: "success",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Invitation Failed",
        description:
          err?.response?.data?.message ||
          "Could not send invitation. Please try again.",
        variant: "error",
      });
    },
  });

  const handleInviteClick = () => {
    if (isGuest) {
      navigate("/login");
      return;
    }
    if (isConnected) {
      navigate("/message");
      return;
    }
    if (isPendingInvite) return;
    setInviteModalOpen(true);
  };

  const handleConfirmSendInvite = () => {
    const chosenPropId = selectedPropertyId || myProperties?.[0]?._id || "";
    sendInvitation({
      property_post_object_id: _id,
      properties: chosenPropId ? [{ property_object_id: chosenPropId }] : [],
      details: inviteMessage,
    });
  };

  const { mutate: savePost } = useMutation({
    mutationFn: (property_object_id: string) =>
      LandLordOrPM_SavePostApi(
        property_object_id,
        is_wishlisted ? false : true,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-posts"] });
      queryClient.invalidateQueries({ queryKey: ["all_post"] });
      toast({
        title: is_wishlisted ? "Removed from Shortlist" : "Added to Shortlist",
        description: is_wishlisted
          ? "Tenant removed from your shortlist."
          : "Tenant successfully shortlisted.",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Action Failed",
        description: "Could not update shortlist. Please try again.",
        variant: "error",
      });
    },
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all p-5 flex flex-col gap-3 relative">
      {/* Top row: Avatar, Name, Identity private / Connected, Star */}
      <div className="flex items-start justify-between">
        <div
          className="flex items-center gap-3.5 cursor-pointer"
          onClick={() => navigate(`/tenant-post-details/${_id}`)}
        >
          <div className="w-12 h-12 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-xs">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-base font-bold text-slate-900 leading-snug hover:text-[#1E3A8A] transition-colors">
              {cardDisplayName}
            </h4>
            {isConnected ? (
              <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />{" "}
                Connected · Identity shared
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-slate-500 font-normal mt-0.5">
                <Lock className="w-3 h-3 text-slate-400" /> Identity private
              </span>
            )}
          </div>
        </div>

        {!isGuest && (
          <button
            type="button"
            onClick={() => savePost(_id)}
            className="text-amber-400 hover:text-amber-500 transition-colors p-1 cursor-pointer"
            title={is_wishlisted ? "Remove from shortlist" : "Add to shortlist"}
          >
            <Star
              className={`w-5 h-5 ${is_wishlisted ? "fill-amber-400 text-amber-400" : "text-amber-400"}`}
            />
          </button>
        )}
      </div>

      {/* Location & Move In rows */}
      <div className="flex flex-col gap-1.5 text-xs text-slate-600 font-medium pt-1">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{locationText}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{moveInText}</span>
        </div>
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F8EE] text-[#15803D]">
          <Check className="w-3 h-3 text-[#15803D] stroke-[2.5]" /> Budget fits
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F8EE] text-[#15803D]">
          <Check className="w-3 h-3 text-[#15803D] stroke-[2.5]" />{" "}
          {pets && pets !== "no" && pets !== "none"
            ? "Pets considered"
            : "Suburb"}
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F8EE] text-[#15803D]">
          <Check className="w-3 h-3 text-[#15803D] stroke-[2.5]" /> Dates align
        </span>
      </div>

      {/* Price & Match percentage row */}
      <div className="flex items-center justify-between pt-1">
        <div className="text-sm font-bold text-slate-900">
          <span className="font-normal text-slate-600">Price: </span>
          <span>{formattedPrice} per week</span>
        </div>
        {/* <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#E8F8EE] text-[#15803D] border border-emerald-100">
                    {matchPercent}% match
                </div> */}
      </div>

      {/* Contact info (only revealed after tenant accepts) */}
      {isConnected && (created_by?.email || created_by?.phone_number) && (
        <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-800 bg-emerald-50/70 border border-emerald-100 rounded-xl px-3 py-2">
          {created_by?.email && (
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              {created_by.email}
            </span>
          )}
          {created_by?.phone_number && (
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              {created_by?.phone_extension || ""} {created_by.phone_number}
            </span>
          )}
        </div>
      )}

      {/* Action buttons row */}
      <div className="flex items-center gap-3 pt-1">
        <Button
          onClick={handleInviteClick}
          disabled={isPendingInvite}
          className={`flex-1 rounded-full font-semibold text-xs sm:text-sm py-2.5 h-10 shadow-xs cursor-pointer ${
            isConnected
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : isPendingInvite
                ? "bg-amber-100 text-amber-800 hover:bg-amber-100 border border-amber-200 cursor-not-allowed"
                : "bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
          }`}
        >
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" /> Message Tenant
            </span>
          ) : isPendingInvite ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Invitation Pending
            </span>
          ) : (
            "Invite to connect"
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => (isGuest ? navigate("/login") : savePost(_id))}
          className={`flex-1 rounded-full border-2 font-semibold text-xs sm:text-sm py-2.5 h-10 transition-all cursor-pointer ${
            is_wishlisted
              ? "border-emerald-600 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/50"
              : "border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/5"
          }`}
        >
          {is_wishlisted ? "Shortlisted" : "Shortlist"}
        </Button>
      </div>

      {/* Invite to Connect Modal */}
      <Dialog.Root open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50" />
          <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-md bg-white p-6 rounded-3xl shadow-2xl z-50 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <Dialog.Title className="text-base font-bold text-slate-900">
                  Invite {renterDisplayName}
                </Dialog.Title>
                <p className="text-xs text-slate-500 mt-0.5">
                  Renter identity stays private until they accept your
                  invitation.
                </p>
              </div>
              <Dialog.Close asChild>
                <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Property to Share (Optional)
                </label>
                {myProperties.length > 0 ? (
                  <select
                    value={selectedPropertyId || myProperties[0]?._id || ""}
                    onChange={(e) => setSelectedPropertyId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                  >
                    {myProperties.map((prop: any) => (
                      <option key={prop._id} value={prop._id}>
                        {prop?.property_details?.basic?.property_name ||
                          "Property"}{" "}
                        — $
                        {prop?.property_details?.rent_details
                          ?.weekly_rent_price || 0}
                        /wk
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">
                    No properties listed yet. You can still send an invitation
                    to connect, or{" "}
                    <span
                      onClick={() => {
                        setInviteModalOpen(false);
                        navigate("/property/create");
                      }}
                      className="text-[#1E3A8A] font-semibold underline cursor-pointer"
                    >
                      add a property
                    </span>{" "}
                    first.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Invitation Message
                </label>
                <textarea
                  rows={3}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                  placeholder="Write a brief message to the renter..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setInviteModalOpen(false)}
                className="rounded-full px-5 h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isSendingInvite}
                onClick={handleConfirmSendInvite}
                className="rounded-full px-6 h-9 text-xs bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
              >
                {isSendingInvite ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default PostCard;
