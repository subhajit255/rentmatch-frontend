import React from "react";
import { getMasterDataProperty } from "../../../actions/property";
import { useQuery } from "@tanstack/react-query";
import { Label } from "../../ui/label";
import { Required } from "../../ui/miscellenious";
import { Checkbox } from "../../ui/checkbox";
import { PropertyAminitiesState } from "@/src/types/property";

type AminitiesFeaturesProps = {
  aminityDataState: PropertyAminitiesState;
  SetAminityDataState: React.Dispatch<
    React.SetStateAction<PropertyAminitiesState>
  >;
};

const DynamicAminities: React.FC<AminitiesFeaturesProps> = ({
  aminityDataState,
  SetAminityDataState,
}) => {
  /* ----- LOAD MASTER DATA ----------*/
  const {
    data: masterData,
    isLoading: isMasterLoading,
    isError: isMasterError,
    error: masterError,
  } = useQuery({
    queryKey: ["masterPropertyData"],
    queryFn: getMasterDataProperty,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  if (isMasterLoading) {
    return <div>Loading amenities...</div>;
  }

  if (isMasterError) {
    return (
      <div className="text-red-600">
        Failed to load amenities: {masterError?.message || "Unknown error"}
      </div>
    );
  }
  const amenitiesCategories = masterData?.result?.amenities ?? [];

  const amenitiesCategory = amenitiesCategories.find(
    (cat: any) => cat?.type === "amenities",
  );
  const activeAmenities =
    (masterData?.result?.amenities ?? [])
      .find((cat: any) => cat?.type === "amenities")
      ?.data?.filter((item: any) => item.is_active !== false) ?? [];

  // ── Updated toggle function ──
  const toggleAmenity = (slug: string, checked: boolean) => {
    SetAminityDataState((prev: string[]) => {
      return checked ? [...prev, slug] : prev.filter((v) => v !== slug);
    });
  };

  return (
    <div className="flex flex-col min-h-[50dvh] 2xl:min-h-[80dvh] justify-between gap-2">
      <div className="flex flex-col gap-9">
        <div className="flex flex-col gap-3">
          {/* <Label>
            Amenities Features <Required />
          </Label> */}

          {activeAmenities.length === 0 ? (
            <div className="text-gray-500 text-sm">No amenities available</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {activeAmenities.map((item: any) => {
                const id = `amenity-${item.slug}`;
                const checked = aminityDataState?.includes(item.slug) ?? false;

                return (
                  <div key={id} className="flex items-center gap-2">
                    <Checkbox
                      id={id}
                      checked={checked}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        toggleAmenity(item.slug, e.target.checked)
                      }
                    />
                    <Label htmlFor={id} className="text-sm cursor-pointer">
                      {item.name}
                    </Label>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicAminities;
