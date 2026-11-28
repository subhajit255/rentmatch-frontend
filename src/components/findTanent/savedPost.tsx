import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Calendar, Star, User, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { IMAGES } from "../../assets/index";
import { LandLordOrPM_SavePostApi, LandLordOrPM_SavePostList } from "../../actions/myPost";
import { toast } from "../../custom-hooks/use-toast";

const DUMMY_MATCHES = [92, 88, 94, 91, 89, 95];

const getRenterDisplayName = (post: any) => {
  const createdBy = post?.created_by || {};
  const isApproved = post?.invitation_status === "APPROVED";
  const realName = `${createdBy?.first_name || ""} ${createdBy?.last_name || ""}`.trim();
  if (isApproved && realName) {
    return realName;
  }

  const rawUsername = (createdBy?.user_name || createdBy?.member_id || createdBy?.username || "").trim();
  if (rawUsername.toUpperCase().startsWith("RM-")) {
    return `Renter ${rawUsername.toUpperCase()}`;
  }
  if (rawUsername.toLowerCase().startsWith("renter rm-")) {
    return rawUsername;
  }

  const seedStr = (createdBy?._id || post?._id || rawUsername || "4812").toString();
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) % 9000;
  }
  return `Renter RM-${1000 + Math.abs(hash)}`;
};

