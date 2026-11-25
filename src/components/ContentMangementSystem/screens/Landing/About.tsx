import React from "react";
import { Link } from "react-router-dom";
import { IMAGES } from "../../../../assets";
import { Button } from "../../../ui/button";
import {
  Play,
  ArrowRight,
  Check,
  User,
  Home,
  Search,
  MessageSquare,
  ShieldCheck,
  Lock,
  MapPin,
  FileText,
} from "lucide-react";

const trustFeatures = [
  {
    title: "Clear match reasons",
    subtitle: "See why each property fits",
  },
  {
    title: "Consent first",
    subtitle: "Nothing shared before you approve",
  },
  {
    title: "Verified professionals",
    subtitle: "Agency access needs approval",
  },
  {
    title: "Accessibility matching",
    subtitle: "Essential needs become filters",
  },
];

const About = () => {
  return (
    <div className="w-full bg-white text-foreground">
      {/* 1. Hero / Banner Section */}
      <section className="relative w-full max-w-[1548px] mx-auto px-4 md:px-8 lg:px-[100px] pt-12 md:pt-16 pb-8 md:pb-12 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden">
        {/* Left Content */}
        <div className="flex-1 flex flex-col items-start text-left max-w-2xl">
          {/* Australia Smarter Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 text-sm font-semibold rounded-full border border-emerald-100 shadow-sm mb-6">
            {/* <span role="img" aria-label="Australia Flag" className="text-base">
              🇦🇺
            </span> */}
            SMARTER RENTAL MATCHING FOR AUSTRALIA
          </div>

          <h1 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl text-primary tracking-tight leading-[1.1] mb-6">
            Renting,{" "}
            <span className="text-emerald-600 font-sans">reimagined.</span>
          </h1>

          <p className="font-sans text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
            Post your rental needs once. Get matched with suitable homes,
            private landlords and approved Real Estate professionals, with clear
            reasons for every match.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
            <Link to="/registration">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base px-8 py-6 rounded-full inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-200 transition-all duration-300 w-full sm:w-auto">
                Create Rental Profile <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                className="border-2 border-foreground hover:bg-accent text-foreground font-semibold text-base px-8 py-6 rounded-full inline-flex items-center justify-center gap-2 transition-all duration-300 w-full sm:w-auto"
              >
                List a Property
                {/* <ArrowRight className="w-5 h-5" /> */}
              </Button>
            </Link>
          </div>

          {/* See how it works link */}
          <a
            href="#works"
            className="inline-flex items-center gap-3 text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-all"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-emerald-100 bg-emerald-50 text-emerald-600">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </span>
            See how it works
          </a>
        </div>

        {/* Right Visual Image & Overlapping Cards */}
        <div className="flex-1 relative w-full max-w-[650px] aspect-[1.1] flex items-center justify-center">
          {/* Main Visual Image container */}
          <div className="relative w-[90%] h-[90%] rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100">
            <img
              src={IMAGES.about_hero}
              alt="Cozy living room with renters and landlords matching"
              className="w-full h-full object-cover"
            />
            {/* Soft gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          </div>

          {/* Overlapping Card 1: 3 new matches */}
          <div className="absolute top-[-8px] sm:top-[-12px] right-[-2%] sm:right-[-4%] w-[260px] md:w-[300px] p-4 bg-white/90 backdrop-blur-md border border-white/20 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex items-center gap-3 animate-bounce-slow">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 flex-shrink-0">
              <Home className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm md:text-base">
                  3 new matches
                </span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  Now
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                Homes matched to your rental brief
              </p>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
          </div>

          {/* Overlapping Card 2: Tenant-Controlled Privacy & Approved Match */}
          <div className="absolute bottom-[-8px] sm:bottom-[-12px] left-[-2%] sm:left-[-4%] w-[260px] md:w-[340px] p-4 bg-white/90 backdrop-blur-md border border-white/20 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex items-center gap-3 animate-bounce-slow animate-delay-1500">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 flex-shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm md:text-base">
                  Identity stays private
                </span>
                {/* <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  Protected
                </span> */}
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                You choose what to share
              </p>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 flex-shrink-0" />
          </div>
        </div>
      </section>

      {/* Trust Highlights Strip */}
      <section className="w-full max-w-[1548px] mx-auto px-4 md:px-8 lg:px-[100px] pb-14 md:pb-16">
        <div className="w-full bg-[#F0F4FC] rounded-[1.75rem] py-6 px-6 md:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-center">
            {trustFeatures.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm md:text-[15px] text-primary leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Choose your journey Section */}
      <section className="w-full bg-slate-50 py-20 px-4 md:px-8 lg:px-[100px]">
        <div className="max-w-[1548px] mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-sans font-extrabold text-4xl text-primary mb-4">
              Choose your journey
            </h2>
            <p className="text-lg text-muted-foreground">
              Three Clear Paths, One connected platform.
            </p>
          </div>

          {/* Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: For Renters */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full group hover:shadow-xl transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 font-bold text-lg flex items-center justify-center mb-6">
                  1
                </div>
                <h3 className="font-sans font-extrabold text-2xl text-primary mb-3">
                  For Renters
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  Create one private rental brief and get matched with suitable
                  homes.
                </p>

                {/* Bullet List */}
                <ul className="space-y-4 mb-10">
                  {[
                    "Move-in date range",
                    "Accessibility needs",
                    "Identity stays private",
                  ].map((bullet, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-gray-700 text-sm"
                    >
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                      <span className="font-medium text-gray-700">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/registration"
                onClick={() => localStorage.setItem("signup_role", "TENANT")}
                className="w-full"
              >
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base py-6 rounded-full inline-flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-200 transition-all duration-300">
                  Create renter profile <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Card 2: For Private Landlords */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full group hover:shadow-xl transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 font-bold text-lg flex items-center justify-center mb-6">
                  2
                </div>
                <h3 className="font-sans font-extrabold text-2xl text-primary mb-3">
                  For Private Landlords
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  List a rental and invite privacy-safe tenant matches.
                </p>

                {/* Bullet List */}
                <ul className="space-y-4 mb-10">
                  {[
                    "Property setup wizard",
                    "Transparent match reasons",
                    "Chat, block and report",
                  ].map((bullet, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-gray-700 text-sm"
                    >
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                      <span className="font-medium text-gray-700">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/registration"
                onClick={() => localStorage.setItem("signup_role", "LANDLORD")}
                className="w-full"
              >
                <Button className="w-full bg-[#2f499e] hover:bg-[#253b82] text-white font-semibold text-base py-6 rounded-full inline-flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-200 transition-all duration-300">
                  List a property <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Card 3: For Real Estate Professionals */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full group hover:shadow-xl transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 font-bold text-lg flex items-center justify-center mb-6">
                  3
                </div>
                <h3 className="font-sans font-extrabold text-2xl text-primary mb-3">
                  For Real Estate Professionals
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  Request an Agency Account for portfolio and team access.
                </p>

                {/* Bullet List */}
                <ul className="space-y-4 mb-10">
                  {[
                    "State register check",
                    "Administrator approval",
                    "Web portal only",
                  ].map((bullet, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-gray-700 text-sm"
                    >
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                      <span className="font-medium text-gray-700">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/registration"
                onClick={() =>
                  localStorage.setItem("signup_role", "PROPERTY MANAGER")
                }
                className="w-full"
              >
                <Button className="w-full bg-[#2f499e] hover:bg-[#253b82] text-white font-semibold text-base py-6 rounded-full inline-flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-200 transition-all duration-300">
                  Request an account <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How RentMatch works Section */}
      <section id="works" className="w-full py-20 px-4 md:px-8 lg:px-[100px] bg-white">
        <div className="max-w-[1548px] mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-primary mb-3">
              How RentMatch works
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-medium">
              Three steps from brief to inspection.
            </p>
          </div>

          {/* Three steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16 md:mb-20 text-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#EBF7F0] text-[#16A34A] flex items-center justify-center font-bold text-xl mb-6 shadow-sm">
                1
              </div>
              <h3 className="font-sans font-bold text-xl text-primary mb-3">
                Create the right profile
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                Renters post a brief, private landlords list a home, and professionals request an Agency Account.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#EBF7F0] text-[#16A34A] flex items-center justify-center font-bold text-xl mb-6 shadow-sm">
                2
              </div>
              <h3 className="font-sans font-bold text-xl text-primary mb-3">
                Understand every match
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                See the percentage, the criteria that line up, and any preferences that are not met.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#EBF7F0] text-[#16A34A] flex items-center justify-center font-bold text-xl mb-6 shadow-sm">
                3
              </div>
              <h3 className="font-sans font-bold text-xl text-primary mb-3">
                Connect with control
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                A renter accepts an invitation before identity details unlock. Chat safety controls are always available.
              </p>
            </div>
          </div>

          {/* Privacy CTA Banner */}
          <div className="bg-[#2B4C9B] rounded-[2rem] p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
            <div className="max-w-2xl">
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-snug">
                Your details stay private until you say yes.
              </h3>
              <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed mt-2.5">
                Providers see an alias and your brief. Your name, photo and contact channel unlock only when you accept an invitation.
              </p>
            </div>
            <Link to="/registration" className="flex-shrink-0 w-full sm:w-auto">
              <Button className="bg-[#F8CA44] hover:bg-[#eab308] text-slate-900 font-bold text-base px-8 py-6 rounded-full inline-flex items-center justify-center gap-2 shadow-lg transition-all duration-300 w-full sm:w-auto">
                Get started <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
