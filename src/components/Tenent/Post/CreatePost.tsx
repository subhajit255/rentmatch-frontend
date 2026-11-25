import React, { useState, useEffect, useCallback } from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Checkbox } from "../../ui/checkbox";
import Icon from "../../icons/icon";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Slider } from "../../ui/slider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPropertyTypeList } from "../../../actions/propertyMaster";
import { toast } from "../../../custom-hooks/use-toast";
import { addMyPostApi, updateMyPostApi } from "../../../actions/myPost";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { createMyPostSchema } from "../../../schemas/tenant";
import { FormError } from "../../errors";
import {
  balcony,
  bathrooms,
  bedrooms,
  garages,
  about_you,
  employment_status,
  pets,
  smoking_preference,
} from "../../../constants/property";
import { ArrowLeft } from "lucide-react";
import { getMasterDataProperty } from "../../../actions/property";
import { Calendar } from "../../ui/calander";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

// const move_in_requirements = [
//   { id: 1, title: "Less than 15 days", value: "less_than_15_days" }, //Less than 15 days
//   { id: 2, title: "Within a month", value: "within_a_month" },
//   { id: 3, title: "1-2 months", value: "1_2_months" },
//   { id: 4, title: "2-6 months", value: "2_6_months" },
//   { id: 5, title: "More than 6 months", value: "more_than_6_months" },
// ];

const formatDateForInput = (date: Date | string | null | undefined): string => {
  if (!date) return "";
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return "";

  const dd = String(dateObj.getDate()).padStart(2, "0");
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const yyyy = dateObj.getFullYear();

  // <input type="date"> requires the format to be YYYY-MM-DD
  return `${yyyy}-${mm}-${dd}`;
};

const formatDateForDisplay = (date: Date | string | null | undefined): string => {
  if (!date) return "";
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return "";

  const dd = String(dateObj.getDate()).padStart(2, "0");
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const yyyy = dateObj.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
};

const amenitiesList = [
  "Air Condition",
  "Cable TV",
  "Ceiling Height",
  "Swimming Pool",
  "Car Parking",
  "Gym",
  "Garden Area",
  "Auditorium Hall",
  "CCTV Camera",
  "Lift",
  "Intercom",
];

const defaultPostPayload = {
  subject: "",
  about_post: "",
  property_type_object_id: "",
  move_in_requirements: "",
  location: "",
  rentalCityPreference: "",
  rentalStatePreference: "",
  start_price: "",
  end_price: "0",
  start_size: "0",
  end_size: "0",
  garages: "",
  bathrooms: "",
  bedrooms: "",
  balcony: "",
  about_you: "",
  employment_status: "",
  pets: "",
  smoking_preference: "",
  amenities: [] as string[],
};

type CreatePostType = typeof defaultPostPayload & {
  amenities: string[] | string;
} & { _id?: string };

