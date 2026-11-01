import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ImageSliderSection } from "./ImageSliderSection/ImageSliderSection";
import { PropertyDetailsSection } from "./PropertyDetailsSection/PropertyDetailsSection";
import { ImageSection } from "./ImageSection/ImageSection";
import { ContentSection } from "./ContentSection/ContentSection";
import Slider from "react-slick";

const BannerSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Duration for each slide (in milliseconds)
  };
  return (
    <Slider {...settings}>
      <div>
        <div className="w-full flex">
          <ImageSliderSection />
          <PropertyDetailsSection />
        </div>
      </div>
      <div>
        <div className="w-full flex">
          <ContentSection />
          <ImageSection />
        </div>
      </div>
    </Slider>
  );
};

export default BannerSection;
