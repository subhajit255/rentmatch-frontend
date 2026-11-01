import React from "react";
import { Button } from "../../../../../../ui/button";
import { IMAGES } from "../../../../../../../assets/index";
import { priceFormat } from "../../../../../../../lib/utils";

export const PropertyDetailsSection = () => {
  const propertyData = {
    title: "Modern Apartment",
    location: "Downtown Area",
    price: `$${priceFormat("2,500")}`,
    period: "/month",
    features: ["2 Bed", "2 Bath", "1,200 sq ft"],
    images: ["/group-23.png", "/group-24.png", "/group-25.png"],
  };

  return (
    <section className="w-full max-w-[659px] h-auto relative bg-accent">
      <div className="relative flex flex-col items-center justify-center min-h-[587px]">
        <div className="relative w-full max-w-[602px] flex flex-col items-center">
          <div className="relative w-full max-w-[576px] -mt-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[484px] h-[529px]">
                <img
                  className="absolute inset-0 w-full h-full object-contain"
                  alt=""
                  src={IMAGES.object}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
