import React, { useState } from "react";
// import FooterSection from "./sections/FooterSection/FooterSection";
import ContactUsSection from "./sections/ContactUsSection/ContactUsSection";
import FeaturedListingsSection from "./sections/FeaturedListingsSection/FeaturedListingsSection";
// import NavbarSection from "./sections/NavbarSection/NavbarSection";
import RentalPlansSection from "./sections/RentalPlansSection/RentalPlansSection";
import FAQsSection from "./sections/FAQsSection/FAQsSection";
import ServicesSection from "./sections/ServicesSection/ServicesSection";
import TestimonialsSection from "./sections/TestimonialsSection/TestimonialsSection";
import SearchProperty from "./sections/SearchProperty/SearchProperty";
import { useQuery } from "@tanstack/react-query";
import { PropertyFilter } from "../../../../components/Tenent/ExploreProperties";
import { getAllProperty, getAllPropertyCMS } from "../../../../actions/property";
// import { IMAGES } from "../../../../assets/index";

const defaultFilter: PropertyFilter = {
  start_price: "",
  end_price: "0",
  start_size: "0",
  end_size: "0",
  garages: "",
  bathrooms: "",
  bedrooms: "",
  balcony: "",
  amenities: [],
  type: "",
  location: "",
  sort: "",
  search: "",
};

const FindProperty = () => {
  return (
    <main className="w-full min-h-screen bg-background flex flex-col overflow-x-hidden animate-in fade-in duration-500">
      {/* Search Section acts as the Hero */}
      <section className="w-full relative z-10">
        <SearchProperty />
      </section>

      {/* Alternating backgrounds for clear section distinction */}
      <section className="w-full bg-slate-50/50 border-t border-slate-100">
        <FeaturedListingsSection />
      </section>

      {/* <section className="w-full bg-white border-t border-slate-100">
        <ServicesSection />
      </section> */}

      {/* <section className="w-full bg-slate-50/50 border-t border-slate-100">
        <RentalPlansSection />
      </section> */}

      {/* <section className="w-full bg-white border-t border-slate-100">
        <TestimonialsSection />
      </section>

      <section className="w-full bg-slate-50/50 border-t border-slate-100">
        <FAQsSection />
      </section>

      <section className="w-full bg-white border-t border-slate-100">
        <ContactUsSection />
      </section> */}
    </main>
  );
};
export default FindProperty;
