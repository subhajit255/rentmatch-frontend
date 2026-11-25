import React, { useState, useEffect, useMemo, useRef } from "react";
import { X, Plus, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useAuth } from "../../context/AuthContext";
import {
  MatchingPreferencesPayload,
  defaultMatchingPreferences,
} from "../../types/matching";
import {
  getTenantPreferencesApi,
  saveTenantPreferencesApi,
} from "../../actions/tenantPreferences";
import { getMasterDataProperty } from "../../actions/property";
import { toast } from "../../custom-hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface MatchingPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const PROPERTY_TYPES = ["Apartment", "House", "Townhouse", "Villa", "Studio"];

const ESSENTIAL_ACCESSIBILITY = [
  "Step-free property access",
  "Ground floor or lift access",
  "Wide doorways & hallways",
];

const PREFERRED_ACCESSIBILITY = [
  "Accessible bathroom / roll-in shower",
  "Dedicated accessible parking spot",
  "Safety grab rails",
];

const MatchingPreferencesModal: React.FC<MatchingPreferencesModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<MatchingPreferencesPayload>(
    defaultMatchingPreferences
  );
  const [suburbSearch, setSuburbSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load backend master data from /property/master
  const { data: masterData } = useQuery({
    queryKey: ["masterPropertyData"],
    queryFn: getMasterDataProperty,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Extract suburbs strictly from backend master property data (suburb_types)
  const masterSuburbs = useMemo(() => {
    const rawSuburbList =
      masterData?.result?.suburb_types?.[0]?.data ??
      (masterData?.result?.suburb_types ?? []).find(
        (cat: any) => cat?.type === "suburb_types"
      )?.data ??
      [];

    if (Array.isArray(rawSuburbList) && rawSuburbList.length > 0) {
      return rawSuburbList
        .filter((item: any) => item.is_active !== false)
        .map((item: any) => item.name || item.slug)
        .filter(Boolean);
    }

    // Fallback based on backend master seed data
    return [
      "Central",
      "Downtown",
      "Riverside",
      "Lakeside",
      "West End",
      "East End",
      "North Valley",
      "South Park",
      "Greenfield",
      "Hilltop",
      "Meadowville",
      "Oakwood",
      "Maple Grove",
      "Brookside",
      "Sunnyvale",
      "Highland",
      "Midtown",
      "Springdale",
      "Rosewood",
      "Fairview",
    ];
  }, [masterData]);

  // Filter backend suburbs by search query
  const filteredSuburbs = useMemo(() => {
    const query = suburbSearch.trim().toLowerCase();
    return masterSuburbs
      .filter((s) => !formData.suburbs.some((existing) => existing.toLowerCase() === s.toLowerCase()))
      .filter((s) => !query || s.toLowerCase().includes(query));
  }, [masterSuburbs, suburbSearch, formData.suburbs]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load existing preferences on open
  useEffect(() => {
    if (isOpen) {
      getTenantPreferencesApi(user?.id || user?._id).then(({ data }) => {
        if (data) {
          setFormData({ ...defaultMatchingPreferences, ...data });
        }
      });
    }
  }, [isOpen, user?.id, user?._id]);

  if (!isOpen) return null;

  const handleSelectSuburb = (suburb: string) => {
    if (!formData.suburbs.some((s) => s.toLowerCase() === suburb.toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        suburbs: [...prev.suburbs, suburb],
      }));
    }
    setSuburbSearch("");
    setDropdownOpen(false);
  };

  const handleRemoveSuburb = (suburb: string) => {
    setFormData((prev) => ({
      ...prev,
      suburbs: prev.suburbs.filter((s) => s.toLowerCase() !== suburb.toLowerCase()),
    }));
  };

  const togglePropertyType = (type: string) => {
    setFormData((prev) => {
      const exists = prev.propertyTypes.some(
        (t) => t.toLowerCase() === type.toLowerCase()
      );
      const updated = exists
        ? prev.propertyTypes.filter(
            (t) => t.toLowerCase() !== type.toLowerCase()
          )
        : [...prev.propertyTypes, type];
      return {
        ...prev,
        propertyTypes: updated.length > 0 ? updated : [type],
      };
    });
  };

  const toggleEssentialAccessibility = (feature: string) => {
    setFormData((prev) => {
      const exists = prev.essentialAccessibility.includes(feature);
      return {
        ...prev,
        essentialAccessibility: exists
          ? prev.essentialAccessibility.filter((f) => f !== feature)
          : [...prev.essentialAccessibility, feature],
      };
    });
  };

  const togglePreferredAccessibility = (feature: string) => {
    setFormData((prev) => {
      const exists = prev.preferredAccessibility.includes(feature);
      return {
        ...prev,
        preferredAccessibility: exists
          ? prev.preferredAccessibility.filter((f) => f !== feature)
          : [...prev.preferredAccessibility, feature],
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveTenantPreferencesApi(formData, user?.id || user?._id);
      
      // Invalidate all property and dashboard queries so backend match percentages update immediately
      queryClient.invalidateQueries({ queryKey: ["tenantProperties"] });
      queryClient.invalidateQueries({ queryKey: ["exploreProperties"] });
      queryClient.invalidateQueries({ queryKey: ["savedProperties"] });
      queryClient.invalidateQueries({ queryKey: ["property"] });
      queryClient.invalidateQueries({ queryKey: ["allProperty"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      queryClient.invalidateQueries({ queryKey: ["tenantProperty"] });
      queryClient.invalidateQueries({ queryKey: ["propertyDetails"] });
      queryClient.invalidateQueries({ queryKey: ["property-match"] });

      window.dispatchEvent(new CustomEvent("matching-preferences-updated"));

      toast({
        title: "Preferences Saved",
        description: "Your property matching criteria have been saved.",
        variant: "success",
      });

      onSaved?.();
      onClose();
    } catch (err) {
      console.error("Save preferences failed", err);
      toast({
        title: "Failed to save",
        description: "Please check your details and try again.",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col max-h-[88vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Rental Preferences
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Tell us what you're looking for to calculate your property match percentage.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-6 thin-scrollbar text-sm"
        >
          {/* 1. Suburb Dropdown (From backend property/master suburb_types) */}
          <div className="space-y-2 relative" ref={dropdownRef}>
            <Label className="font-semibold text-gray-800 text-xs">
              Preferred Suburb(s)
            </Label>

            <div className="relative">
              <Input
                placeholder="Select suburb..."
                value={suburbSearch}
                onFocus={() => setDropdownOpen(true)}
                onChange={(e) => {
                  setSuburbSearch(e.target.value);
                  setDropdownOpen(true);
                }}
                className="h-9 text-xs pr-8"
              />
              <ChevronDown
                className={`w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 transition-transform cursor-pointer ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                onClick={() => setDropdownOpen((prev) => !prev)}
              />

              {/* Suburb Dropdown List from backend property/master api */}
              {dropdownOpen && (
                <div className="absolute z-20 left-0 right-0 top-[calc(100%+4px)] max-h-52 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1 thin-scrollbar">
                  {filteredSuburbs.length > 0 ? (
                    filteredSuburbs.map((suburb) => (
                      <button
                        key={suburb}
                        type="button"
                        onClick={() => handleSelectSuburb(suburb)}
                        className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>{suburb}</span>
                        <Plus className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-gray-400 text-center">
                      No suburbs found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Suburbs Chips */}
            {formData.suburbs.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {formData.suburbs.map((suburb) => (
                  <span
                    key={suburb}
                    className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 rounded-md px-2.5 py-1 text-xs font-medium"
                  >
                    {suburb}
                    <button
                      type="button"
                      onClick={() => handleRemoveSuburb(suburb)}
                      className="text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="pt-2 flex items-center gap-2 text-xs">
              <span className="text-gray-600">Distance radius:</span>
              <div className="flex gap-1.5">
                {[
                  { id: "exact", label: "Exact Suburb" },
                  { id: "5km", label: "5 km" },
                  { id: "10km", label: "10 km" },
                  { id: "25km", label: "25 km" },
                ].map((rad) => (
                  <button
                    key={rad.id}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, searchRadius: rad.id as any }))
                    }
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      formData.searchRadius === rad.id
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {rad.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 2. Budget */}
          <div className="space-y-2">
            <Label className="font-semibold text-gray-800 text-xs">
              Weekly Rent Budget ($ / week)
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-gray-500 block mb-1">Minimum</span>
                <Input
                  type="number"
                  placeholder="$ 0"
                  value={formData.minBudget}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      minBudget:
                        e.target.value === "" ? "" : Number(e.target.value),
                    }))
                  }
                  className="h-9 text-xs"
                />
              </div>
              <div>
                <span className="text-[11px] text-gray-500 block mb-1">Maximum</span>
                <Input
                  type="number"
                  placeholder="$ 800"
                  value={formData.maxBudget}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      maxBudget:
                        e.target.value === "" ? "" : Number(e.target.value),
                    }))
                  }
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 3. Property Type */}
          <div className="space-y-2">
            <Label className="font-semibold text-gray-800 text-xs">
              Property Types
            </Label>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((type) => {
                const active = formData.propertyTypes.some(
                  (t) => t.toLowerCase() === type.toLowerCase()
                );
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => togglePropertyType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      active
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 4. Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-semibold text-gray-800 text-xs">
                Min Bedrooms
              </Label>
              <div className="flex gap-1.5">
                {[
                  { value: 0, label: "Studio" },
                  { value: 1, label: "1+" },
                  { value: 2, label: "2+" },
                  { value: 3, label: "3+" },
                  { value: 4, label: "4+" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, minBedrooms: opt.value }))
                    }
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      formData.minBedrooms === opt.value
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-gray-800 text-xs">
                Min Bathrooms
              </Label>
              <div className="flex gap-1.5">
                {[
                  { value: 1, label: "1+" },
                  { value: 2, label: "2+" },
                  { value: 3, label: "3+" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, minBathrooms: opt.value }))
                    }
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      formData.minBathrooms === opt.value
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 5. Move-in Timing */}
          <div className="space-y-2">
            <Label className="font-semibold text-gray-800 text-xs">
              Preferred Move-in Date
            </Label>
            <Input
              type="date"
              value={formData.earliestMoveInDate}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  earliestMoveInDate: e.target.value,
                }))
              }
              className="h-9 text-xs max-w-xs"
            />
          </div>

          <hr className="border-gray-100" />

          {/* 6. Pets & Parking */}
          <div className="grid grid-cols-2 gap-4">
            {/* Pets */}
            <div className="space-y-2">
              <Label className="font-semibold text-gray-800 text-xs">Pets</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, hasPets: false, petDetails: "" }))
                  }
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                    !formData.hasPets
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  No Pets
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, hasPets: true }))}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                    formData.hasPets
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  I have Pets
                </button>
              </div>

              {formData.hasPets && (
                <Input
                  placeholder="e.g. 1 small dog"
                  value={formData.petDetails}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, petDetails: e.target.value }))
                  }
                  className="h-8 text-xs mt-1"
                />
              )}
            </div>

            {/* Parking */}
            <div className="space-y-2">
              <Label className="font-semibold text-gray-800 text-xs">
                Parking
              </Label>
              <div className="flex gap-1.5">
                {[
                  { id: "essential", label: "Must have" },
                  { id: "preferred", label: "Preferred" },
                  { id: "not_needed", label: "None" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        parkingRequirement: opt.id as any,
                      }))
                    }
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      formData.parkingRequirement === opt.id
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 7. Accessibility */}
          <div className="space-y-2.5">
            <Label className="font-semibold text-gray-800 text-xs">
              Accessibility
            </Label>
            <p className="text-[11px] text-gray-500">
              Select any accessibility features essential or preferred for your household:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {ESSENTIAL_ACCESSIBILITY.map((item) => {
                const isChecked = formData.essentialAccessibility.includes(item);
                return (
                  <label
                    key={item}
                    className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none"
                  >
                    <Checkbox
                      checked={isChecked}
                      onChange={() => toggleEssentialAccessibility(item)}
                    />
                    <span>{item}</span>
                  </label>
                );
              })}

              {PREFERRED_ACCESSIBILITY.map((item) => {
                const isChecked = formData.preferredAccessibility.includes(item);
                return (
                  <label
                    key={item}
                    className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none"
                  >
                    <Checkbox
                      checked={isChecked}
                      onChange={() => togglePreferredAccessibility(item)}
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 bg-gray-50/50">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
          >
            Skip for now
          </Button>

          <Button
            type="submit"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/95 text-white font-medium text-xs px-5 py-2 rounded-lg cursor-pointer"
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchingPreferencesModal;
