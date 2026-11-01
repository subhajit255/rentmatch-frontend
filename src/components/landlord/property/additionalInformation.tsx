import React, { ChangeEvent } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import Icon from "../../icons/icon";

import { AdditionalInfoState } from "@/src/types/property";

/* ----------------------- PROPS ----------------------- */

type AdditionalInformationProps = {
  additionalInfo: AdditionalInfoState;
  setAdditionalInfo: React.Dispatch<
    React.SetStateAction<AdditionalInfoState>
  >;
};

/* ----------------------- COMPONENT ----------------------- */

const AdditionalInformation: React.FC<AdditionalInformationProps> = ({
  additionalInfo,
  setAdditionalInfo,
}) => {
  /* ----------------------- HANDLERS ----------------------- */

  const handlePetsChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value as AdditionalInfoState["pets"];
    setAdditionalInfo((prev) => ({ ...prev, pets: value }));
  };

  const handleDescriptionChange = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAdditionalInfo((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  // const setEnergyRating = (rating: number) => {
  //   setAdditionalInfo((prev) => ({
  //     ...prev,
  //     energy_rating: 5,
  //   }));
  // };

  /* ----------------------- UI ----------------------- */

  return (
    <div className="flex flex-col min-h-[50dvh] 2xl:min-h-[80dvh] justify-between gap-2">
      <div className="flex flex-col gap-7">
        {/* Pets */}
        <div className="flex flex-col gap-3">
          <Label className="text-sm font-semibold">
            Pets
          </Label>

          <div className="flex gap-10 items-center">
            {(
              [
                ["ALLOWED", "Allowed"],
                // ["NOT_ALLOWED", "Not Allowed"],
                ["CASE_BY_CASE", "Case-by-case"],
              ] as const
            ).map(([value, label]) => (
              <Label
                key={value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Input
                  type="radio"
                  name="pets"
                  value={value}
                  checked={additionalInfo.pets === value}
                  onChange={handlePetsChange}
                  className="h-4 w-auto"
                />
                <span className="font-semibold">
                  {label}
                </span>
              </Label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-3">
          <Label>Description</Label>
          <Textarea
            className="h-20"
            placeholder="Property additional description"
            value={additionalInfo.description}
            onChange={handleDescriptionChange}
          />
        </div>

        {/* Energy Rating */}
        {/* <div className="flex flex-col gap-3">
          <Label>Energy Rating</Label>

          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`Set energy rating to ${star}`}
                onClick={() => setEnergyRating(star)}
              >
                <Icon
                  name="Star"
                  className="w-6 h-6"
                  fill={
                    additionalInfo.energy_rating >= star
                      ? "gold"
                      : "#ccc"
                  }
                  color={
                    additionalInfo.energy_rating >= star
                      ? "gold"
                      : "#ccc"
                  }
                />
              </button>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AdditionalInformation;


// "use client";

// import React, { useState } from "react";
// import { Button } from "../../ui/button";
// import { Input } from "../../ui/input";
// import { Label } from "../../ui/label";
// import { Textarea } from "../../ui/textarea";
// import Icon from "../../icons/icon";
// import { useMutation } from "@tanstack/react-query";
// import { addPropertyApi } from "../../../actions/property";
// import { AdditionalInfoState } from "@/src/types/property";
// // import { AdditionalInfoState } from "./addProperty";

// type AdditionalFeaturesProps = {
//     additionalInfo: AdditionalInfoState;
//     setAdditionalInfo:(updater: (prev: AdditionalInfoState) => AdditionalInfoState) => void;
// }

// const AdditionalInformation: React.FC<AdditionalFeaturesProps> = ({ additionalInfo, setAdditionalInfo }) => {
//     // const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoState>(payload?.property_details?.additional_information ?? defaultAdditionalInformation);

//     // mutate
//     // const { mutate, isPending } = useMutation({
//     //     mutationFn: (p: any) => addPropertyApi(p),
//     //     onSuccess: (data) => {
//     //         const updatedPayload = {
//     //             ...payload,
//     //             property_details: {
//     //                 ...payload.property_details,
//     //                 additional_information: additionalInfo,
//     //             },
//     //             property_object_id: data?.data?._id,
//     //         };

//     //         setPayload?.(updatedPayload);
//     //         setTab?.("6"); // or your actual next tab
//     //     },
//     //     onError: (error) => {
//     //         console.error("Error saving:", error);
//     //     },
//     // });

//     const handlePetsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setAdditionalInfo((prev) => ({ ...prev, pets: e.target.value as any }));
//     };

//     const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//         setAdditionalInfo((prev) => ({ ...prev, description: e.target.value }));
//     };

//     // const handleSubmit = () => {
//     //     const finalPayload = {
//     //         ...payload,
//     //         property_details: {
//     //             ...payload.property_details,
//     //             additional_information: additionalInfo,
//     //         },
//     //     };

//     //     mutate(finalPayload);
//     // };

//     return (
//         <div className="flex flex-col min-h-[50dvh] 2xl:min-h-[80dvh] justify-between gap-2">
//             <div className="flex flex-col gap-7">

//                 {/* Pets */}
//                 <div className="flex flex-col gap-3">
//                     <Label className="text-sm font-semibold">Pets</Label>

//                     <div className="flex gap-10 items-center">

//                         <Label className="flex items-center gap-2 cursor-pointer">
//                             <Input
//                                 type="radio"
//                                 name="pets"
//                                 value="allowed"
//                                 checked={additionalInfo.pets === "allowed"}
//                                 onChange={handlePetsChange}
//                                 className="h-4 w-auto"
//                             />
//                             <span className="font-semibold">Allowed</span>
//                         </Label>

//                         <Label className="flex items-center gap-2 cursor-pointer">
//                             <Input
//                                 type="radio"
//                                 name="pets"
//                                 value="not_allowed"
//                                 checked={additionalInfo.pets === "not_allowed"}
//                                 onChange={handlePetsChange}
//                                 className="h-4 w-auto"
//                             />
//                             <span className="font-semibold">Not Allowed</span>
//                         </Label>

//                         <Label className="flex items-center gap-2 cursor-pointer">
//                             <Input
//                                 type="radio"
//                                 name="pets"
//                                 value="case_by_case"
//                                 checked={additionalInfo.pets === "case_by_case"}
//                                 onChange={handlePetsChange}
//                                 className="h-4 w-auto"
//                             />
//                             <span className="font-semibold whitespace-nowrap">Case-by-case</span>
//                         </Label>
//                     </div>
//                 </div>

//                 {/* Description */}
//                 <div className="flex flex-col gap-3">
//                     <Label>Description</Label>
//                     <Textarea
//                         className="h-20"
//                         placeholder="Property additional description"
//                         value={additionalInfo.description}
//                         onChange={handleDescriptionChange}
//                     />
//                 </div>

//                 {/* Energy Rating */}
//                 <div className="flex flex-col gap-3">
//                     <Label>Energy Rating</Label>

//                     <div className="flex gap-3">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                             <div key={star}
//                                 onClick={() =>
//                                     setAdditionalInfo((prev) => ({ ...prev, energy_rating: star }))
//                                 }>
//                                 <Icon
//                                     name="Star"
//                                     className="w-6 h-6 cursor-pointer"
//                                     fill={additionalInfo.energy_rating >= star ? "gold" : "#ccc"}
//                                     color={additionalInfo.energy_rating >= star ? "gold" : "#ccc"}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Submit */}
//             {/* <div className="mb-1 flex items-center justify-end">
//                 <Button
//                     className="text-white cursor-pointer"
//                     variant="secondary" 
//                     disabled={isPending}
//                     onClick={handleSubmit}
//                 >
//                     {isPending ? "Saving..." : "Continue"}
//                 </Button>
//             </div> */}
//         </div>
//     );
// };

// export default AdditionalInformation;

// import React, { useState } from "react";
// import { Button } from "../../ui/button";
// import { Input } from "../../ui/input";
// import { Label } from "../../ui/label";
// import { Textarea } from "../../ui/textarea";
// import Icon from "../../icons/icon";

//  const defaultAdditionalInformation = { //additional_information
//             "pets": "ALLOWED",
//             "description": "",
//             "energy_rating": "" //optional, from 1 to 5
//         }

// const AdditionalInformation = ({ payload, setPayload, setTab }  : any) => {
//     const [additionalInfo, setAdditionalInfo] = useState(defaultAdditionalInformation);

//     const handleChange = () => { }

//     return <div>
//         <div className="flex flex-col min-h-[50dvh] 2xl:min-h-[80dvh] justify-between gap-2">
//             <div className="flex flex-col gap-7">
//                 <div className="flex flex-col gap-3">
//                     <Label
//                         htmlFor="role"
//                         className="text-sm font-semibold text-foreground"
//                     >
//                         Pets
//                     </Label>
//                     <div className="flex gap-10 items-center">
//                         <Label className="flex items-center gap-2 cursor-pointer">
//                             <Input id="type" type="radio" className="h-4 w-auto" name="pets" value="TENANT" onChange={handleChange} />
//                             <span className="font-semibold text-primary-foreground">ALLOWED</span>
//                         </Label>
//                         <Label className="flex items-center gap-2 cursor-pointer">
//                             <Input id="type" type="radio" className="h-4 w-auto" name="pets" value="LANDLORD" onChange={handleChange} />
//                             <span className="font-semibold text-primary-foreground">Not ALLOWED</span>
//                         </Label>
//                         <Label className="flex items-center gap-2 cursor-pointer">
//                             <Input id="type" type="radio" className="h-4 w-auto" name="pets" value="PROPERTY MANAGER" onChange={handleChange} />
//                             <span className="whitespace-nowrap text-ellipsis font-semibold text-primary-foreground">Case-by-case</span>
//                         </Label>
//                     </div>
//                 </div>
//                     <div className="flex flex-col gap-3">
//                         <Label>Description</Label>
//                         <Textarea className="h-20" placeholder="Property addtional description " />
//                     </div>
//                     <div className="flex flex-col gap-3">
//                         <Label>Energy Rating</Label>
//                         <div className="flex gap-3">
//                             <Icon name="Star" className="w-6 h-6" fill="var(--ratting)" color="var(--ratting)" />
//                             <Icon name="Star" className="w-6 h-6" fill="var(--ratting)" color="var(--ratting)" />
//                             <Icon name="Star" className="w-6 h-6" fill="var(--ratting)" color="var(--ratting)" />
//                             <Icon name="Star" className="w-6 h-6" fill="var(--ratting)" color="var(--ratting)" />
//                             <Icon name="Star" className="w-6 h-6" fill="var(--accent-foreground)" color="var(--accent-foreground)" />
//                         </div>
//                     </div>
//             </div>
//             <div className="mb-1 flex items-center justify-end">
//                 <Button className="text-white cursor-pointer">Continue</Button>
//             </div>
//         </div>
//     </div>
// }

// export default AdditionalInformation;
