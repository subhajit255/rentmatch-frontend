import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { FormError } from "../errors";
import {
  balcony,
  bathrooms,
  bedrooms,
  garages,
} from "../../constants/property";

const defaultPostPayload = {
  start_price: "",
  end_price: "3500",
  start_size: "0",
  end_size: "950",
  garages: "",
  bathrooms: "",
  bedrooms: "",
  balcony: "",
  amenities: ["Car Parking"],
};

type CreatePostType = typeof defaultPostPayload & {
  amenities: string[] | string;
} & { _id?: string };

const AdvanceSearchModal = ({
  parameters,
  setParameters,
  closeSheet,
}: {
  parameters: any;
  setParameters: any;
  closeSheet: () => void;
}) => {
  // console.log(parameters, "<---paramtr ");
  const { initialFilter, amenities = [] } = parameters;

  // const listedAminity = amenities.map((item: { name: any }) => item.name);
  const listedAminity = amenities;
  // console.log(amenities, "<----availableAmenities");

  const appliedFilter = parameters?.initialFilter ?? {};

  const initialValues: CreatePostType = {
    start_price: appliedFilter.start_price ?? "",
    end_price: appliedFilter.end_price ?? "5500",
    start_size: appliedFilter.start_size ?? "0",
    end_size: appliedFilter.end_size ?? "1000",
    garages: appliedFilter.garages ?? "",
    bathrooms: appliedFilter.bathrooms ?? "",
    bedrooms: appliedFilter.bedrooms ?? "",
    balcony: appliedFilter.balcony ?? "",
    amenities: Array.isArray(initialFilter?.amenities)
      ? [...initialFilter.amenities]
      : [],
  };

  const [myPostPayload, setMyPostPayload] =
    useState<CreatePostType>(initialValues);

  const [errors, setErrors] = useState<CreatePostType>(defaultPostPayload);

  const handleSelectChange = (name: string, value: string) => {
    // const { name, value } = event;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMyPostPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  const handleAmemity = (amenity: string) => {
    setMyPostPayload((prevPayload) => {
      // const amenities = Array.isArray(prevPayload.amenities) ? [...prevPayload.amenities] : [];
      const amenities = prevPayload.amenities ? [...prevPayload.amenities] : [];
      if (amenities.includes(amenity)) {
        // Remove amenity
        const updatedAmenities = amenities.filter((a) => a !== amenity);
        return { ...prevPayload, amenities: updatedAmenities };
      } else {
        // Add amenity
        amenities.push(amenity);
        return { ...prevPayload, amenities: amenities };
      }
    });
  };

  const handleClearAll = () => {
    setMyPostPayload({
      start_price: "",
      end_price: "",
      start_size: "",
      end_size: "",
      garages: "",
      bathrooms: "",
      bedrooms: "",
      balcony: "",
      amenities: [],
    });
  };

  const handleSubmit = () => {
    // You can add minimal validation here if needed
    parameters.onApply(myPostPayload);
    closeSheet();
  };
  return (
    <div className="flex flex-col gap-2 h-[100vh]">
      <div className="bg-primary text-white px-5 py-6 text-xl font-medium">
        <h2>Advance Filter</h2>
      </div>

      <div className="bg-white rounded-xl flex flex-col flex-1 overflow-hidden">
        <div className="bg-white p-10 rounded-xl overflow-y-auto thin-scrollbar ">
          <div className="w-full rounded-lg px-6 py-8 flex flex-col gap-7 bg-white">
            <div className="flex flex-col gap-6 ">
              {/* size and price slider */}
              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <div className="flex flex-col gap-2.5">
                    {/* <Label>Price: $0 - $10.000</Label> */}
                    <Label>
                      Price: ${Number(myPostPayload.start_price).toLocaleString()} – $
                      {Number(myPostPayload.end_price).toLocaleString()}
                    </Label>
                    <Slider
                      value={[
                        Number(myPostPayload?.start_price),
                        Number(myPostPayload?.end_price),
                      ]}
                      onValueChange={(val) =>
                        setMyPostPayload((prev) => ({
                          ...prev,
                          start_price: val[0].toString(),
                          end_price: val[1].toString(),
                        }))
                      }
                      min={0}
                      max={10000}
                      step={1}
                    />
                  </div>
                </div>
                <div className="w-1/2">
                  <div className="flex flex-col gap-2.5">
                    <Label>Size: {Number(myPostPayload.start_size).toLocaleString()} - {Number(myPostPayload.end_size).toLocaleString()}</Label>
                    <Slider
                      value={[
                        Number(myPostPayload?.start_size),
                        Number(myPostPayload?.end_size),
                      ]}
                      onValueChange={(val) =>
                        setMyPostPayload((prev) => ({
                          ...prev,
                          start_size: val[0].toString(),
                          end_size: val[1].toString(),
                        }))
                      }
                      min={0}
                      max={2000}
                      step={1}
                    />
                  </div>
                </div>
              </div>

              {/* Garage  */}
              <div className="flex gap-4 w-full">
                <div className="w-1/4">
                  <div className="flex flex-col gap-2.5 ">
                    <Label>Garages </Label>
                    <Select
                      onValueChange={(val) => handleSelectChange("garages", val)}
                      value={myPostPayload?.garages}
                    >
                      <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
                        <SelectValue placeholder="Select Your Garages" />
                      </SelectTrigger>
                      <SelectContent>
                        {garages?.map((garage) => (
                          <SelectItem key={garage?.id} value={garage?.value}>
                            {garage?.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors?.garages && <FormError message={errors?.garages} />}
                </div>
                <div className="w-1/4">
                  <div className="flex flex-col gap-2.5 ">
                    <Label>Bathrooms </Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("bathrooms", value)
                      }
                      value={myPostPayload?.bathrooms}
                    >
                      <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
                        <SelectValue placeholder="Select Your Bathrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        {bathrooms?.map((bathroom) => (
                          <SelectItem key={bathroom?.id} value={bathroom?.value}>
                            {bathroom?.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors?.bathrooms && <FormError message={errors?.bathrooms} />}
                </div>
                <div className="w-1/4">
                  <div className="flex flex-col gap-2.5 ">
                    <Label>Bedrooms </Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("bedrooms", value)
                      }
                      value={myPostPayload?.bedrooms}
                    >
                      <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
                        <SelectValue placeholder="Select Your Bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        {bedrooms?.map((bedroom) => (
                          <SelectItem key={bedroom?.id} value={bedroom?.value}>
                            {bedroom?.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors?.bedrooms && <FormError message={errors?.bedrooms} />}
                </div>
                <div className="w-1/4">
                  <div className="flex flex-col gap-2.5">
                    <Label>Balcony</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("balcony", value)
                      }
                      value={myPostPayload?.balcony}
                    >
                      <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
                        <SelectValue placeholder="Select Your Balcony" />
                      </SelectTrigger>
                      <SelectContent>
                        {balcony?.map((balconyItem) => (
                          <SelectItem
                            key={balconyItem?.id}
                            value={balconyItem?.value}
                          >
                            {balconyItem?.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors?.balcony && <FormError message={errors?.balcony} />}
                </div>
              </div>

              {/* Amenities Section */}
              <div className="w-full flex flex-col gap-6 mt-3">
                <h4 className="font-semibold text-lg">Amenities</h4>
                {listedAminity.length === 0 ? (
                  <div className="text-gray-500 italic">
                    Loading amenities or none available
                  </div>
                ) : (
                  /* Changed to 4 columns (lg) for better spacing */
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                    {listedAminity.map((amenity: any) => (
                      <div key={amenity._id} className="flex items-center gap-3">
                        <Checkbox
                          id={`amenity-${amenity._id}`}
                          checked={myPostPayload?.amenities?.includes(amenity.slug)}
                          value={amenity.slug}
                          onChange={(e) => handleAmemity(amenity.slug)}
                        />
                        <Label
                          htmlFor={`amenity-${amenity.slug}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {amenity.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        <div className="flex h-fit pr-6 pb-4 pt-0 pl-0 gap-4 items-center justify-end p-6 border-t bg-white shrink-0">
          <Button className="rounded-full mt-2" onClick={handleClearAll}>
            Clear All
          </Button>
          <Button
            className="rounded-full mt-2"
            variant={"secondary"}
            onClick={handleSubmit}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvanceSearchModal;
