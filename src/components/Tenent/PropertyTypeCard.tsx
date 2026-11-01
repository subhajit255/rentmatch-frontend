import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { IMAGES } from "../../assets/index";
import { useInView } from "react-intersection-observer";
import Icon from "../icons/icon";


const PropertyTypeCard = ({ propertyTypeCounts }: any) => {
  // console.log(propertyTypeCounts, "??????????????")
  const [ref, inView] = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.3, // Trigger when 10% of the image is visible
  });

  const propertyTypes = [
    {
      icon: IMAGES.apartment,
      title: "Apartment",
      count: "234 Property",
    },
    {
      icon: IMAGES.house,
      title: "House",
      count: "234 Property",
    },
    {
      icon: IMAGES.granny_flat,
      title: "Granny Flat",
      count: "234 Property",
    },
    {
      icon: IMAGES.duplex,
      title: "Duplex",
      count: "234 Property",
    },
    {
      icon: IMAGES.villa,
      title: "Villa",
      count: "234 Property",
    },
    {
      icon: IMAGES.office,
      title: "Office",
      count: "234 Property",
    },
  ];

  return (
    <div
      ref={ref}
      className={`flex-1 flex items-center w-full ${inView ? "animate__animated animate__slideInRight" : ""
        }`}
    >
      <div
        className={`w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4`}
      >
        {/* {propertyTypes.map((property, index) => (
          <Card
            key={index}
            className="w-full bg-white rounded-2xl border border-sidebar-ring hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardContent className="flex items-center justify-center gap-2 h-full px-2 py-5">
              <img
                className="w-12 h-12 md:w-10 md:h-10"
                alt={`${property.title} icon`}
                src={property.icon}
              />

              <div className="flex flex-col items-center justify-center gap-1">
                <div className="font-sans font-bold text-foreground sm:text-sm md:text-md text-center tracking-[0] leading-[25.2px]">
                  {property.title}
                </div>

                <div className="font-sans font-medium text-primary-foreground text-xs md:text-sm text-center tracking-[0] leading-[19.6px]">
                  {property.count}
                </div>
              </div>
            </CardContent>
          </Card>
        ))} */}

        {/* {propertyTypeCounts?.map((property: {
          count: number,
          name: string,
          slug: string,
          description: string,
          is_active: boolean,
          img: string,
        }, index: number) => (
          <Card
            key={index}
            className="w-full bg-white rounded-2xl border border-sidebar-ring hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardContent className="flex items-center justify-center gap-2 h-full px-2 py-5">
              <Icon name={property?.img as any || "Apartment"} className="w-12 h-12 md:w-10 md:h-10" color={"var(--primary)"} />
              
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="font-sans font-bold text-foreground sm:text-sm md:text-md text-center tracking-[0] leading-[25.2px]">
                  {property?.name}
                </div>

                <div className="font-sans font-medium text-primary-foreground text-xs md:text-sm text-center tracking-[0] leading-[19.6px]">
                  {property.count}
                </div>
              </div>
            </CardContent>
          </Card>
        ))} */}
      </div>
    </div>
  );
};
export default PropertyTypeCard;
