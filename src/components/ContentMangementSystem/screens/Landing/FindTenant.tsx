import React, { useEffect, useState } from "react";
import FooterSection from "./sections/FooterSection/FooterSection";
import ContactUsSection from "./sections/ContactUsSection/ContactUsSection";
import NavbarSection from "./sections/NavbarSection/NavbarSection";
import RentalPlansSection from "./sections/RentalPlansSection/RentalPlansSection";
import FAQsSection from "./sections/FAQsSection/FAQsSection";
import TestimonialsSection from "./sections/TestimonialsSection/TestimonialsSection";
import SearchTenant from "./sections/SearchTenant/SearchTenant";
import { IMAGES } from "../../../../assets/index";

// export const FindTenant = (): JSX.Element => {
const FindTenant = () => {

  return (
    <>
      <SearchTenant />

      <RentalPlansSection />

      {/* <TestimonialsSection />

      <FAQsSection />

      <ContactUsSection /> */}
    </>
  );
};
export default FindTenant;