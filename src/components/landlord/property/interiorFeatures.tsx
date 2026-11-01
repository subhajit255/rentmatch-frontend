import React from "react";
import { Label } from "../../ui/label";
import { Required } from "../../ui/miscellenious";
import { Checkbox } from "../../ui/checkbox";

import { InteriorState } from "@/src/types/property";

/* ----------------------- CONSTANTS ----------------------- */

// const INTERIOR_OPTIONS: Record<keyof InteriorState, string[]> = {
//   heating_and_cooling: ["Air conditioning", "Fans", "Ducted Heating"],
//   kitchen_appliances: ["Dishwasher", "Oven", "Stove", "Pantry"],
//   laundry_features: ["In-unit", "Shared", "Dryer", "Washer"],
// };

const INTERIOR_OPTIONS: Record<keyof InteriorState, string[]> = {
  "living_spaces": [
    "Open Plan Living",
    "Separate Living Room",
    "Separate Dining Room",
    "Tiled Living Areas",
    "Carpeted Living Areas",
    "Timber / Floorboards",
    "High Ceilings",
    "Natural Light / Bright Interior"
  ],
  "climate_and_comfort": [
    "Air Conditioning (Split System)",
    "Ducted Air Conditioning",
    "Heating",
    "Ceiling Fans",
    "Double Glazed Windows",
    "Insulated Walls / Ceiling"
  ],
  "kitchen_features": [
    "Modern Kitchen",
    "Stone Benchtops",
    "Gas Cooktop",
    "Electric Cooktop",
    "Oven",
    "Dishwasher",
    "Island Bench",
    "Walk-in Pantry",
    "Soft-Close Cabinets"
  ],
  "bedroom_features": [
    "Built-in Wardrobes",
    "Walk-in Wardrobe",
    "Ensuite Bathroom",
    "Blackout Blinds / Curtains",
    "Carpeted Bedrooms",
    "Air Conditioning in Bedroom",
    "Ceiling Fan in Bedroom"
  ],
  "bathroom_features": [
    "Bathtub",
    "Shower (Separate)",
    "Combined Bath & Shower",
    "Ensuite",
    "Double Vanity",
    "Modern Bathroom",
    "Good Water Pressure"
  ],
  "laundry": [
    "Internal Laundry",
    "Laundry Room",
    "Laundry in Garage",
    "Dryer Included",
    "Washing Machine Included",
    "Laundry Storage"
  ],
  "storage": [
    "Linen Closet",
    "Built-in Storage",
    "Under-Stair Storage",
    "Storage Room"
  ],
  "security_and_access": [
    "Security Screens",
    "Keyless Entry",
    "Smart Lock",
    "Video Intercom"
  ],
  "finishes_and_extras": [
    "Freshly Painted",
    "Recently Renovated",
    "New Carpet",
    "Timber Flooring",
    "Blinds Installed",
    "Curtains Installed",
    "LED Lighting"
  ],
  "tech_and_connectivity": [
    "NBN Connected",
    "Fibre to the Premises (FTTP)",
    "Good Mobile Reception",
    "Smart Home Features"
  ]

}

/* ----------------------- PROPS ----------------------- */

