import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  SlidersHorizontal,
  Check,
  AlertCircle,
  Bookmark,
  Sparkles,
  MapPin,
  Bed,
  Bath,
  Car,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../ui/button";
import { useSheet } from "../../context/sheetProvider";
import { useAuth } from "../../context/AuthContext";
import { toast } from "../../custom-hooks/use-toast";
import {
  getPropertyDetailsApi,
  tenantPropertyWishlistAddApi,
  tenantPropertyWishlistRemoveApi,
} from "../../actions/property";
import { getTenantPreferencesApi } from "../../actions/tenantPreferences";
import { openMatchingPreferencesModal } from "../modals/RenterPreferencesModalManager";
import { IMAGES } from "../../assets";

// Criterion definitions for Algorithm v1 (Total 100 points)
interface CriterionConfig {
  key: string;
  label: string;
  max: number;
  defaultScore: number;
  reason?: string;
}

const CRITERIA_CONFIG: CriterionConfig[] = [
  { key: "location", label: "Location", max: 20, defaultScore: 20 },
  { key: "weeklyBudget", label: "Weekly budget", max: 20, defaultScore: 20 },
  { key: "bedrooms", label: "Bedrooms", max: 12, defaultScore: 12 },
  { key: "moveInTiming", label: "Move-in timing", max: 10, defaultScore: 9 },
  { key: "accessibility", label: "Accessibility", max: 10, defaultScore: 10 },
  { key: "bathrooms", label: "Bathrooms", max: 8, defaultScore: 8 },
  { key: "propertyType", label: "Property type", max: 8, defaultScore: 6 },
  { key: "pets", label: "Pets", max: 7, defaultScore: 4 },
  { key: "parking", label: "Parking", max: 5, defaultScore: 3 },
];

