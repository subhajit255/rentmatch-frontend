import React, { ChangeEvent, useEffect, useRef, useMemo } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Required } from "../../ui/miscellenious";
import { cn } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { useQuery } from "@tanstack/react-query";

import { getPropertyTypeList } from "../../../actions/propertyMaster";
import { getStates, SUBRUPS } from "../../../constants/property";
import { basicDetailsType } from "@/src/types/property";
import { Button } from "../../ui/button";
import LocationAutocomplete from "../../locationAutoComplete";
import { useGoogleMaps } from "../../../context/GoogleMapsProvider";
import GooglePlacesAutocomplete from "../../autoCompleteGoogle";

/* ----------------------- TYPES ----------------------- */

type PropertyType = {
  _id: string;
  name: string;
};

type PropertyBasicsProps = {
  basicDetails: basicDetailsType;
  setBasicDetails: React.Dispatch<
    React.SetStateAction<basicDetailsType>
  >;
  MasterValues: any
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

/* ----------------------- COMPONENT ----------------------- */
const LIBRARIES: ("places")[] = ["places"];

const PropertyBasics: React.FC<PropertyBasicsProps> = ({
  basicDetails,
  setBasicDetails,
  MasterValues,
  errors,
  setErrors
}) => {
  // console.log(errors, "<---????????")
  const { isLoaded, loadError } = useGoogleMaps();

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);


  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();

      const address = place.formatted_address || "";
      const latrow = place.geometry?.location?.lat();
      const lngrow = place.geometry?.location?.lng();

      const lat = String(latrow);
      const lng = String(lngrow)
      console.log(address, "<---lat lng")
      console.log(lat, lng, "<---lat lng")
      setBasicDetails((prev) => ({
        ...prev,
        full_address: address,
        latitude: lat ?? "0",
        longitude: lng ?? "0",
      }));

      // Clear the error once a valid location is picked
      if (address) {
        setErrors((prev) => ({ ...prev, full_address: '' }));
      }
    }
  };

  const handleManualAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBasicDetails((prev) => ({ ...prev, full_address: value }));
  };

  const { data: propertyTypes, isLoading } = useQuery({
    queryKey: ["propertyType"],
    queryFn: () => getPropertyTypeList({}),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const suburbTypes = useMemo(() => {
    const suburbCategory = (MasterValues?.suburb_types ?? []).find(
      (cat: any) => cat?.type === "suburb_types"
    );

    return (
      suburbCategory?.data?.filter((item: any) => item.is_active !== false) ?? []
    );
  }, [MasterValues]);

  const states = useMemo(() => getStates(), []);

  /* ----------------------- HANDLERS ----------------------- */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBasicDetails((prev) => ({ ...prev, [name]: value }));
  };

  const toggleRentAvailability = () => {
    setBasicDetails((prev) => ({
      ...prev,
      is_available_for_rent: !prev.is_available_for_rent,
    }));
  };

  if (!isLoaded) {
    return <div className="py-10 text-center">Loading Google Maps...</div>;
  }

  if (loadError) {
    return (
      <div className="py-10 text-center text-red-600">
        Failed to load Google Maps. Please try again later.
      </div>
    );
  }

  /* ----------------------- UI ----------------------- */

  return (
    <div className="flex flex-col min-h-[50dvh] 2xl:min-h-[70dvh] justify-between gap-2">
      <div className="flex flex-col gap-5 2xl:gap-10">
        {/* Property Name */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-8">
          <div className="md:col-span-3 flex flex-col gap-3">
            <Label htmlFor="property_name" className="font-medium">
              Property Name <Required />
            </Label>
            <Input
              name="property_name"
              className={errors.property_name ? "border-red-500" : ''}
              value={basicDetails.property_name}
              // onChange={handleChange}
              onChange={(e) => {
                handleChange(e);
                setErrors((prev) => ({ ...prev, property_name: '' }))
              }}
              placeholder="Enter property name"
            />

            {
              errors.property_name && (
                <p className="text-sm text-red-500">{errors.property_name}</p>
              )
            }
          </div>

          {/* PROPERTY No  */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <Label className="leading-[18px]">Property Number <Required /></Label>
            <Input
              name="property_no"
              value={basicDetails.property_no}
              onChange={(e) => {
                handleChange(e);
                setErrors((prev) => ({ ...prev, property_no: '' }))
              }}
              placeholder="Enter property number "
            />
            {
              errors.property_no && (
                <p className="text-sm text-red-500">{errors.property_no}</p>
              )
            }
          </div>

        </div>

        {/* Property Type + Rent Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-8">
          <div className="md:col-span-2 flex flex-col gap-3">
            <Label className="font-medium">
              Property Type <Required />
            </Label>

            <Select
              disabled={isLoading}
              value={basicDetails.property_type_id}
              onValueChange={(val) => {
                setBasicDetails((prev) => ({
                  ...prev,
                  property_type_id: val,
                }));
                setErrors((prev) => ({ ...prev, property_type_id: '' }))

              }
              }
            >

              <SelectTrigger className="h-12 rounded-md">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes?.result?.map((type: PropertyType) => (
                  <SelectItem key={type._id} value={type._id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {
              errors.property_type_id && (
                <p className="text-sm text-red-500">{errors.property_type_id}</p>
              )
            }
          </div>

          {/* BUILD YEAR  */}
          {/* <div className="flex flex-col gap-3">
            <Label className="leading-[18px]">Build Year <Required /></Label>
            <Input
              name="year_built"
              value={basicDetails.year_built}
              onChange={(e) => {
                const value = e.target.value;
                const currentYear = new Date().getFullYear();
                if (value === '' || (/^\d+$/.test(value) && value.length <= 4)) {
                  if (value !== '' && parseInt(value) > currentYear) {
                    setErrors((prev) => ({ ...prev, year_built: 'Year cannot be in the future' }));
                  } else {
                    setErrors((prev) => ({ ...prev, year_built: '' }));
                  }
                  // setErrors((prev) => ({ ...prev, year_built: '' }));
                  handleChange(e);
                }
              }}
              placeholder="Enter Build Year"
            />

            {
              errors.year_built && (
                <p className="text-sm text-red-500">{errors.year_built}</p>
              )
            }
          </div> */}


          {/* Rent Toggle */}
          <div className="md:col-span-2 flex items-center gap-4">
            <Label>
              Available for Rent? <Required />
            </Label>
            <Button
              type="button"
              role="switch"
              aria-checked={basicDetails.is_available_for_rent}
              onClick={toggleRentAvailability}
              className={cn(
                "h-[33px] w-[64px] !p-0 px-2 flex items-center rounded-full transition justify-start",
                basicDetails.is_available_for_rent
                  ? "bg-active/35"
                  : "bg-[#EFEFEF]"
              )}
            >
              <span
                className={cn(
                  "w-[22px] h-[22px] rounded-full transition-transform",
                  basicDetails.is_available_for_rent
                    ? "bg-active translate-x-8"
                    : "bg-[#A3ABB0] translate-x-2"
                )}
              />
            </Button>
            {
              errors.is_available_for_rent && (
                <p className="text-sm text-red-500">{errors.is_available_for_rent}</p>
              )
            }
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 2xl:gap-6">
          <div className="flex flex-col gap-3">
            <Label>
              Suburb <Required />
            </Label>
            <Select
              value={basicDetails.subrup}
              onValueChange={(val) => {
                setBasicDetails((prev) => ({ ...prev, subrup: val }))
                setErrors((prev) => ({ ...prev, subrup: '' }))
              }
              }
            >
              <SelectTrigger className="h-12 rounded-md">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {suburbTypes.map((area: any) => (
                  <SelectItem key={area.id || area.slug || area.name} value={area.slug}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {
              errors.subrup && (
                <p className="text-sm text-red-500">{errors.subrup}</p>
              )
            }
          </div>

          <div className="flex flex-col gap-3">
            <Label>
              State <Required />
            </Label>
            <Select
              value={basicDetails.state}
              onValueChange={(val) => {
                setBasicDetails((prev) => ({ ...prev, state: val }))
                setErrors((prev) => ({ ...prev, state: '' }))
              }
              }
            >
              <SelectTrigger className="h-12 rounded-md">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {
              errors.state && (
                <p className="text-sm text-red-500">{errors.state}</p>
              )
            }
          </div>

          {/* <div className="flex flex-col gap-3">
            <Label className="leading-[18px]">Region / Area <Required /></Label>
            <Input
              name="region_area"
              value={basicDetails.region_area}
              onChange={handleChange}
              placeholder="Add"
            />
            {
              errors.region_area && (
                <p className="text-sm text-red-500">{errors.region_area}</p>
              )
            }
          </div> */}

          <div className="flex flex-col gap-3">
            <Label>
              Postcode <Required />
            </Label>
            <Input
              name="pincode"
              value={basicDetails.pincode}
              onChange={(e) => {
                handleChange(e);
                setErrors((prev) => ({ ...prev, pincode: '' }))
              }}
              placeholder="Add"
            />
            {
              errors.pincode && (
                <p className="text-sm text-red-500">{errors.pincode}</p>
              )
            }
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col gap-3">
          <Label>
            Full Address <Required />
          </Label>

          {/* <Autocomplete
            onLoad={(auto) => (autocompleteRef.current = auto)}
            onPlaceChanged={onPlaceChanged}
          >
            <Input
              name="full_address"
              value={basicDetails.full_address}
              onChange={handleManualAddressChange}
              placeholder="Search for a location..."
              className={cn(
                "w-full",
                errors.full_address ? "border-red-500" : ""
              )}
            />
          </Autocomplete> */}

          <div className="col-span-3 flex flex-col gap-3">

            <GooglePlacesAutocomplete
              value={basicDetails.full_address}
              onChange={(val) => {
                setBasicDetails((p) => ({ ...p, full_address: val }));
                setErrors((p) => ({ ...p, full_address: '' }));
              }}
              onPlaceSelect={
                // onPlaceChanged
                (place) => {
                  const lat = place.geometry?.location?.lat();
                  const lng = place.geometry?.location?.lng();
                  if (lat && lng) {
                    setBasicDetails((p) => ({
                      ...p,
                      latitude: String(lat),
                      longitude: String(lng),
                    }));
                  }
                }
              }
              error={errors.full_address}
            />
          </div>

          {
            errors.full_address && (
              <p className="text-sm text-red-500">{errors.full_address}</p>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default PropertyBasics;
