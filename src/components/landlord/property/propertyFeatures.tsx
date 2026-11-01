import React, { ChangeEvent } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Required } from "../../ui/miscellenious";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import { defaultFeaturesType } from "@/src/types/property";

/* ----------------------- PROPS ----------------------- */

type PropertyFeaturesProps = {
  propertyFeatures: defaultFeaturesType;
  setPropertyFeatures: any;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

/* ----------------------- COMPONENT ----------------------- */

const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({
  propertyFeatures,
  setPropertyFeatures,
  errors,
  setErrors
}) => {

  /* ----------------------- HANDLERS ----------------------- */

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPropertyFeatures((prev: any) => ({ ...prev, [name]: value }));
  };

  /* ----------------------- UI ----------------------- */

  return (
    <div className="flex flex-col min-h-[50dvh] 2xl:min-h-[80dvh] justify-between gap-2">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-9 gap-x-3">
          {/* Bedrooms */}
          <div className="flex flex-col gap-3">
            <Label>
              No Of Bedrooms <Required />
            </Label>
            <Input
              name="no_of_bedrooms"
              value={propertyFeatures.no_of_bedrooms}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (/^\d+$/.test(value) && value.length <= 10)) {
                  handleChange(e);
                  setErrors((prev) => ({ ...prev, no_of_bedrooms: '' }))
                }
              }}
              placeholder="Select"
            />
            {
              errors.no_of_bedrooms && (
                <p className="text-sm text-red-500">{errors.no_of_bedrooms}</p>
              )
            }
          </div>

          {/* Bathrooms */}
          <div className="flex flex-col gap-3">
            <Label>
              No Of Bathrooms <Required />
            </Label>
            <Input
              name="no_of_bathrooms"
              value={propertyFeatures.no_of_bathrooms}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (/^\d+$/.test(value) && value.length <= 10)) {
                  handleChange(e);
                  setErrors((prev) => ({ ...prev, no_of_bathrooms: '' }))
                }
              }}
              placeholder="Provide bathroom count"
            />
            {
              errors.no_of_bathrooms && (
                <p className="text-sm text-red-500">{errors.no_of_bathrooms}</p>
              )
            }
          </div>

          {/* Parking */}
          {/* <div className="flex flex-col gap-3">
            <Label>
              Parking <Required />
            </Label>
            <Select
              value={propertyFeatures.parking}
              onValueChange={(val) =>
              // setPropertyFeatures((prev) => ({
              //   ...prev,
              //   parking: val,
              // }))
              {
                setPropertyFeatures((prev:any) => ({
                  ...prev,
                  parking: val,
                }));
                setErrors((prev) => ({ ...prev, parking: '' }))

              }
              }
            >
              <SelectTrigger className="h-12 rounded-md">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Car spacing">Car Spacing</SelectItem>
                <SelectItem value="Mechanical parking">
                  Mechanical Parking
                </SelectItem>
              </SelectContent>
            </Select>
            {
              errors.parking && (
                <p className="text-sm text-red-500">{errors.parking}</p>
              )
            }
          </div> */}

          <div className="flex flex-col gap-3">
            <Label>
              Parking Spaces<Required />
            </Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="Enter number of spaces"
                className="h-12 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={propertyFeatures.parking}
                onChange={(e) => {
                  const val = e.target.value;
                  setPropertyFeatures((prev: any) => ({
                    ...prev,
                    parking: val, // Stores the number as a string (e.g., "2")
                  }));
                  setErrors((prev) => ({ ...prev, parking: '' }));
                }}
              />
              {/* <span className="absolute top-1/2 right-2 -translate-y-1/2 px-2 border-l text-sm">
                sqft
              </span> */}

            </div>
            {errors.parking && (
              <p className="text-sm text-red-500">{errors.parking}</p>
            )}
          </div>


          {/* No of garage */}
          <div className="flex flex-col gap-3">
            <Label>
              No Of Garage <Required />
            </Label>
            <Input
              name="no_of_garage"
              value={propertyFeatures.no_of_garage}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (/^\d+$/.test(value) && value.length <= 10)) {
                  handleChange(e);
                  setErrors((prev) => ({ ...prev, no_of_garage: '' }))
                }
              }}
              placeholder="Provide garage count"
            />
            {
              errors.no_of_garage && (
                <p className="text-sm text-red-500">{errors.no_of_garage}</p>
              )
            }
          </div>

          {/* Land Size */}
          <div className="flex flex-col gap-3">
            <Label>Land Size</Label>
            <div className="relative">
              <Input
                name="land_size"
                value={propertyFeatures.land_size}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (/^\d+$/.test(value) && value.length <= 10)) {
                    handleChange(e);
                  }
                }}
                placeholder="Select"
              />
              <span className="absolute top-1/2 right-2 -translate-y-1/2 px-2 border-l text-sm">
                sqft
              </span>
            </div>
            {
              errors.land_size && (
                <p className="text-sm text-red-500">{errors.land_size}</p>
              )
            }
          </div>

          {/* Floor Area */}
          <div className="flex flex-col gap-3">
            <Label>Floor Area</Label>
            <div className="relative">
              <Input
                name="floor_area"
                value={propertyFeatures.floor_area}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (/^\d+$/.test(value) && value.length <= 10)) {
                    handleChange(e);
                  }
                }}
                placeholder="Select"
              />
              <span className="absolute top-1/2 right-2 -translate-y-1/2 px-2 border-l text-sm">
                sqft
              </span>
            </div>
            {
              errors.floor_area && (
                <p className="text-sm text-red-500">{errors.floor_area}</p>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFeatures;


// import React, { useState } from "react";
// import { Input } from "../../ui/input";
// import { Label } from "../../ui/label";
// import { Required } from "../../ui/miscellenious";
// import { cn } from "../../lib/utils";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
// import { Textarea } from "../../ui/textarea";
// import { Button } from "../../ui/button";
// import Icon from "../../icons/icon";
// import { useMutation } from "@tanstack/react-query";
// import { addPropertyApi } from "../../../actions/property";
// import { defaultFeaturesType } from "@/src/types/property";
// // import { defaultFeaturesType } from "./addProperty";

// type PropertyFeaturesProps = {
//     propertyFeatures: defaultFeaturesType,
//     setPropertyFeatures: (updater: (prev: defaultFeaturesType) => defaultFeaturesType) => void
// }

// const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({ propertyFeatures, setPropertyFeatures }) => {
//     // const [propertyFeatures, setPropertyFeatures] = useState<defaultFeaturesType>(payload?.property_details?.features ?? defaultFeatures)

//     // const { mutate: createProperty, isPending } = useMutation({
//     //     mutationFn: (payload: any) => addPropertyApi(payload),
//     //     onSuccess: (data) => {
//     //         const new_payload = { ...payload };
//     //         new_payload.property_details = {
//     //             ...new_payload.property_details,
//     //             features: data?.data?.property_details?.features,
//     //         }
//     //         // new_payload.property_object_id = { ...new_payload, property_object_id: data?.data?._id }
//     //         new_payload.property_object_id = data?.data?._id;
//     //         // console.log("new_payload::::---", new_payload);
//     //         setPayload(new_payload)
//     //         // console.log("go to next tab");
//     //     },
//     //     onError: (error) => {

//     //         // toast({
//     //         //     title: `Failed to Update Property`,
//     //         //     description: `An error occurred while creating the property. Please try again.`,
//     //         //     variant: "error",
//     //         // })
//     //     },
//     // });

//     const handleChange = (e: any) => {
//         const { name, value } = e?.target;
//         setPropertyFeatures(prev => ({ ...prev, [name]: value }))
//     }


//     // const handleSubmit = () => {
//     //     // console.log("parent payload ::: ", payload);

//     //     let current_payload = { ...payload }
//     //     current_payload.property_details = {
//     //         ...current_payload.property_details,
//     //         features: propertyFeatures
//     //     }
//     //     // console.log("current_payload ::: ", current_payload);

//     //     createProperty(current_payload)
//     // }

//     return <div className="flex flex-col min-h-[50dvh] 2xl:min-h-[80dvh] justify-between gap-2">
//         <div className="flex flex-col gap-5">
//             <div className="grid grid-cols-4 gap-y-9 gap-x-3 ">

//                 <div className="flex flex-col gap-3">
//                     <Label>No Of Bedrooms  <Required /></Label>
//                     <div className="relative">
//                         <Input type="text"
//                             name="no_of_bedrooms"
//                             onChange={handleChange}
//                             placeholder="Select"
//                             value={propertyFeatures?.no_of_bedrooms}
//                         />
//                         {/* <Icon name="Calendar" className="absolute top-1/2 right-2 -translate-y-1/2" /> */}
//                     </div>
//                 </div>

//                 <div className="flex flex-col gap-3">
//                     <Label>No Of Bathrooms  <Required /></Label>
//                     <div className="relative">
//                         <Input
//                             type="text"
//                             placeholder="Provide Bathroom count"
//                             name="no_of_bathrooms"
//                             onChange={handleChange}
//                             value={propertyFeatures?.no_of_bathrooms}
//                         />
//                         {/* <Icon name="Calendar" className="absolute top-1/2 right-2 -translate-y-1/2" /> */}
//                     </div>
//                 </div>
//                 <div className="flex flex-col gap-3">
//                     <Label>Parking <Required /></Label>
//                     <Select value={propertyFeatures?.parking}
//                         onValueChange={val => setPropertyFeatures(prev => ({ ...prev, parking: val }))}>
//                         <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
//                             <SelectValue placeholder="Select" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem key={0} value={"Car spacing"}>Car Spacing</SelectItem>
//                             <SelectItem key={1} value={"Mechanical parking"}>Mechanical parking</SelectItem>
//                         </SelectContent>
//                     </Select>
//                 </div>
//                 {/* <div className="flex flex-col gap-3">
//                     <Label>Lease Terms <Required /></Label>
//                     <Select value={propertyFeatures?.parking}
//                     onValueChange={val => setPropertyFeatures(prev => ({...prev, parking: val}))}>
//                         <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
//                             <SelectValue placeholder="Select" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem key={1} value={"24 Months"}>24 Months</SelectItem>
//                             <SelectItem key={1} value={"18 Months"}>18 Months</SelectItem>
//                             <SelectItem key={0} value={"12 Months"}>12 Months</SelectItem>
//                             <SelectItem key={1} value={"9 Months"}>9 Months</SelectItem>
//                             <SelectItem key={1} value={"6 Months"}>6 Months</SelectItem>
//                         </SelectContent>
//                     </Select>
//                 </div> */}

//                 <div className="flex flex-col gap-3">
//                     <Label>Land Size </Label>
//                     <div className="relative">
//                         <Input
//                             type="text"
//                             name="land_size"
//                             onChange={handleChange}
//                             value={propertyFeatures?.land_size}
//                             placeholder="Select" />
//                         <span className="absolute h-5 border-l border-[#00000033] flex items-center px-2 top-1/2 right-2 -translate-y-1/2"></span>
//                         {/* <Icon name="Calendar" className="absolute top-1/2 right-2 -translate-y-1/2" /> */}
//                     </div>
//                 </div>
//                 <div className="flex flex-col gap-3">
//                     <Label>Floor Area</Label>
//                     <div className="relative">
//                         <Input type="text"
//                             name="floor_area"
//                             onChange={handleChange}
//                             value={propertyFeatures?.floor_area} placeholder="Select" />
//                         <span className="absolute h-5 border-l border-[#00000033] flex items-center px-2 top-1/2 right-2 -translate-y-1/2">m²</span>
//                         {/* <Icon name="Calendar" className="absolute top-1/2 right-2 -translate-y-1/2" /> */}
//                     </div>
//                 </div>
//             </div>
//         </div>
//         {/* <div className="mb-1 flex items-center justify-end">
//             <Button variant="secondary"  className="text-white cursor-pointer" onClick={handleSubmit}>Continue</Button>
//         </div> */}
//     </div>
// }

// export default PropertyFeatures;