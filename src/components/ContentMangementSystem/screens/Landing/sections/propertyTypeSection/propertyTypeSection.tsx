import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../../../../ui/card";
import { IMAGES } from "../../../../../../assets/index";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import { getProprtyTypeList } from "../../../../../../actions/cms/cmsPageApis";
// import Icon from "@/src/components/icons/icon";
// import Icon from "../../../../../../components/icons/icon";

// const propertyTypes = [
//     {
//       icon: IMAGES.apartment,
//       title: "Apartment",
//       count: "234 Property",
//     },
//     {
//       icon: IMAGES.house,
//       title: "House",
//       count: "234 Property",
//     },
//     {
//       icon: IMAGES.granny_flat,
//       title: "Granny Flat",
//       count: "234 Property",
//     },
//     {
//       icon: IMAGES.duplex,
//       title: "Duplex",
//       count: "234 Property",
//     },
//     {
//       icon: IMAGES.villa,
//       title: "Villa",
//       count: "234 Property",
//     },
//     {
//       icon: IMAGES.office,
//       title: "Office",
//       count: "234 Property",
//     },
//   ];
  
const PropertyTypeSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.3, // Trigger when 10% of the image is visible
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["property-type"],
    queryFn: () => getProprtyTypeList(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // console.log(data?.result, "<---data propertytype");

  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-10">
        <div className="flex items-center gap-3 text-black">
          {/* <Icon name="Loader" className="w-6 h-6 animate-spin" fill="#000000" /> */}
          <span>Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <section className="w-full flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 py-8 px-4">
      <div className="flex flex-col items-center lg:items-start gap-1 text-center lg:text-left">
        <div className="font-sans font-semibold text-primary text-base tracking-[1.44px] leading-6 whitespace-nowrap">
          PROPERTY TYPE
        </div>

        <h2 className="font-heading-heading-03 font-[number:var(--heading-heading-03-font-weight)] text-foreground text-[length:var(--heading-heading-03-font-size)] tracking-[var(--heading-heading-03-letter-spacing)] leading-[var(--heading-heading-03-line-height)] [font-style:var(--heading-heading-03-font-style)]">
          Available
          <br />
          Properties
        </h2>
      </div>

      <div
        ref={ref}
        className={`flex-1 flex items-center w-full ${inView ? "animate__animated animate__slideInRight" : ""}`}
      >
        <div
          className={`w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 `}
        >
          {/* _____DYNAMIC DATA __________ */}
          {data?.result.map(
            (
              property: { name: string; icon: string; img: string },
              index: React.Key | null | undefined,
            ) => (
              <Card
                key={index}
                className="w-full aspect-square bg-white rounded-2xl border border-sidebar-ring hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardContent className="flex flex-col items-center justify-center gap-2 md:gap-3 sm:p-4 md:pt-[30px] md:pb-6 md:px-6 h-full">
                  <img
                    className={`${
                      property?.name === "House"
                        ? "sm:w-12 sm:h-12 md:w-[74px] md:h-[74px]"
                        : "sm:w-12 sm:h-12 md:w-20 md:h-20"
                    }`}
                    alt={`${property?.name} icon`}
                    src={IMAGES[property?.img.toLowerCase() as keyof typeof IMAGES] || IMAGES.house}
                  />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="font-sans font-bold text-foreground text-sm md:text-lg text-center tracking-[0] leading-[25.2px]">
                      {property?.name}
                    </div>

                    {/* <div className="font-sans font-medium text-primary-foreground text-xs md:text-sm text-center tracking-[0] leading-[19.6px]">
                    50
                  </div> */}
                  </div>
                </CardContent>
              </Card>
            ),
          )}
        </div>
      </div>
    </section>
  );
};
export default PropertyTypeSection;