type InteriorFeaturesProps = {
  interiorPayload: InteriorState;
  setInteriorPayload: React.Dispatch<
    React.SetStateAction<InteriorState>
  >;
  MasterValues: any
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

/* ----------------------- HELPERS ----------------------- */

const readableLabel = (key: keyof InteriorState) =>
  key
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

/* ----------------------- COMPONENT ----------------------- */

const InteriorFeatures: React.FC<InteriorFeaturesProps> = ({
  interiorPayload,
  setInteriorPayload,
  MasterValues,
  errors,
  setErrors
}) => {

  console.log(interiorPayload, "<---interior payload")
  const toggleInteriorItem = (
    category: keyof InteriorState,
    value: string,
    checked: boolean
  ) => {

    setInteriorPayload((prev) => {
      const newArray = checked
        ? [...prev[category], value]
        : prev[category].filter((v) => v !== value);

      // Clear error if at least one item is now selected
      if (newArray.length > 0 && errors[category]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [category]: "",
        }));
      }

      return {
        ...prev,
        [category]: newArray,
      };
    });
  };

  return (
    <div className="flex flex-col min-h-[50dvh] 2xl:min-h-[80dvh] justify-between gap-2">
      <div className="flex flex-col gap-9">
        {(Object.keys(INTERIOR_OPTIONS) as Array<
          keyof InteriorState
        >).map((category) => (
          <div key={category} className="flex flex-col gap-3">
            <Label>
              {readableLabel(category)} <Required />
              {
                errors[category] && (
                  <p className="text-sm text-red-500">{errors[category]}</p>
                )
              }
            </Label>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-2">
              {INTERIOR_OPTIONS[category].map((item) => {
                const id = `${category}-${item}`;

                return (
                  <div key={id} className="flex items-center gap-2">
                    <Checkbox
                      id={id}
                      checked={interiorPayload[category].includes(item) ?? false}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        toggleInteriorItem(
                          category,
                          item,
                          e.target.checked
                        )
                      }
                    />
                    <Label htmlFor={id} className="text-sm">
                      {item}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteriorFeatures;


// import React, { useState } from "react";
// import { Label } from "../../ui/label";
// import { Required } from "../../ui/miscellenious";
// import { Checkbox } from "../../ui/checkbox";
// import { Button } from "../../ui/button";
// import { addPropertyApi } from "../../../actions/property";
// import { useMutation } from "@tanstack/react-query";
// import { InteriorState } from "@/src/types/property";
// // import { InteriorState } from "./addProperty";



// const INTERIOR_OPTIONS: Record<keyof InteriorState, string[]> = {
//   heating_and_cooling: ["Air conditioning", "Fans", "Ducted Heating"],
//   kitchen_appliances: ["Dishwasher", "Oven", "Stove", "Pantry"],
//   laundry_features: ["In-unit", "Shared", "Dryer", "Washer"],
// };

// // Component prop types (narrow from `any`)
// interface InteriorFeaturesProps {
//   interiorPayload: InteriorState;
//   setInteriorPayload:(updater: (prev: InteriorState) => InteriorState) => void;
// }

// const InteriorFeatures: React.FC<InteriorFeaturesProps> = ({ interiorPayload, setInteriorPayload }) => {
//   // const [interiorPayload, setInteriorPayload] = useState<InteriorState>(payload?.property_details?.interior ?? defaultInterior);

//   // const { mutate: createProperty, isPending } = useMutation({
//   //   mutationFn: (p: any) => addPropertyApi(p),
//   //   onSuccess: (data) => {
//   //     const new_payload = { ...payload };
//   //     new_payload.property_details = {
//   //       ...new_payload.property_details,
//   //       interior: data?.data?.property_details?.interior,
//   //     };
//   //     new_payload.property_object_id = data?.data?._id;
//   //     // propagate back to parent
//   //     setPayload(new_payload);
//   //   },
//   //   onError: (error) => {
//   //     // handle error (toast/log)
//   //     console.error("create property error:", error);
//   //   },
//   // });

//   // const handleSubmit = () => {
//   //   const current_payload = {
//   //     ...payload,
//   //     property_details: {
//   //       ...payload?.property_details,
//   //       interior: interiorPayload,
//   //     },
//   //   };

//   //   createProperty(current_payload);
//   // };

//   const toggleInteriorItem = (category: keyof InteriorState, value: string, checked: boolean) => {
//     setInteriorPayload((prev) => ({
//       ...prev,
//       [category]: checked ? [...prev[category], value] : prev[category].filter((v) => v !== value),
//     }));
//   };

//   // helper to display readable category label
//   const readableLabel = (key: keyof InteriorState) => {
//     return String(key).split("_").join(" ").replace(/\b\w/g, (c) => c.toUpperCase());
//   };

//   return (
//     <div className="flex flex-col min-h-[50dvh] 2xl:min-h-[80dvh] justify-between gap-2">
//       <div className="flex flex-col gap-9">
//         {(Object.keys(INTERIOR_OPTIONS) as Array<keyof InteriorState>).map((category) => (
//           <div key={category} className="flex flex-col gap-3">
//             <Label>
//               {readableLabel(category)} <Required />
//             </Label>

//             <div className="grid grid-cols-5 items-center">
//               {INTERIOR_OPTIONS[category].map((item, indx) => (
//                 <div key={item} className="flex items-center gap-2">
//                   <Checkbox
//                     id={`${category}-${indx}`}
//                     checked={interiorPayload[category].includes(item)}
//                     onChange={(e) => toggleInteriorItem(category, item, e.target.checked)}
//                     className="w-4 h-4"
//                   />
//                   <Label htmlFor={`${category}-${indx}`} className="text-sm">{item}</Label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mb-1 flex items-center justify-end">
//         {/* <Button variant="secondary"  onClick={handleSubmit} className="text-white cursor-pointer" disabled={isPending}>
//           {isPending ? "Submitting..." : "Continue"}
//         </Button> */}
//       </div>
//     </div>
//   );
// };

// export default InteriorFeatures;
