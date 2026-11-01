import { ArrowRightIcon } from "lucide-react";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from "../../../../../ui/button";
import Property from "../../../../../ChildComponent/Property";
import { IMAGES } from "../../../../../../assets/index";
import { useInView } from "react-intersection-observer";
import Slider from "react-slick";
import { useQuery } from "@tanstack/react-query";
import { getProprtyFeatured } from "../../../../../../actions/cms/cmsPageApis";
import { PropertyResult } from "../../../../../../types/property";

// const propertyListings = [
//   {
//     id: 1,
//     image: IMAGES.villa_image,
//     type: "House",
//     status: "For Rent",
//     location: "Califonia, New York",
//     title: "Casa Lomas de Machalí Machas",
//     beds: 4,
//     baths: 2,
//     sqm: 1150,
//     postedDate: "16 Aug 2025",
//     price: "$7250,00",
//   },
//   {
//     id: 2,
//     image: IMAGES.villa_image,
//     type: "Office",
//     status: "For Rent",
//     location: "Califonia, New York",
//     title: "Casa Lomas de Machalí Machas",
//     beds: 4,
//     baths: 2,
//     sqm: 1150,
//     postedDate: "16 Aug 2025",
//     price: "$7250,00",
//   },
//   {
//     id: 3,
//     image: IMAGES.villa_image,
//     type: "Villa",
//     status: "For Rent",
//     location: "Califonia, New York",
//     title: "Casa Lomas de Machalí Machas",
//     beds: 4,
//     baths: 2,
//     sqm: 1150,
//     postedDate: "16 Aug 2025",
//     price: "$7250,00",
//   },
//   {
//     id: 4,
//     image: IMAGES.villa_image,
//     type: "Appartment",
//     status: "For Rent",
//     location: "Califonia, New York",
//     title: "Casa Lomas de Machalí Machas",
//     beds: 4,
//     baths: 2,
//     sqm: 1150,
//     postedDate: "16 Aug 2025",
//     price: "$7250,00",
//   },
//   {
//     id: 4,
//     image: IMAGES.villa_image,
//     type: "Appartment",
//     status: "For Rent",
//     location: "Califonia, New York",
//     title: "Casa Lomas de Machalí Machas",
//     beds: 4,
//     baths: 2,
//     sqm: 1150,
//     postedDate: "16 Aug 2025",
//     price: "$7250,00",
//   },
// ];

const FeaturedListingsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.3, // Trigger when 10% of the image is visible
  });

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Duration for each slide (in milliseconds)
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // ___CALLING API LOGICS ________
  const { data, isLoading, isError } = useQuery({
    queryKey: ["property-featured"],
    queryFn: () => getProprtyFeatured(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  // console.log(data, "<----data ?");
  return (
    <>
      {!isLoading &&
      !isError &&
      data &&
      data?.result &&
      data?.result.length > 0 ? (
        <section className="w-full bg-accent py-8 md:py-[52px] relative">
          <div className="max-w-[1733px] mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8 md:mb-[62px]">
              <div className="flex flex-col gap-1">
                <div className="font-sans font-semibold text-primary text-lg tracking-[1.44px] leading-6">
                  FEATURED PROPERTIES
                </div>
                <h2 className="font-sans font-extrabold text-foreground text-2xl md:text-4xl tracking-[0] leading-tight md:leading-[44px] max-w-[1341px]">
                  Discover some of our most popular rental listings
                </h2>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-[99px] px-6 md:px-10 py-[11px] h-[52px] gap-2 w-full md:w-auto">
                <span className="font-sans font-semibold text-base">
                  View All
                </span>
                <ArrowRightIcon className="w-6 h-6" />
              </Button>
            </div>
            <div
              ref={ref}
              className={`grid grid-cols-1 gap-4 md:gap-6 mb-8 md:mb-[52px] ${inView ? "animate__animated animate__slideInUp" : ""}`}
            >
              <Slider {...settings}>
                {data?.result?.map(
                  (property: PropertyResult) => (
                    <div key={property._id} className="px-2">
                      <Property
                        id={property?.property_id || 0}
                        image={IMAGES.villa_image}
                        type={property.property_details?.basic?.property_type_id?.name || "House"}
                        status={"For Rent"}
                        location={property.property_details?.basic?.full_address || "Califonia, New York"}
                        title={property.property_details?.basic?.property_name || "Not Available"}
                        beds={Number(property.property_details?.features?.no_of_bedrooms) || 0}
                        baths={Number(property.property_details?.features?.no_of_bathrooms) || 0}
                        sqm={property.property_details?.features?.land_size || 0}
                        postedDate={property.property_details?.rent_details?.available_from || new Date()}
                        price={property.property_details?.rent_details?.weekly_rent_price || "000,00"}
                      />
                    </div>
                  ),
                )}
              </Slider>
            </div>
          </div>
        </section>
      ) : (
        <div className="text-center py-8">No featured properties available</div>
      )}
    </>
  );
};
export default FeaturedListingsSection;