const CreatePost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [myPostPayload, setMyPostPayload] =
    useState<CreatePostType>(defaultPostPayload);
  const [errors, setErrors] = useState<CreatePostType>(defaultPostPayload);
  const [openCalendar, setOpenCalendar] = useState(false);
  const state: CreatePostType & { id?: string } = location.state || {};

  const {
    data: masterData,
    isLoading: isMasterLoading,
    isError: isMasterError,
  } = useQuery({
    queryKey: ["masterPropertyData"],
    queryFn: getMasterDataProperty,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const amenities = masterData?.result?.amenities?.[0]?.data ?? [];

  useEffect(() => {
    if (state && state?._id)
      setMyPostPayload({ ...defaultPostPayload, ...state });
  }, [state]);

  const { data: propertyTypes, isLoading } = useQuery({
    queryKey: ["propertyType"],
    queryFn: () => getPropertyTypeList({}),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { mutate: createMyPlan, isPending } = useMutation({
    mutationFn: (payload: any) => addMyPostApi(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["myPost"] });
      navigate("/my-posts");
      toast({
        title: `Post Created Successfully`,
        description: `Your post has been created successfully.`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: `Failed to Create Post`,
        description: `An error occurred while creating the post. Please try again.`,
        variant: "error",
      });
    },
  });

  const { mutate: updateMyPlan, isPending: isUpdating } = useMutation({
    mutationFn: (payload: any) => updateMyPostApi(payload, payload?._id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["myPost"] });
      queryClient.invalidateQueries({ queryKey: ["postDetails"] });
      navigate("/my-posts");
      toast({
        title: `Post Updated Successfully`,
        description: `Your post has been updated successfully.`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: `Failed to Update Post`,
        description: `An error occurred while updating the post. Please try again.`,
        variant: "error",
      });
    },
  });

  const handleDateSelect = useCallback(
    (name: string, date: Date | undefined) => {
      setMyPostPayload((prev) => ({
        ...prev,
        [name]: date ? formatDateForInput(date) : "",
      }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    [],
  );

  const handleSelectChange = (name: string, value: string) => {
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMyPostPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setErrors((prev) => ({ ...prev, [event?.target?.name]: "" }));
    const { name, value } = event.target;
    setMyPostPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  const handleToggleAminities = useCallback((amenity: string) => {
    setMyPostPayload((prevPayload) => {
      const amenities = Array.isArray(prevPayload.amenities) ? [...prevPayload.amenities] : [];
      if (amenities.includes(amenity)) {
        // Remove amenity
        const updatedAmenities = amenities.filter((a) => a !== amenity);
        return { ...prevPayload, amenities: updatedAmenities };
      } else {
        // Add amenity
        return { ...prevPayload, amenities: [...amenities, amenity] };
      }
    });
  }, []);

  const AmenityItem = React.memo(({ amenity, isChecked, onToggle }: any) => {
    return (
      <div className="flex gap-2">
        <Checkbox
          id={amenity._id}
          checked={isChecked}
          onChange={() => onToggle(amenity.name)}
        />
        <Label htmlFor={amenity._id}>{amenity.name}</Label>
      </div>
    );
  });

  const handleClearAll = () => {
    setMyPostPayload(defaultPostPayload);
    setErrors(defaultPostPayload);
  };

  const handleSubmit = () => {
    const payload = {
      ...myPostPayload,
      start_price: myPostPayload.start_price?.toString(),
      end_price: myPostPayload.end_price?.toString(),
      start_size: "0",
      end_size: "10",
    };
    const validation = createMyPostSchema.safeParse(payload);
    if (!validation?.success) {
      const fieldErrors: any = {};
      validation?.error?.issues?.forEach((err) => {
        const field = err.path[0];
        fieldErrors[field as string] = err.message;
      });
      setErrors((prev) => ({
        ...defaultPostPayload,
        ...fieldErrors,
      }));
      return;
    }
    setErrors(defaultPostPayload);

    const amenitiesString = Array.isArray(payload.amenities)
      ? payload.amenities.join(",")
      : payload.amenities;
    if (state && state._id) {
      return updateMyPlan({
        ...payload,
        _id: state._id,
        amenities: amenitiesString,
        garages: Number(payload.garages),
        bathrooms: Number(payload.bathrooms),
        bedrooms: Number(payload.bedrooms),
        balcony: Number(payload.balcony),
      });
    }
    createMyPlan({
      ...payload,
      amenities: amenitiesString,
      garages: Number(payload.garages),
      bathrooms: Number(payload.bathrooms),
      bedrooms: Number(payload.bedrooms),
      balcony: Number(payload.balcony),
    });
  };

  return (
    <div className="common-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Post {state && state._id ? "Edit" : "Add"}
        </h2>
        <Link
          to="/my-posts"
          className="border border-primary text-primary hover:bg-primary hover:text-white font-semibold text-xs sm:text-sm px-5 py-2 rounded-full flex items-center gap-1.5 transition-all shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
          Back
        </Link>
      </div>
      <div className="w-full rounded-lg px-6 py-8 flex flex-col gap-7 bg-white">
        <div>
          <div className="flex flex-col gap-2.5">
            <Label>
              Subject <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Enter your subject"
              name="subject"
              value={myPostPayload?.subject}
              onChange={handleChange}
            />
          </div>
          {errors?.subject && <FormError message={errors?.subject} />}
        </div>

        <div>
          <div className="flex flex-col gap-2.5">
            <Label>Describe what are you looking for ? </Label>
            <Textarea
              placeholder="Write about your post"
              name="about_post"
              value={myPostPayload?.about_post}
              onChange={handleChange}
              className="h-30"
            />
          </div>
          {errors?.about_post && <FormError message={errors?.about_post} />}
        </div>
        <div className="flex flex-col gap-6 ">
          <div className="flex gap-4 w-full">
            <div className="w-1/2">
              <div className="flex flex-col gap-2.5 ">
                <Label>Property Type </Label>
                <Select
                  disabled={isLoading}
                  onValueChange={(val) =>
                    handleSelectChange("property_type_object_id", val)
                  }
                  value={myPostPayload?.property_type_object_id}
                >
                  <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {!isLoading &&
                      propertyTypes?.result?.map((type: any) => (
                        <SelectItem key={type?._id} value={type?._id}>
                          {type?.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              {errors?.property_type_object_id && (
                <FormError message={errors?.property_type_object_id} />
              )}
            </div>

            <div className="w-1/2">
              <div className="flex flex-col gap-2.5">
                <Label>Move-in Requirement</Label>

                <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                  <PopoverTrigger asChild>
                    <div className="relative cursor-pointer">
                      <Input
                        type="text"
                        placeholder="dd/mm/yyyy"
                        value={formatDateForDisplay(myPostPayload?.move_in_requirements)}
                        readOnly
                        className="pr-10 cursor-pointer"
                      />

                      {/* Calendar Button */}
                      <button
                        type="button"
                        className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                        aria-label="Open calendar"
                      >
                        <Icon name="Calendar" />
                      </button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        myPostPayload.move_in_requirements
                          ? new Date(myPostPayload.move_in_requirements)
                          : undefined
                      }
                      onSelect={(date) => {
                        handleDateSelect("move_in_requirements", date);
                        setOpenCalendar(false);
                      }}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>

                {/* Error */}
                {errors.move_in_requirements && (
                  <p className="text-sm text-red-500">
                    {errors.move_in_requirements}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex flex-col gap-2.5">
              <Label>Location </Label>
              <Input
                name="location"
                value={myPostPayload?.location}
                onChange={handleChange}
              />
            </div>
            {errors?.location && <FormError message={errors?.location} />}
          </div>


          <div className="flex flex-col gap-6 ">
            <div className="flex gap-4 w-full">
              <div className="w-1/2">
                <div className="flex flex-col gap-2.5">
                  <Label >Rental Suburb Preference </Label>
                  <Input
                    name="rentalCityPreference"
                    value={myPostPayload?.rentalCityPreference}
                    onChange={handleChange}
                  />
                </div>
                {errors?.rentalCityPreference && (
                  <FormError message={errors?.rentalCityPreference} />
                )}
              </div>

              <div className="w-1/2">
                <div className="flex flex-col gap-2.5">
                  <Label >Rental State Preference </Label>
                  <Input
                    name="rentalStatePreference"
                    value={myPostPayload?.rentalStatePreference}
                    onChange={handleChange}
                  />
                </div>
                {errors?.rentalStatePreference && (
                  <FormError message={errors?.rentalStatePreference} />
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <div className="w-1/2">
              <div className="flex flex-col gap-2.5">
                <Label>
                  Price: ${myPostPayload?.start_price} - $
                  {myPostPayload?.end_price}
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
              {errors?.start_price !== "0" && errors?.start_price && (
                <FormError message={errors?.start_price} />
              )}
              {errors?.end_price !== "0" && errors?.end_price && (
                <FormError message={errors?.end_price} />
              )}
            </div>
            {/* <div className="w-1/2">
              <div className="flex flex-col gap-2.5">
                <Label >Size: {myPostPayload?.start_size} sqm - {myPostPayload?.end_size} sqm</Label>
                <Slider
                  value={[Number(myPostPayload?.start_size), Number(myPostPayload?.end_size)]}
                  onValueChange={val => setMyPostPayload(prev => ({ ...prev, start_size: val[0].toString(), end_size: val[1].toString() }))}
                  min={0}
                  max={2000}
                  step={1}
                />
              </div>
              {errors?.start_size !== "0" && errors?.start_size && <FormError message={errors?.start_size} />}
              {errors?.end_size !== "0" && errors?.end_size && <FormError message={errors?.end_size} />}
            </div> */}
          </div>

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

          {/* **************************************************************************************** */}
          <div className="flex gap-4 w-full">
            <div className="w-1/4">
              <div className="flex flex-col gap-2.5 ">
                <Label>About You </Label>
                <Select
                  onValueChange={(val) => handleSelectChange("about_you", val)}
                  value={myPostPayload?.about_you}
                >
                  <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
                    <SelectValue placeholder="Select Your About You" />
                  </SelectTrigger>
                  <SelectContent>
                    {about_you?.map((item) => (
                      <SelectItem key={item?.id} value={item?.value}>
                        {item?.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors?.about_you && <FormError message={errors?.about_you} />}
            </div>
            <div className="w-1/4">
              <div className="flex flex-col gap-2.5 ">
                <Label>Employment Status </Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("employment_status", value)
                  }
                  value={myPostPayload?.employment_status}
                >
                  <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
                    <SelectValue placeholder="Select Your Employment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {employment_status?.map((status) => (
                      <SelectItem key={status?.id} value={status?.value}>
                        {status?.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors?.employment_status && (
                <FormError message={errors?.employment_status} />
              )}
            </div>

            <div className="w-1/4">
              <div className="flex flex-col gap-2.5 ">
                <Label>Pets </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("pets", value)}
                  value={myPostPayload?.pets}
                >
                  <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
                    <SelectValue placeholder="Select Your Pets" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets?.map((pet) => (
                      <SelectItem key={pet?.id} value={pet?.value}>
                        {pet?.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors?.pets && <FormError message={errors?.pets} />}
            </div>
            <div className="w-1/4">
              <div className="flex flex-col gap-2.5">
                <Label>Smoking Preference</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("smoking_preference", value)
                  }
                  value={myPostPayload?.smoking_preference}
                >
                  <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
                    <SelectValue placeholder="Select Your Smoking Preference" />
                  </SelectTrigger>
                  <SelectContent>
                    {smoking_preference?.map((item) => (
                      <SelectItem key={item?.id} value={item?.value}>
                        {item?.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors?.smoking_preference && (
                <FormError message={errors?.smoking_preference} />
              )}
            </div>
          </div>
          {/* **************************************************************************************** */}

          <div className="w-full flex flex-col gap-4 mt-3">
            <h4 className="font-semibold">Amenities</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex gap-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={myPostPayload?.amenities?.includes(amenity)}
                    value={amenity}
                    onChange={(e) => handleToggleAminities(amenity)}

                  />
                  <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                </div>
              ))} */}

              {!isMasterLoading &&
                amenities.length > 0 &&
                amenities.map(
                  (amenity: {
                    name: string;
                    slug: string;
                    description: string;
                    is_active: boolean;
                    _id: string;
                  }) => (
                    <AmenityItem
                      key={amenity._id}
                      amenity={amenity}
                      isChecked={myPostPayload?.amenities?.includes(
                        amenity.name,
                      )}
                      onToggle={handleToggleAminities}
                    />
                  ),
                )}

              {/* {!isMasterLoading && amenities.length > 0 && amenities.map((amenity: {
                name: string;
                slug: string;
                description: string;
                is_active: boolean
                _id: string;
              }, index: number) => (
                <div key={amenity._id} className="flex gap-2">
                  <Checkbox
                    id={amenity._id}
                    checked={myPostPayload?.amenities?.includes(amenity.name)}
                    value={amenity.name}
                    onChange={(e) => handleToggleAminities(amenity.name)}

                  />
                  <Label htmlFor={amenity._id}>{amenity.name}</Label>
                </div>
              ))} */}
            </div>
            {/* {errors?.amenities && <FormError message={errors?.amenities} />} */}
          </div>
        </div>
        <div className="flex gap-4 items-center justify-end mt-4">
          <Button className="rounded-full" onClick={handleClearAll}>
            Clear All
          </Button>
          <Button
            className="rounded-full"
            variant={"secondary"}
            onClick={handleSubmit}
            disabled={isPending || isUpdating}
          >
            {isPending || isUpdating ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CreatePost;