const isPostUrgent = (post: any): boolean => {
  const moveReq = String(post?.move_in_requirements || "").trim();
  if (moveReq.toLowerCase() === "less_than_15_days") return true;

  const text = `${post?.subject || ""} ${post?.about_post || ""}`.toLowerCase();
  if (text.includes("urgent") || text.includes("asap") || text.includes("immediately")) {
    return true;
  }

  if (moveReq) {
    const moveDate = new Date(moveReq);
    if (!isNaN(moveDate.getTime())) {
      const diffDays = (moveDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      if (diffDays <= 15) return true;
    }
  }
  return false;
};

const formatMoveIn = (post: any): string => {
  const moveReq = post?.move_in_requirements;
  if (moveReq) {
    if (moveReq === "less_than_15_days") return "Move in within 15 days";
    const d = new Date(moveReq);
    if (!isNaN(d.getTime())) {
      const day = d.getDate();
      const month = d.toLocaleString("en-US", { month: "short" });
      const year = d.getFullYear();
      return `Move in from ${day} ${month} ${year}`;
    }
    return `Move in: ${String(moveReq).replace(/_/g, " ")}`;
  }
  if (post?.created_date) {
    const d = new Date(post.created_date);
    if (!isNaN(d.getTime())) {
      const day = d.getDate();
      const month = d.toLocaleString("en-US", { month: "short" });
      const year = d.getFullYear();
      return `Move in from ${day} ${month} ${year}`;
    }
  }
  return "Move in flexible";
};

const formatPrice = (post: any): string => {
  const start = Number(post?.start_price);
  const end = Number(post?.end_price);
  if (!isNaN(start) && !isNaN(end) && (start > 0 || end > 0)) {
    if (start > 0 && end > 0) return `$${start.toLocaleString()} to $${end.toLocaleString()} / week`;
    if (end > 0) return `Up to $${end.toLocaleString()} / week`;
    return `From $${start.toLocaleString()} / week`;
  }
  return "$0 / week";
};

function SavedTenentPost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: savedPosts, isLoading } = useQuery({
    queryKey: ["saved-posts"],
    queryFn: () => LandLordOrPM_SavePostList(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { mutate: toggleSavePost } = useMutation({
    mutationFn: (postId: string) => LandLordOrPM_SavePostApi(postId, false),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-posts"] });
      queryClient.invalidateQueries({ queryKey: ["all_post"] });
      toast({
        title: "Removed from Saved Posts",
        description: "Tenant post removed from your shortlist.",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Action Failed",
        description: "Could not remove saved post. Please try again.",
        variant: "error",
      });
    },
  });

  const postData: any[] = useMemo(() => {
    return isLoading ? [] : savedPosts?.result ?? [];
  }, [savedPosts, isLoading]);

  if (isLoading) {
    return (
      <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 sm:p-8 space-y-5">
          <div className="h-7 w-40 bg-slate-200 rounded animate-pulse" />
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-100 p-6 space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-9 w-28 bg-slate-200 rounded-full" />
              </div>
              <div className="h-4 w-2/3 bg-slate-200 rounded" />
              <div className="h-12 w-full bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!postData || postData.length === 0) {
    return (
      <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-8 sm:p-12 text-center flex flex-col items-center">
          <img
            src={IMAGES.error}
            alt="No Saved Posts"
            className="mb-5 w-48 opacity-85"
          />
          <h3 className="text-xl font-bold text-slate-900">No Saved Posts Yet</h3>
          <p className="text-sm text-slate-500 mt-1.5 max-w-md">
            You haven&apos;t shortlisted any tenant requirement posts yet. Browse prospective renters in Find a Tenant to save them here.
          </p>
          <Button
            onClick={() => navigate("/find-tenants")}
            className="mt-6 rounded-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white px-7 h-10 text-sm font-semibold"
          >
            Find a Tenant
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
          Saved Posts
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {postData.map((item: any, index: number) => {
            const post = item?.post_details || {};
            const postId = post?._id;
            const isConnected = post?.invitation_status === "APPROVED";
            const renterName = getRenterDisplayName(post);
            const locationParts = [
              post?.rentalCityPreference || post?.location,
              post?.rentalStatePreference,
            ].filter(Boolean);
            const locationText =
              locationParts.length > 0 ? locationParts.join(" ") : "Location flexible";
            const urgent = isPostUrgent(post);
            const matchPercent =
              post?.match_percentage || DUMMY_MATCHES[index % DUMMY_MATCHES.length];
            const propertyTypeName =
              post?.property_type?.name ||
              post?.property_type_object_id?.name ||
              "Any";

            return (
              <div
                key={item?._id || postId || index}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-all"
              >
                {/* Header: Avatar + Name + Identity status | View Details */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                        {renterName}
                      </h3>
                      {isConnected ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Connected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 mt-0.5">
                          <Lock className="w-3 h-3 text-slate-400" />
                          Identity private
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => postId && navigate(`/tenant-post-details/${postId}`)}
                    className="rounded-full border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white font-semibold px-5 h-9 text-xs sm:text-sm shrink-0 transition-colors cursor-pointer"
                  >
                    View Details
                  </Button>
                </div>

                {/* Subject */}
                <h4 className="text-base font-bold text-slate-900 mt-4 mb-2">
                  {post?.subject || "Looking for a rental property"}
                </h4>

                {/* Location + Move-in + Urgent badge */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{locationText}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{formatMoveIn(post)}</span>
                  </span>
                  {urgent && (
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-[#C10664] text-white">
                      Urgent
                    </span>
                  )}
                </div>

                <hr className="border-slate-100 my-4" />

                {/* Requirements Grid (visible before acceptance) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Price:</span>
                    <span className="font-bold text-[#1E3A8A]">
                      {formatPrice(post)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Bedrooms:</span>
                    <span className="font-bold text-slate-900">
                      {post?.bedrooms ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Property type:</span>
                    <span className="font-bold text-[#1E3A8A]">
                      {propertyTypeName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Bathrooms:</span>
                    <span className="font-bold text-slate-900">
                      {post?.bathrooms ?? 0}
                    </span>
                  </div>
                </div>

                {/* Footer: Match badge + Star */}
                <div className="flex items-center justify-between mt-4 pt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#E8F8EE] text-[#15803D]">
                    {matchPercent}% match
                  </span>
                  <button
                    type="button"
                    onClick={() => postId && toggleSavePost(postId)}
                    className="p-1 text-amber-400 hover:text-amber-500 transition-colors cursor-pointer"
                    title="Remove from saved posts"
                  >
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SavedTenentPost;
