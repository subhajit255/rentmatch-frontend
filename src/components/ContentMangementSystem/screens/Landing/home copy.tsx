import React, { useEffect, useState } from "react";
import FooterSection from "./sections/FooterSection/FooterSection";
import ContactUsSection from "./sections/ContactUsSection/ContactUsSection";
import FeaturedListingsSection from "./sections/FeaturedListingsSection/FeaturedListingsSection";
import NavbarSection from "./sections/NavbarSection/NavbarSection";
import RentalPlansSection from "./sections/RentalPlansSection/RentalPlansSection";
import FAQsSection from "./sections/FAQsSection/FAQsSection";
import ServicesSection from "./sections/ServicesSection/ServicesSection";
import TestimonialsSection from "./sections/TestimonialsSection/TestimonialsSection";
import BannerSection from "./sections/BannerSection/BannerSection";
import { IMAGES } from "../../../../assets/index";
import PropertyTypeSection from "./sections/propertyTypeSection/propertyTypeSection";

// export const Landing = (): JSX.Element => {
const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setIsVisible(scrolled > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    // <div className="w-full bg-background common-container">
    //   <NavbarSection />
    <>
      <BannerSection />

      <PropertyTypeSection />

      <FeaturedListingsSection />

      <ServicesSection />

      <RentalPlansSection />

      <TestimonialsSection />

      <FAQsSection />

      <ContactUsSection />
    </>
    //   <FooterSection />
    //   <div
    //     className={`go-top ${isVisible ? "active" : ""}`}
    //     onClick={scrollToTop}
    //   >
    //     <img
    //       src={IMAGES.up_arrow}
    //       width="50%"
    //       style={{ marginTop: "9px", marginLeft: "9px" }}
    //       alt="Scroll to top"
    //     />
    //   </div>
    // </div>
  );
};
export default Landing;
