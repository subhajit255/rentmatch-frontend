import React from "react";
import { Link } from "react-router-dom";
import { IMAGES } from "../../../../../../assets/index";

const FooterSection = () => {
  return (
    <footer className="w-full bg-[#F4F7FC] border-t border-slate-200/60 pt-16 pb-12 px-6 md:px-12 lg:px-20 text-foreground">
      <div className="max-w-[1548px] mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-8 pb-12">
          {/* Column 1: Brand & App Badges */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link to="/" className="inline-block mb-3">
              <span className="font-sans font-extrabold text-2xl sm:text-3xl text-primary tracking-tight">
                RentMatch
              </span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm mb-6 font-normal">
              One rental brief, clear match reasons, and private details until
              you choose to share them.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="#"
                className="inline-block transition-transform hover:scale-105"
              >
                <img
                  src={IMAGES.apple_store}
                  alt="Download on the App Store"
                  className="h-10 sm:h-11 w-auto object-contain"
                />
              </a>
              <a
                href="#"
                className="inline-block transition-transform hover:scale-105"
              >
                <img
                  src={IMAGES.play_store}
                  alt="Get it on Google Play"
                  className="h-10 sm:h-11 w-auto object-contain"
                />
              </a>
            </div>
          </div>

          {/* Column 2: For Renters */}
          <div className="lg:col-span-3 flex flex-col items-start lg:pl-6">
            <h4 className="font-sans font-bold text-base text-gray-900 mb-4">
              For renters
            </h4>
            <div className="flex flex-col gap-3">
              <Link
                to="/registration"
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                Create renter profile
              </Link>
              <Link
                to="/find-property"
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                Browse rentals
              </Link>
              <Link
                to="/advice"
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                Renting advice
              </Link>
            </div>
          </div>

          {/* Column 3: For Landlords and Agencies */}
          <div className="lg:col-span-3 flex flex-col items-start">
            <h4 className="font-sans font-bold text-base text-gray-900 mb-4">
              For landlords and agencies
            </h4>
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                List a property
              </Link>
              <Link
                to="/find-tenant"
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                Find tenants
              </Link>
              <Link
                to="/registration"
                onClick={() =>
                  localStorage.setItem("signup_role", "PROPERTY MANAGER")
                }
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                Request a professional account
              </Link>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <h4 className="font-sans font-bold text-base text-gray-900 mb-4">
              Contact
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:info@rentmatch.au"
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                info@rentmatch.au
              </a>
              <a
                href="tel:#"
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                [Support phone]
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="border-t border-slate-200/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-500">
          <div>© 2026 RentMatch. All rights reserved.</div>
          <div className="flex items-center gap-6 sm:gap-8">
            <Link
              to="/policy/privacy-policy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/policy/terms-and-conditions"
              className="hover:text-primary transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
