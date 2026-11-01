import React from "react";
import { Label } from "../../ui/label";
import { Required } from "../../ui/miscellenious";
import { Checkbox } from "../../ui/checkbox";

import { OutdoorState } from "@/src/types/property";

/* ----------------------- CONSTANTS ----------------------- */

const OUTDOOR_ENTERTAINING_OPTIONS = ["Shed", "Storage"];

const OUTDOOR_FEATURES = [
  "balcony",
  "deck",
  "courtyard",
  "garden",
  "yard",
];

/* ----------------------- PROPS ----------------------- */

type OutdoorFeaturesProps = {
  outdoorPayload: OutdoorState;
  setOutdoorPayload: React.Dispatch<
    React.SetStateAction<OutdoorState>
  >;
  outdoorMaster: any
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

/* ----------------------- COMPONENT ----------------------- */

const OutdoorFeatures: React.FC<OutdoorFeaturesProps> = ({
  outdoorPayload,
  setOutdoorPayload,
  outdoorMaster,
  errors,
  setErrors
}) => {

  const toggleOutdoorFeature = (value: string, checked: boolean) => {
    setOutdoorPayload((prev) => {
      const newFeatures = checked
        ? [...(prev.features ?? []), value]
        : (prev.features ?? []).filter((v) => v !== value);

      // Clear error when at least one is selected
      if (newFeatures.length > 0) {
        setErrors((prevErrors) => ({ ...prevErrors, features: "" }));
      }

      return {
        ...prev,
        features: newFeatures,
      };
    });
  };

  const toggleOutdoorEntertaining = (value: string, checked: boolean) => {
    setOutdoorPayload((prev) => {
      const newEntertaining = checked
        ? [...(prev.outdoor_entering_area ?? []), value]
        : (prev.outdoor_entering_area ?? []).filter((v) => v !== value);

      if (newEntertaining.length > 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          outdoor_entering_area: "",
        }));
      }

      return {
        ...prev,
        outdoor_entering_area: newEntertaining,
      };
    });
  };

  // Filter active items
  const activeOF = (outdoorMaster?.outdoor_features ?? [])
    .find((cat: any) => cat?.type === "outdoor_features")
    ?.data?.filter((item: any) => item.is_active !== false) ?? [];

  const activeODE = (outdoorMaster?.outdoor_entertaining_areas ?? [])
    .find((cat: any) => cat?.type === "outdoor_entertaining_areas")
    ?.data?.filter((item: any) => item.is_active !== false) ?? [];

  return (
    <div className="flex flex-col min-h-[50dvh] 2xl:min-h-[80dvh] justify-between gap-2">
      <div className="flex flex-col gap-9">
        {/* Outdoor Features */}
        <div className="flex flex-col gap-3">
          <Label>
            Outdoor Features <Required />
            {
              errors?.features && (
                <p className="text-sm text-red-500">{errors?.features}</p>
              )
            }
          </Label>


          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
             {activeOF.map((item: any) => {
              const value = item.slug || item.name; // ← prefer slug if available
              const checked = outdoorPayload.features?.includes(value) ?? false;

              return (
                <div key={value} className="flex items-center gap-2">
                  <Checkbox
                    id={`outdoor-feature-${value}`}
                    checked={checked}
                    onChangeCapture={(event: any) =>
                      toggleOutdoorFeature(value, event.target.checked)
                    }
                  />
                  <Label htmlFor={`outdoor-feature-${value}`} className="text-sm">
                    {item.name}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Outdoor Entertaining Area */}
        <div className="flex flex-col gap-3">
          <Label>
            Outdoor Entertaining Area <Required />
            {errors?.outdoor_entering_area && (
              <p className="text-sm text-red-500">
                {errors.outdoor_entering_area}
              </p>
            )}
          </Label>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {activeODE.map((item: any) => {
              const value = item.slug || item.name;
              const checked = outdoorPayload.outdoor_entering_area?.includes(value) ?? false;

              return (
                <div key={value} className="flex items-center gap-2">
                  <Checkbox
                    id={`outdoor-entertain-${value}`}
                    checked={checked}
                    onChangeCapture={(event:any) =>
                      toggleOutdoorEntertaining(value, event.target.checked)
                    }
                  />
                  <Label htmlFor={`outdoor-entertain-${value}`} className="text-sm">
                    {item.name}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutdoorFeatures;

