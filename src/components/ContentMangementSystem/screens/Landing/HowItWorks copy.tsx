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
const HowItWorks = () => {
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

    <main className="w-full min-h-screen bg-background flex flex-col overflow-x-hidden animate-in fade-in duration-500">

      {/* Page Header Banner */}
      <section className="w-full relative bg-emerald-900 overflow-hidden py-24 md:py-32 px-4 flex items-center justify-center">
        {/* Abstract background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[150%] bg-emerald-800/30 blur-3xl rotate-12 rounded-[100%]" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[100%] bg-emerald-700/20 blur-3xl -rotate-12 rounded-[100%]" />
        </div>

        <div className="relative z-10 w-full max-w-[1548px] mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-8 lg:px-[100px]">
          {/* Left Text */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <h1 className="font-sans font-extrabold text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
              Discover <span className="text-emerald-400">FEATURED</span>
            </h1>
            <p className="font-sans text-lg md:text-xl text-emerald-50/80 leading-relaxed max-w-xl mt-4">
              Learn how RentMatch connects renters and landlords seamlessly, and explore our most exclusive properties.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex-1 w-full max-w-lg md:max-w-none relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
            <div className="relative w-full aspect-video md:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-emerald-700/50 group hover:shadow-emerald-900/50 transition-all duration-500">
              <img src={IMAGES.about_hero} alt="Featured Properties" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/20 to-transparent pointer-events-none" />
            </div>
            {/* Decorative background glow behind image */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl z-[-1]" />
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="w-full bg-white border-t border-slate-100 py-12 md:py-20">
        <PropertyTypeSection />
      </section>

      {/* Featured Listings Section */}
      <section className="w-full bg-slate-50 border-t border-slate-100 py-12 md:py-20 overflow-hidden">
        <FeaturedListingsSection />
      </section>

      {/* Services Section */}
      <section className="w-full bg-white border-t border-slate-100 py-12 md:py-20">
        <ServicesSection />
      </section>

      {/* Rental Plans Section */}
      <section className="w-full bg-slate-50 border-t border-slate-100 py-12 md:py-24">
        <RentalPlansSection />
      </section>
    </main>
  );
};
export default HowItWorks;
