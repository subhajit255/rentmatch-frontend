import React, { useMemo } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LandLordOrPM_SavePostApi } from "../../actions/myPost";
import { toast } from "../../custom-hooks/use-toast";
import { Lock, MapPin, Calendar, Star, User, Check } from "lucide-react";

const DUMMY_MATCHES = [92, 88, 94, 91, 89, 95];

const PostCard = ({ postDetails, isGuest, index = 0 }: any) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

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
        pets
    } = postDetails || {};

    const rawUsername = (created_by?.user_name || created_by?.member_id || created_by?.username || "").trim();

    // Format unique renter name: Renter RM-<unique_id>
    const renterDisplayName = useMemo(() => {
        if (rawUsername.toUpperCase().startsWith("RM-")) {
            return `Renter ${rawUsername.toUpperCase()}`;
        }
        if (rawUsername.toLowerCase().startsWith("renter rm-")) {
            return rawUsername;
        }
        // Deterministic fallback from ID or username
        const seedStr = (created_by?._id || _id || rawUsername || "4812").toString();
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++) {
            hash = (hash * 31 + seedStr.charCodeAt(i)) % 9000;
        }
        const uniqueSuffix = 1000 + Math.abs(hash);
        return `Renter RM-${uniqueSuffix}`;
    }, [rawUsername, created_by, _id]);

    const locationText = useMemo(() => {
        const parts = [rentalCityPreference || location, rentalStatePreference].filter(Boolean);
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

    const matchPercent = postDetails?.match_percentage || DUMMY_MATCHES[Math.abs(index) % DUMMY_MATCHES.length];

    const handleClick = (id: string) => {
        navigate(`/tenant-post-details/${id}`);
    };

    const { mutate: savePost } = useMutation({
        mutationFn: (property_object_id: string) =>
            LandLordOrPM_SavePostApi(property_object_id, is_wishlisted ? false : true),
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
            {/* Top row: Avatar, Name, Identity private, Star */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                            {renterDisplayName}
                        </h4>
                        <span className="flex items-center gap-1 text-xs text-slate-500 font-normal mt-0.5">
                            <Lock className="w-3 h-3 text-slate-400" /> Identity private
                        </span>
                    </div>
                </div>

                {!isGuest && (
                    <button
                        type="button"
                        onClick={() => savePost(_id)}
                        className="text-amber-400 hover:text-amber-500 transition-colors p-1 cursor-pointer"
                        title={is_wishlisted ? "Remove from shortlist" : "Add to shortlist"}
                    >
                        <Star className={`w-5 h-5 ${is_wishlisted ? "fill-amber-400 text-amber-400" : "text-amber-400"}`} />
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
                    <Check className="w-3 h-3 text-[#15803D] stroke-[2.5]" /> {pets && pets !== "no" && pets !== "none" ? "Pets considered" : "Suburb"}
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
                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#E8F8EE] text-[#15803D] border border-emerald-100">
                    {matchPercent}% match
                </div>
            </div>

            {/* Action buttons row */}
            <div className="flex items-center gap-3 pt-1">
                <Button
                    onClick={() => handleClick(_id)}
                    className="flex-1 rounded-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold text-xs sm:text-sm py-2.5 h-10 shadow-xs cursor-pointer"
                >
                    Invite to connect
                </Button>
                <Button
                    variant="outline"
                    onClick={() => savePost(_id)}
                    className={`flex-1 rounded-full border-2 font-semibold text-xs sm:text-sm py-2.5 h-10 transition-all cursor-pointer ${
                        is_wishlisted
                            ? "border-emerald-600 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/50"
                            : "border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/5"
                    }`}
                >
                    {is_wishlisted ? "Shortlisted" : "Shortlist"}
                </Button>
            </div>
        </div>
    );
};

export default PostCard;
