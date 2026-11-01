import React, { ChangeEvent, useCallback, useState } from "react";
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

import Icon from "../../icons/icon";
import { Calendar } from "../../ui/calander";

import { defaultDetailsType } from "@/src/types/property";

/* ----------------------- HELPERS ----------------------- */

const formatDDMMYYYY = (date: Date | null): string => {
  if (!date) return "";
  const dateObj = new Date(date);

  const dd = String(dateObj?.getDate()).padStart(2, "0");
  const mm = String(dateObj?.getMonth() + 1).padStart(2, "0");
  const yyyy = dateObj?.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

/* ----------------------- PROPS ----------------------- */

type RentDetailsProps = {
  rentDetails: defaultDetailsType;
  setRentDetails: React.Dispatch<
    React.SetStateAction<defaultDetailsType>
  >;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

/* ----------------------- COMPONENT ----------------------- */

const PropertyDetails: React.FC<RentDetailsProps> = ({
  rentDetails,
  setRentDetails,
  errors,
  setErrors
}) => {
  const [openCalendar, setOpenCalendar] = useState(false);
  // console.log(rentDetails, "<--rent details ")

  /* ----------------------- HANDLERS ----------------------- */

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = useCallback(
    (date?: Date) => {
      // Only update the state if a valid date is provided
      if (date) {
        setRentDetails((prev) => ({
          ...prev,
          available_from: date,
          available_from_string: formatDDMMYYYY(date),
        }));
      }

      // Close the calendar regardless
      setOpenCalendar(false);
    },
    [setRentDetails]
  );

  // const handleDateSelect = useCallback(
  //   (date?: Date) => {
  //     setRentDetails((prev) => ({
  //       ...prev,
  //       available_from: date ?? null, // <-- Uncomment this line
  //       available_from_string: date ? formatDDMMYYYY(date) : "",
  //     }));
  //     setOpenCalendar(false);
  //   },
  //   [setRentDetails]
  // );
  /* ----------------------- UI ----------------------- */

  return (
    <div className="flex flex-col min-h-[25dvh] 2xl:min-h-[80dvh] justify-between gap-2">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Weekly Rent */}
          <div className="flex flex-col gap-3">
            <Label>
              Weekly Rent Price <Required />
            </Label>
            <Input
              name="weekly_rent_price"
              value={rentDetails.weekly_rent_price}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^\d*\.?\d{0,2}$/;
                if (value === '' || (regex.test(value) && value.length <= 10)) {
                  handleChange(e);
                  setErrors((prev) => ({ ...prev, weekly_rent_price: '' }))
                }
              }}
              placeholder="Enter the rent amount"
            />
            {
              errors.weekly_rent_price && (
                <p className="text-sm text-red-500">{errors.weekly_rent_price}</p>
              )
            }
          </div>

          {/* Bond */}
          <div className="flex flex-col gap-3">
            <Label>
              Bond <Required />
            </Label>
            <Input
              name="bond_or_security_deposit"
              value={rentDetails.bond_or_security_deposit}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^\d*\.?\d{0,2}$/;
                if (value === '' || (regex.test(value) && value.length <= 10)) {
                  handleChange(e);
                  setErrors((prev) => ({ ...prev, bond_or_security_deposit: '' }))
                }
              }}
              placeholder="Enter the bond amount"
            />
            {
              errors.bond_or_security_deposit && (
                <p className="text-sm text-red-500">{errors.bond_or_security_deposit}</p>
              )
            }
          </div>

          {/* Available From */}
          <div className="flex flex-col gap-3">
            <Label>
              Available From <Required />
            </Label>

            <div className="relative">
              <Input
                disabled
                placeholder="dd/mm/yyyy"
                value={formatDDMMYYYY(rentDetails.available_from)}
                className="bg-white text-black" // ensuring readability when disabled
              />
              <button
                type="button"
                onClick={() => setOpenCalendar((p) => !p)}
                className="absolute top-1/2 right-2 -translate-y-1/2"
                aria-label="Open calendar"
              >
                <Icon name="Calendar" />
              </button>

              {/* Absolutely positioned calendar wrapper */}
              {openCalendar && (
                <div className="absolute top-full left-0 mt-2 z-50">
                  <Calendar
                    mode="single"
                    selected={rentDetails.available_from ?? undefined}
                    onSelect={handleDateSelect}
                    className="rounded-md border shadow-md bg-white"
                    captionLayout="dropdown"
                  />
                </div>
              )}
            </div>

            {/* Error message */}
            {errors.available_from && (
              <p className="text-sm text-red-500">{errors.available_from}</p>
            )}
          </div>

          {/* Lease Terms */}
          <div className="flex flex-col gap-3">
            <Label>
              Lease Terms <Required />
            </Label>
            <Select
              value={rentDetails.rent_details_lease_terms}
              onValueChange={(val) =>
                setRentDetails((prev) => ({
                  ...prev,
                  rent_details_lease_terms: val,
                }))
              }
            >
              <SelectTrigger className="h-12 rounded-md">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[
                  1, 3, 6, 9, 12, 15, 18, 21, 24,
                ].map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {m} month{m > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {
              errors.rent_details_lease_terms && (
                <p className="text-sm text-red-500">{errors.rent_details_lease_terms}</p>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;


// import React, { useCallback, useEffect, useState } from "react";
// import { Input } from "../../ui/input";
// import { Label } from "../../ui/label";
// import { Required } from "../../ui/miscellenious";
// import { cn } from "../../lib/utils";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
// import { Textarea } from "../../ui/textarea";
// import { Button } from "../../ui/button";
// import Icon from "../../icons/icon";
// import { Calendar } from "../../ui/calander";
// import { useMutation } from "@tanstack/react-query";
// import { addPropertyApi } from "../../../actions/property";
// import { defaultDetailsType } from "@/src/types/property";
// // import { defaultDetailsType } from "./addProperty";


// function toDate(value: any): Date {
//     if (value instanceof Date) return value;
//     if (typeof value === "string" || typeof value === "number") {
//         const parsed = new Date(value);
//         return isNaN(parsed.getTime()) ? new Date() : parsed;
//     }
//     return new Date();
// }


// function formatDDMMYYYY(date: Date | null): string {
//     const d = toDate(date);
//     const dd = String(d?.getDate()).padStart(2, "0");
//     const mm = d?.getMonth() ? String(d?.getMonth() + 1).padStart(2, "0") : "01";
//     const yyyy = d?.getFullYear();
//     return `${dd}/${mm}/${yyyy}`;
// }

// type RentDetailsProps = {
//     rentDetails: defaultDetailsType,
//     setRentDetails: (updater: (prev: defaultDetailsType) => defaultDetailsType) => void
// };

// const PropertyDetails: React.FC<RentDetailsProps> = ({ rentDetails, setRentDetails }) => {
//     // const [rentDetails, setRentDetails] = useState<defaultDetailsType>(payload?.property_details?.rent_details ?? defaultDetails);
//     const [openCalender, setOpenCalender] = useState<boolean>(false)
//     // useEffect(() => {
//     // console.log("payload ::: ", payload, payload?.property_details?.rent_details);
//     // console.log("rentDetails ::: ", rentDetails);
//     // }, [payload, rentDetails]);

//     // const { mutate: createProperty, isPending } = useMutation({
//     //     mutationFn: (payload: any) => addPropertyApi(payload),
//     //     onSuccess: (data) => {
//     //         // console.log("data ::: ", data?.data);

//     //         const new_payload = { ...payload };
//     //         new_payload.property_details = {
//     //             ...new_payload.property_details,
//     //             rent_details: data?.data?.property_details?.rent_details
//     //         }
//     //         new_payload.property_object_id = data?.data?._id;
//     //         // console.log("new payload inside rent details :: :", new_payload);

//     //         // new_payload.property_object_id = {...new_payload, property_object_id: data?.data?._id}
//     //         setPayload(new_payload)
//     //     },
//     //     onError: (error) => {

//     //         // toast({
//     //         //     title: `Failed to Update Property`,
//     //         //     description: `An error occurred while creating the property. Please try again.`,
//     //         //     variant: "error",
//     //         // })
//     //     },
//     // });

//     const handlechange = (e: any) => {
//         const { name, value } = e?.target;
//         setRentDetails(prev => ({ ...prev, [name]: value }))
//     }

//     const handleDateSelect = useCallback((date?: Date) => {
//         setRentDetails(prev => ({ ...prev, available_from: date ?? null }));
//     }, [setRentDetails]);

//     useEffect(() => {
//         // console.log("rentDetails :::::: -> ", rentDetails);

//     }, [rentDetails])

//     // const handleSubmit = () => {
//     //     let current_payload = { ...payload }
//     //     current_payload.property_details = {
//     //         ...current_payload.property_details,
//     //         rent_details: rentDetails
//     //     }
//     //     // console.log("current_payload ::: ", current_payload);

//     //     createProperty(current_payload)
//     // }

//     return <div className="flex flex-col min-h-[50dvh] 2xl:min-h-[80dvh] justify-between gap-2">
//         <div className="flex flex-col gap-5">
//             <div className="grid grid-cols-4 gap-3 ">
//                 <div className="flex flex-col gap-3">
//                     <Label>Weekly Rent Price  <Required /></Label>
//                     <Input
//                         name="weekly_rent_price"
//                         value={rentDetails?.weekly_rent_price}
//                         onChange={handlechange}
//                         placeholder="Enter the rent amount"
//                     />
//                     {/* <Select>
//                         <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
//                             <SelectValue placeholder="Select" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem key={0} value={"10"}>50</SelectItem>
//                             <SelectItem key={1} value={"10"}>100</SelectItem>
//                             <SelectItem key={2} value={"10"}>200</SelectItem>
//                             <SelectItem key={3} value={"10"}>500</SelectItem>
//                             <SelectItem key={4} value={"10"}>1000</SelectItem>
//                             <SelectItem key={5} value={"10"}>1500</SelectItem>
//                             <SelectItem key={6} value={"10"}>2000</SelectItem>
//                             <SelectItem key={7} value={"10"}>2500</SelectItem>
//                             <SelectItem key={8} value={"10"}>3500</SelectItem>
//                         </SelectContent>
//                     </Select> */}
//                 </div>
//                 <div className="flex flex-col gap-3">
//                     <Label>Bond / Security Deposit  <Required /></Label>
//                     <Input
//                         name="bond_or_security_deposit"
//                         value={rentDetails?.bond_or_security_deposit}
//                         onChange={handlechange}
//                         placeholder="Enter the bond amount"
//                     />
//                     {/* <Select>
//                         <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
//                             <SelectValue placeholder="Select" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem key={0} value={"west bengal"}>West Bengal</SelectItem>
//                         </SelectContent>
//                     </Select> */}
//                 </div>
//                 <div className="flex flex-col gap-3">
//                     <Label>Available From  <Required /></Label>
//                     <div className="relative z-99">
//                         <Input type="text" disabled placeholder="dd/mm/yyyy" value={formatDDMMYYYY(rentDetails?.available_from ?? new Date())} />
//                         <div onClick={() => setOpenCalender(prev => !prev)}
//                             className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center justify-center">
//                             <Icon name="Calendar" />
//                         </div>

//                     </div>
//                     {openCalender && <Calendar
//                         mode="single"
//                         selected={rentDetails?.available_from ?? new Date()}
//                         onSelect={handleDateSelect}
//                         className="rounded-md border shadow-sm"
//                         captionLayout="dropdown"
//                     />}


//                 </div>
//                 <div className="flex flex-col gap-3">
//                     <Label >Lease Terms <Required /></Label>
//                     <Select value={rentDetails?.rent_details_lease_terms}
//                         onValueChange={(val) => setRentDetails(prev => ({ ...prev, rent_details_lease_terms: val }))}>
//                         <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
//                             <SelectValue placeholder="Select" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem key={0} value={"1"}>{"1 month"}</SelectItem>
//                             <SelectItem key={1} value={"3"}>{"3 month"}</SelectItem>
//                             <SelectItem key={2} value={"6"}>{"6 month"}</SelectItem>
//                             <SelectItem key={3} value={"9"}>{"9 month"}</SelectItem>
//                             <SelectItem key={4} value={"12"}>{"12 month"}</SelectItem>
//                             <SelectItem key={5} value={"15"}>{"15 month"}</SelectItem>
//                             <SelectItem key={6} value={"18"}>{"18 month"}</SelectItem>
//                             <SelectItem key={7} value={"21"}>{"21 month"}</SelectItem>
//                             <SelectItem key={8} value={"24"}>{"24 month"}</SelectItem>
//                         </SelectContent>
//                     </Select>
//                 </div>
//             </div>
//         </div>
//         {/* <div className="mb-1 flex items-center justify-end">
//             <Button variant="secondary"  className="text-white cursor-pointer" onClick={handleSubmit}>Continue</Button>
//         </div> */}
//     </div>
// }

// export default PropertyDetails;