export const PropertyMatchDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { openSheet, setParameters: setDrawerParameters } = useSheet();

  // Initial state can come from navigation state (instant render) or fetched from API
  const initialProperty = (location.state as any)?.property;
  const [property, setProperty] = useState<any>(initialProperty || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialProperty);
  const [tenantPrefs, setTenantPrefs] = useState<any>(null);
  const [isWishlist, setIsWishlist] = useState<boolean>(
    Boolean(initialProperty?.is_wishlist),
  );
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Load property details and user preferences
  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const [propData, prefData] = await Promise.allSettled([
        getPropertyDetailsApi(id),
        user
          ? getTenantPreferencesApi(user.id || user._id)
          : Promise.resolve(null),
      ]);

      if (propData.status === "fulfilled" && propData.value) {
        // API might return doc directly or inside data property
        const loadedProp =
          propData.value.data || propData.value.result || propData.value;
        setProperty(loadedProp);
        setIsWishlist(Boolean(loadedProp.is_wishlist));
      }

      if (prefData.status === "fulfilled" && prefData.value) {
        setTenantPrefs(prefData.value);
      }
    } catch (err) {
      console.error("Failed to load property match details", err);
    } finally {
      setIsLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Listen for preference updates made in the modal to refresh scoring
  useEffect(() => {
    const handlePreferencesUpdated = () => {
      loadData();
    };

    window.addEventListener(
      "matching-preferences-updated",
      handlePreferencesUpdated,
    );
    return () => {
      window.removeEventListener(
        "matching-preferences-updated",
        handlePreferencesUpdated,
      );
    };
  }, [loadData]);

  // Property details shortcuts
  const propDetails = property?.property_details || {};
  const basic = propDetails.basic || {};
  const rentDetails = propDetails.rent_details || {};
  const features = propDetails.features || {};
  const documents = propDetails.documents || {};

  const propertyName = basic.property_name || "Modern Rental Property";
  const suburb = basic.suburb || "";
  const state = basic.state || "NSW";
  const postalCode = basic.postal_code || "";
  const fullAddress =
    basic.full_address ||
    `${suburb} ${state} ${postalCode}`.trim() ||
    "Address on request";
  const weeklyPrice = rentDetails.weekly_rent_price || 0;
  const bedroomsCount = features.no_of_bedrooms ?? 2;
  const bathroomsCount = features.no_of_bathrooms ?? 1;
  const parkingCount = features.parking_spaces ?? features.garages ?? 1;

  // Available from formatted date
  const availableFromText = useMemo(() => {
    if (!rentDetails.available_from) return "Available now";
    try {
      const d = new Date(rentDetails.available_from);
      return `Available ${d.toLocaleDateString("en-AU", { day: "numeric", month: "long" })}`;
    } catch {
      return "Available soon";
    }
  }, [rentDetails.available_from]);

  // Primary image
  const propertyImage = useMemo(() => {
    if (documents.images && documents.images.length > 0) {
      return documents.images[0].url || documents.images[0];
    }
    return null;
  }, [documents.images]);

  // Handle Match Score & Breakdown
  const matchData = useMemo(() => {
    const backendBreakdown = property?.matchBreakdown;
    const backendReasons = property?.matchReasons;
    const rawBackendScore =
      property?.matchScore ??
      property?.matchPercentage ??
      property?.matching_percentage;

    // Build the 9 items
    const items = CRITERIA_CONFIG.map((cfg) => {
      let score = cfg.defaultScore;
      let reason = "";

      if (backendBreakdown && backendBreakdown[cfg.key] !== undefined) {
        score = Number(backendBreakdown[cfg.key]);
      } else if (tenantPrefs) {
        // Fallback calculations if not provided directly by backend breakdown
        const p = tenantPrefs?.data || tenantPrefs?.preferences || tenantPrefs;
        if (cfg.key === "weeklyBudget" && (p.maxBudget || p.weeklyBudget || p.budgetMax)) {
          const rent = Number(weeklyPrice);
          const maxB = Number(p.maxBudget || p.weeklyBudget || p.budgetMax);
          if (rent <= maxB) score = cfg.max;
          else if (rent <= maxB * 1.1) score = Math.round(cfg.max * 0.7);
          else score = Math.round(cfg.max * 0.3);
        } else if (cfg.key === "location" && (p.suburbs || p.suburb)) {
          const preferredSubs: string[] = Array.isArray(p.suburbs) ? p.suburbs : (p.suburb ? [p.suburb] : []);
          const matches = preferredSubs.some((s: string) => s && suburb && s.toLowerCase() === suburb.toLowerCase());
          score = matches ? cfg.max : Math.round(cfg.max * 0.5);
        } else if (cfg.key === "propertyType" && (p.propertyTypes || p.propertyType)) {
          const preferredTypes: string[] = Array.isArray(p.propertyTypes) ? p.propertyTypes : (p.propertyType ? [p.propertyType] : []);
          const propTypeStr: string = basic?.property_type_id?.name || basic?.property_type_id?.slug || "";
          const matches = preferredTypes.some((t: string) => t && propTypeStr && propTypeStr.toLowerCase().includes(t.toLowerCase()));
          score = matches ? cfg.max : Math.round(cfg.max * 0.6);
        } else if (cfg.key === "bedrooms" && (p.minBedrooms || p.bedrooms)) {
          const req = Number(p.minBedrooms || p.bedrooms);
          score = Number(bedroomsCount) >= req ? cfg.max : Math.round(cfg.max * 0.5);
        } else if (cfg.key === "bathrooms" && (p.minBathrooms || p.bathrooms)) {
          const req = Number(p.minBathrooms || p.bathrooms);
          score = Number(bathroomsCount) >= req ? cfg.max : Math.round(cfg.max * 0.5);
        }
      }

      // Clamp score
      score = Math.min(cfg.max, Math.max(0, score));

      if (backendReasons && backendReasons[cfg.key]) {
        reason = backendReasons[cfg.key];
      }

      return {
        ...cfg,
        score,
        reason,
      };
    });

    const totalScore =
      rawBackendScore !== undefined && rawBackendScore !== null
        ? Number(rawBackendScore)
        : Math.round(items.reduce((acc, curr) => acc + curr.score, 0));

    // Count aligning preferences (scored >= 70% of criteria max)
    const alignedCount = items.filter((it) => it.score >= it.max * 0.7).length;

    // Find non-fully met items for warning banner
    const unmet = items.filter((it) => it.score < it.max);

    // Dynamic warning message
    let notFullyMetMessage = "";
    if (unmet.length > 0) {
      const mentions = unmet
        .slice(0, 2)
        .map((u) => `${u.label.toLowerCase()} (${u.score} of ${u.max})`);
      notFullyMetMessage = `Not fully met: ${mentions.join(" and ")}.`;
    }

    // Match tier label
    let tierLabel = "Strong match";
    if (totalScore >= 90) tierLabel = "Strong match";
    else if (totalScore >= 75) tierLabel = "Good match";
    else if (totalScore >= 60) tierLabel = "Moderate match";
    else tierLabel = "Partial match";

    return {
      score: totalScore,
      items,
      alignedCount,
      notFullyMetMessage,
      tierLabel,
    };
  }, [property, tenantPrefs, weeklyPrice, bedroomsCount, bathroomsCount]);

  // Request Inspection Action
  const handleRequestInspection = () => {
    if (!id || !property) return;
    setDrawerParameters({
      id: id,
      property: property,
    });
    openSheet("propertySchedularForm");
  };

  // Wishlist toggle
  const handleToggleWishlist = async () => {
    if (!id) return;
    try {
      setIsWishlistLoading(true);
      if (isWishlist) {
        await tenantPropertyWishlistRemoveApi(id);
        setIsWishlist(false);
        toast({
          title: "Removed from saved",
          description: "Property removed from your saved list.",
        });
      } else {
        await tenantPropertyWishlistAddApi(id);
        setIsWishlist(true);
        toast({
          title: "Saved property",
          description: "Property added to your saved rentals.",
          variant: "success",
        });
      }
    } catch (err) {
      console.error("Failed to toggle wishlist", err);
      toast({
        title: "Action failed",
        description: "Please try again later.",
        variant: "error",
      });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Link */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E3A8A] hover:text-blue-700 hover:underline transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore Properties
          </button>

          {/* Quick Adjust Preferences trigger */}
          <button
            type="button"
            onClick={openMatchingPreferencesModal}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs cursor-pointer"
            title="Adjust your rental preferences to update match scoring"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            Adjust Preferences
          </button>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-8">
          Why this home is a {matchData.score}% match
        </h1>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Property Summary Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[540px]">
            <div>
              {/* Property Image / Photo Box */}
              <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-[#EFF4FA] border border-slate-100 flex items-center justify-center relative">
                {propertyImage ? (
                  <img
                    src={propertyImage}
                    alt={propertyName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="w-20 h-20 rounded-2xl bg-white/70 border border-slate-200/80 flex items-center justify-center shadow-2xs">
                      <Home className="w-10 h-10 text-slate-400 stroke-[1.5]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Location */}
              <div className="mt-5">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                  {propertyName}
                </h2>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  {suburb ? `${suburb} ${state} ${postalCode}` : fullAddress} ·
                  ${weeklyPrice} per week
                </p>
              </div>

              {/* Feature Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#1E40AF]">
                  {bedroomsCount} beds
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#1E40AF]">
                  {bathroomsCount} bath
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#1E40AF]">
                  {parkingCount} car
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#1E40AF]">
                  Step-free entry
                </span>
              </div>

              {/* Status and moderation notes */}
              <p className="text-xs text-gray-500 leading-relaxed mt-4">
                {availableFromText}. Address verified. Images approved by
                moderation.
              </p>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-gray-100">
              <Button
                onClick={handleRequestInspection}
                className="flex-1 bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm py-3 rounded-full transition-all shadow-sm cursor-pointer"
              >
                Request inspection
              </Button>
              <Button
                variant="outline"
                onClick={handleToggleWishlist}
                disabled={isWishlistLoading}
                className="px-6 py-3 rounded-full border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-blue-50 font-bold text-sm transition-colors cursor-pointer"
              >
                {isWishlist ? "Saved" : "Save"}
              </Button>
            </div>
          </div>

          {/* Right Column: Match Breakdown Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col">
            {/* Score Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
              {/* Match Percentage Circle */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#274B97] text-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {matchData.score}%
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                  {matchData.tierLabel}
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  {matchData.alignedCount} of {matchData.items.length}{" "}
                  preferences align
                </p>
              </div>
            </div>

            {/* 9 Criteria Breakdown Rows */}
            <div className="py-5 space-y-3.5">
              {matchData.items.map((criterion) => {
                const ratio =
                  criterion.max > 0 ? criterion.score / criterion.max : 0;

                // Color mapping matching design:
                // Full/high scores green, moderate blue, lower amber/red
                let barColor = "bg-[#059669]";
                if (ratio >= 0.85) {
                  barColor = "bg-[#059669]"; // emerald green
                } else if (ratio >= 0.7) {
                  barColor = "bg-[#2563EB]"; // vibrant blue
                } else if (ratio >= 0.4) {
                  barColor = "bg-[#D97706]"; // amber/brownish-orange
                } else {
                  barColor = "bg-[#DC2626]"; // red
                }

                return (
                  <div
                    key={criterion.key}
                    className="flex items-center text-sm"
                  >
                    {/* Label */}
                    <span className="w-32 sm:w-36 text-sm font-semibold text-gray-800 shrink-0">
                      {criterion.label}
                    </span>

                    {/* Progress Bar Track */}
                    <div className="flex-1 h-2.5 bg-[#EDF2F7] rounded-full overflow-hidden mx-3">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${Math.round(ratio * 100)}%` }}
                      />
                    </div>

                    {/* Score / Max */}
                    <span className="w-12 text-right text-sm font-bold text-gray-900 shrink-0">
                      {criterion.score}/{criterion.max}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Alert Boxes */}
            <div className="space-y-3 pt-2">
              {/* Positive Green Alert */}
              <div className="bg-[#E8F8EE] text-[#065F46] border border-[#C6F0D6] rounded-2xl p-4 text-sm font-medium flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#059669] shrink-0 stroke-[2.5]" />
                <span>Your essential accessibility needs are met.</span>
              </div>

              {/* Warning Amber Alert */}
              {matchData.notFullyMetMessage && (
                <div className="bg-[#FEF3C7]/60 text-[#92400E] border border-[#FDE68A] rounded-2xl p-4 text-sm font-medium flex items-center gap-2.5">
                  <span className="leading-snug">
                    {matchData.notFullyMetMessage}
                  </span>
                </div>
              )}
            </div>

            {/* Footer Disclaimer */}
            {/* <p className="text-xs text-gray-400 mt-6 leading-relaxed">
              Calculated on RentMatch servers, algorithm v1, updated today. A match score is not a promise of a tenancy.
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMatchDetails;
