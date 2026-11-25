import React, { useCallback, useEffect, useState } from "react";
import { IMAGES } from "../../assets";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Building2, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { getSavedProperty } from "../../../src/actions/property";
import Property from "../ChildComponent/Common/Property";
import { getPropertyWishlistTypeList } from "../../../src/actions/propertyMaster";
import { useSearchParams } from "react-router-dom";

const SaveProperty: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTypeId = searchParams.get("type");

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(9);
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(initialTypeId);

  // Fetch wishlist property types / categories
  const { data: propertyTypes, isLoading: typesLoading } = useQuery({
    queryKey: ["property-wishlit-Type"],
    queryFn: () => getPropertyWishlistTypeList({}),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Fetch saved properties for the current page and selected category
  const { data: savedProperties, isLoading: propertiesLoading } = useQuery({
    queryKey: ["savedProperties", currentPage, limit, selectedTypeId],
    queryFn: () =>
      getSavedProperty({
        page: currentPage,
        limit,
        propertyType: selectedTypeId || undefined,
      }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!propertyTypes,
  });

  const properties = savedProperties?.result || [];

  // Refetch saved properties immediately when matching preferences are updated
  useEffect(() => {
    const handlePreferencesUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ["savedProperties"] });
    };

    window.addEventListener("matching-preferences-updated", handlePreferencesUpdated);
    return () => {
      window.removeEventListener("matching-preferences-updated", handlePreferencesUpdated);
    };
  }, [queryClient]);

  // Default to first property type when data loads if none selected
  useEffect(() => {
    if (!typesLoading && propertyTypes?.result?.length > 0 && selectedTypeId === null) {
      const firstId = propertyTypes?.result[0]?.propertyType?._id || null;
      if (firstId) {
        setSelectedTypeId(firstId);
        setSearchParams({ type: firstId }, { replace: true });
      }
    }
  }, [typesLoading, propertyTypes, selectedTypeId, setSearchParams]);

  // Reset to page 1 whenever category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTypeId]);

  // Sync selected category to query param
  useEffect(() => {
    if (selectedTypeId) {
      setSearchParams({ type: selectedTypeId }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [selectedTypeId, setSearchParams]);

  const handleTypeSelect = useCallback((typeId: string) => {
    setSelectedTypeId((prev) => (prev === typeId ? null : typeId));
  }, []);

  // Pagination calculation
  const totalPages = Math.max(
    1,
    Number(
      savedProperties?.pagination?.totalPages ||
      savedProperties?.pagination?.total_pages ||
      Math.ceil((savedProperties?.pagination?.total_records || properties.length) / limit) ||
      1
    )
  );

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

  const typeList = propertyTypes?.result || [];

  return (
    <div className="w-full bg-white rounded-[24px] p-6 sm:p-8 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] font-sans my-2 min-h-[calc(100vh-140px)] flex flex-col justify-between">
      {/* Top Body Area: Category Sidebar + Separator + Property Grid */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch pb-6">
        {/* Left: Property Types Categories */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="flex flex-col gap-3">
            {typesLoading ? (
              <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-sm">Loading categories...</span>
              </div>
            ) : typeList.length === 0 ? (
              <div className="p-4 rounded-2xl border border-dashed border-gray-200 text-center text-sm text-gray-400">
                No categories found
              </div>
            ) : (
              typeList.map((item: any, idx: number) => {
                const typeId = item?.propertyType?._id;
                const isSelected = selectedTypeId === typeId;
                const typeName = item?.propertyType?.name || "Apartment";
                const count = item?.count ?? 0;
                const iconKey = item?.propertyType?.img?.toLowerCase();

                return (
                  <div
                    key={typeId || idx}
                    onClick={() => handleTypeSelect(typeId)}
                    className={`cursor-pointer rounded-2xl p-4 flex items-center gap-3.5 transition-all select-none ${
                      isSelected
                        ? "border-2 border-blue-500 bg-blue-50/20 shadow-xs ring-1 ring-blue-500/20"
                        : "border border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs"
                    }`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      <img
                        className="w-6 h-6 object-contain"
                        alt={`${typeName} icon`}
                        src={
                          IMAGES[iconKey as keyof typeof IMAGES] ||
                          IMAGES.apartment
                        }
                      />
                    </div>

                    <div className="flex flex-col text-left">
                      <span className="font-bold text-gray-900 text-sm md:text-base leading-tight">
                        {typeName}
                      </span>
                      <span className="text-xs text-gray-500 font-medium mt-1">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Separator between Home Type and Data */}
        <div className="hidden lg:block w-[1px] bg-slate-200/90 self-stretch shrink-0" />
        <div className="block lg:hidden w-full h-[1px] bg-slate-200/90 my-2 shrink-0" />

        {/* Right: Saved Properties Grid */}
        <div className="flex-1 min-w-0 w-full">
          {propertiesLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-sm font-medium">Loading saved properties...</span>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 text-slate-400">
                <Building2 className="w-8 h-8 text-slate-300" />
              </div>
              <h4 className="text-base font-semibold text-gray-800">
                No saved properties found
              </h4>
              <p className="text-xs text-gray-400 mt-1 max-w-sm">
                No saved properties found in this category. You can save properties from the Explore Properties page.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties.map((property: any) => {
                const inner = property?.property_details || property;
                const matchVal =
                  inner?.matching_percentage ??
                  property?.matching_percentage ??
                  inner?.matchPercentage ??
                  property?.matchPercentage ??
                  inner?.matchScore ??
                  property?.matchScore;

                const targetProp = {
                  ...inner,
                  matching_percentage: matchVal,
                  matchPercentage: matchVal,
                  matchScore: matchVal,
                  matchBreakdown: inner?.matchBreakdown ?? property?.matchBreakdown,
                  matchReasons: inner?.matchReasons ?? property?.matchReasons,
                  is_wishlist: true,
                };
                const propId =
                  inner?._id ||
                  property?.property_object_id ||
                  property?._id;

                return (
                  <div key={propId} className="w-full">
                    <Property
                      id={propId}
                      property={targetProp}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls - Always docked at the bottom of the page */}
      <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between w-full">
        <div className="w-32 flex justify-start">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={handlePreviousPage}
            className="rounded-full border-slate-200 hover:border-blue-600 hover:text-blue-600 font-semibold text-xs text-slate-700 px-4 py-1.5 h-9 transition-all flex items-center gap-1.5 shadow-2xs bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
        </div>

        <span className="text-xs sm:text-sm font-medium text-slate-600 bg-slate-100/90 border border-slate-200/60 px-4 py-1.5 rounded-full shadow-2xs">
          Page <span className="text-slate-900 font-bold">{currentPage}</span> of{" "}
          <span className="text-slate-900 font-bold">{totalPages}</span>
        </span>

        <div className="w-32 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={handleNextPage}
            className="rounded-full border-slate-200 hover:border-blue-600 hover:text-blue-600 font-semibold text-xs text-slate-700 px-4 py-1.5 h-9 transition-all flex items-center gap-1.5 shadow-2xs bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SaveProperty;
