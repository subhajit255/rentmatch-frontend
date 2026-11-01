import React, { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  MapPin,
  Search,
  Filter,
} from "lucide-react";
import { Input } from "../ui/input";
import Tenant from "../ChildComponent/Tenant";
import { IMAGES } from "../../assets/index";
import { useInView } from 'react-intersection-observer';
import { LandLordOrPM_SavePostList } from "../../actions/myPost";
import { useQuery } from "@tanstack/react-query";

function SavedTenentPost() {
  const [searchRef, inSearchView] = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.3, // Trigger when 10% of the image is visible
  });
  const [ref, inView] = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.3, // Trigger when 10% of the image is visible
  });

  const { data: savedPosts, isLoading } = useQuery({
    queryKey: ["saved-posts"],
    queryFn: () => LandLordOrPM_SavePostList(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  
  
  const postData: any[] = useMemo(() => {
    return isLoading ? [] : savedPosts?.result ?? [];
  }, [savedPosts])
  
  if (isLoading) return <div className="blur-md pointer-events-none">
    <div className="flex justify-center items-center flex-col">
        <img
          src={IMAGES.error}
          alt="No Properties"
          className="mb-4 w-[50%]"
        />
        <div className="text-2xl">
          <div className="relative mb-6">
            You did not saved any tenent's requirements posts !
          </div>
        </div>
      </div>
  </div>;

  if (postData && postData.length == 0) {
    return <div className="flex justify-center items-center mt-10">
      <div className="flex justify-center items-center flex-col">
        <img
          src={IMAGES.error}
          alt="No Properties"
          className="mb-4 w-[50%]"
        />
        <div className="text-2xl">
          <div className="relative mb-6">
            {/* <div className="absolute inset-0 animate-ping rounded-full bg-primary opacity-20"></div> */}
            {/* <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"> */}
            {/* <SearchX size={20} className="text-primary" strokeWidth={1.5} /> */}
            You did not saved any tenent's requirements posts !
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  }

  return (
    <div className="bg-accent py-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Filters */}
        {/* <div className={`rounded-lg mb-8 ${inSearchView ? 'animate__animated animate__slideInLeft' : ''}`} ref={searchRef}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <div className="relative">
                <Input
                  placeholder="Location"
                  className="pr-10 rounded-[99px] bg-white h-10"
                />
                <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <Select>
                <SelectTrigger className="w-full rounded-[99px] bg-white h-10">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select>
                <SelectTrigger className="w-full rounded-[99px] bg-white h-10">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-500">$0 - $500</SelectItem>
                  <SelectItem value="500-1000">$500 - $1000</SelectItem>
                  <SelectItem value="1000+">$1000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button className="bg-white hover:bg-blue-700 text-dark flex-1 rounded-[99px] h-10">
                Search advanced
                <Filter className="h-4 w-4 mr-2" />
              </Button>
              <Button
                variant="outline"
                className="px-4 bg-white hover:bg-blue-700 rounded-[99px] h-10"
              >
                Search
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div> */}
      </div>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${inView ? 'animate__animated animate__slideInUp' : ''}`} ref={ref}>
            {!isLoading && postData?.map((property: any) => (
              <Tenant
                id={property?.post_details?._id}
                user={{
                  name: `${property.post_details.created_by.first_name} ${property.post_details.created_by.last_name}`,
                  image: IMAGES.user_img,
                  gender: property.post_details.created_by.gender
                }}
                type={property.post_details.property_type.name || ''}
                location={property?.post_details?.location || ''}
                title={property?.post_details?.subject || ""}
                beds={property?.post_details?.bedrooms}
                baths={property?.post_details?.bathrooms}
                sqm={`${property?.post_details?.start_size} - ${property?.post_details?.end_size}`}
                postedDate={property?.post_details?.created_date}
                price={`${property?.post_details?.start_price} - ${property?.post_details?.end_price}`}
                isUrgent={true}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavedTenentPost