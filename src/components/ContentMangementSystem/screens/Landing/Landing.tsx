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
  FileText
} from "lucide-react";
import FAQsSection from "./sections/FAQsSection/FAQsSection";
import TestimonialsSection from "./sections/TestimonialsSection/TestimonialsSection";
import ContactUsSection from "./sections/ContactUsSection/ContactUsSection";

const Landing = () => {
  return (
    <div className="w-full bg-white text-foreground">
      {/* 1. Hero / Banner Section */}
      <section className="relative w-full max-w-[1548px] mx-auto px-4 md:px-8 lg:px-[100px] py-12 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden">
        {/* Left Content */}
        <div className="flex-1 flex flex-col items-start text-left max-w-2xl">
          {/* Australia Smarter Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 text-sm font-semibold rounded-full border border-emerald-100 shadow-sm mb-6">
            <span role="img" aria-label="Australia Flag" className="text-base">🇦🇺</span>
            AUSTRALIA'S SMARTER RENTAL MATCHING PLATFORM
          </div>

          <h1 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl text-primary tracking-tight leading-[1.1] mb-6">
            Renting, <span className="text-emerald-600 font-sans">reimagined.</span>
          </h1>

          <p className="font-sans text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
            Australia's smarter platform built on one rental brief, transparent matching,
            tenant-controlled privacy, and approved professional access.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
            <Link to="/registration">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base px-8 py-6 rounded-full inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-200 transition-all duration-300 w-full sm:w-auto">
                Create Rental Brief <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-2 border-foreground hover:bg-accent text-foreground font-semibold text-base px-8 py-6 rounded-full inline-flex items-center justify-center gap-2 transition-all duration-300 w-full sm:w-auto">
                Find a Tenant <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* See how it works link */}
          {/* <a href="#works" className="inline-flex items-center gap-3 text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-all">
            <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-emerald-100 bg-emerald-50 text-emerald-600">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </span>
            See how it works
          </a> */}
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
          <div className="absolute top-4 right-[2%] w-[260px] md:w-[300px] p-4 bg-white/90 backdrop-blur-md border border-white/20 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex items-center gap-3 animate-bounce-slow">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 flex-shrink-0">
              <Home className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm md:text-base">3 new matches</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Now</span>
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">Homes matched to your rental brief</p>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
          </div>

          {/* Overlapping Card 2: Tenant-Controlled Privacy & Approved Match */}
          <div className="absolute bottom-8 right-[-5%] w-[260px] md:w-[340px] p-4 bg-white/90 backdrop-blur-md border border-white/20 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex items-center gap-3 animate-bounce-slow animate-delay-1500">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 flex-shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm md:text-base">Tenant-controlled</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Protected</span>
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">Approved professional access only</p>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 flex-shrink-0" />
          </div>
        </div>
      </section>

      {/* 2. Choose your journey Section */}
      <section className="w-full bg-slate-50 py-20 px-4 md:px-8 lg:px-[100px]">
        <div className="max-w-[1548px] mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-sans font-extrabold text-4xl text-primary mb-4">Choose your journey</h2>
            <p className="text-lg text-muted-foreground">Transparent matching with complete privacy for renters and approved access for property professionals.</p>
          </div>

          {/* Grid Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* For Renters Card */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-stretch justify-between gap-8 group hover:shadow-xl transition-all duration-300">
              {/* Left text column */}
              <div className="flex-1 flex flex-col justify-between items-start">
                <div>
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="font-sans font-extrabold text-2xl text-primary mb-2">For Renters</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    Create one rental brief and connect on your terms without exposing your identity publicly.
                  </p>

                  {/* Bullet List */}
                  <ul className="space-y-3 mb-8">
                    {[
                      "One rental brief across all matches",
                      "Transparent matching on clear criteria",
                      "Tenant-controlled privacy at every stage",
                      "Zero public identity exposure"
                    ].map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-gray-700 text-sm">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to="/registration" className="font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-2 hover:underline transition-all">
                  Create Rental Brief <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Right image column */}
              <div className="w-full md:w-[220px] aspect-[0.9] rounded-2xl overflow-hidden border border-gray-50 flex-shrink-0">
                <img
                  src={IMAGES.about_renters}
                  alt="Renter reviewing rental brief"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* For Landlords Card */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-stretch justify-between gap-8 group hover:shadow-xl transition-all duration-300">
              {/* Left text column */}
              <div className="flex-1 flex flex-col justify-between items-start">
                <div>
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-sans font-extrabold text-2xl text-primary mb-2">For Landlords & Managers</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    Approved professional access to qualified rental briefs searching for homes like yours.
                  </p>

                  {/* Bullet List */}
                  <ul className="space-y-3 mb-8">
                    {[
                      "Approved professional access",
                      "Transparent matching with qualified criteria",
                      "Direct contact once renters approve",
                      "Organised shortlists without public listings"
                    ].map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-gray-700 text-sm">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-2 hover:underline transition-all">
                  Find a Tenant <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Right image column */}
              <div className="w-full md:w-[220px] aspect-[0.9] rounded-2xl overflow-hidden border border-gray-50 flex-shrink-0">
                <img
                  src={IMAGES.about_landlords}
                  alt="Property manager on laptop"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How RentMatch works Section */}
      <section id="works" className="w-full py-20 px-4 md:px-8 lg:px-[100px]">
        <div className="max-w-[1548px] mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-sans font-extrabold text-4xl text-primary">How RentMatch works</h2>
          </div>

          {/* Three steps */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Visual connector line (large screens) */}
            <div className="hidden md:block absolute top-[50px] left-[15%] right-[15%] h-[1.5px] border-t-2 border-dashed border-gray-200 z-0" />

            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center z-10">
              <div className="relative w-24 h-24 rounded-full bg-emerald-50 border-[2px] border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-md shadow-emerald-50">
                <FileText className="w-10 h-10" />
                <span className="absolute -top-1.5 -left-1.5 w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                  1
                </span>
              </div>
              <h3 className="font-sans font-bold text-xl text-primary mb-2">One rental brief</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[240px]">
                Create your brief once with your budget, preferences and household needs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center z-10">
              <div className="relative w-24 h-24 rounded-full bg-emerald-50 border-[2px] border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-md shadow-emerald-50">
                <Search className="w-10 h-10" />
                <span className="absolute -top-1.5 -left-1.5 w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                  2
                </span>
              </div>
              <h3 className="font-sans font-bold text-xl text-primary mb-2">Transparent matching</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[240px]">
                Match based on clear, upfront criteria connecting the right people and properties.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center z-10">
              <div className="relative w-24 h-24 rounded-full bg-emerald-50 border-[2px] border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-md shadow-emerald-50">
                <Lock className="w-10 h-10" />
                <span className="absolute -top-1.5 -left-1.5 w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                  3
                </span>
              </div>
              <h3 className="font-sans font-bold text-xl text-primary mb-2">Tenant-controlled privacy</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[240px]">
                Your identity stays private until you choose to connect with approved professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom Features Strip */}
      <section className="w-full px-4 md:px-8 lg:px-[100px] pb-20">
        <div className="max-w-[1548px] mx-auto bg-sky-50/50 rounded-[2.5rem] py-10 px-8 border border-sky-100/50 shadow-[0_15px_30px_rgba(15,23,42,0.01)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 lg:divide-x divide-sky-100/80">
            {/* Feature 1 */}
            <div className="flex items-start gap-4 lg:px-4 sm:pt-0">
              <div className="w-10 h-10 rounded-full bg-sky-100/80 text-sky-700 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-base text-primary mb-1">One Rental Brief</h4>
                <p className="text-muted-foreground text-xs leading-normal">
                  Complete your requirements once — no repetitive application forms.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 pt-6 sm:pt-0 lg:px-8">
              <div className="w-10 h-10 rounded-full bg-sky-100/80 text-sky-700 flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-base text-primary mb-1">Transparent Matching</h4>
                <p className="text-muted-foreground text-xs leading-normal">
                  Clear, upfront criteria connecting renters and suitable homes.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4 pt-6 sm:pt-0 lg:px-8">
              <div className="w-10 h-10 rounded-full bg-sky-100/80 text-sky-700 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-base text-primary mb-1">Tenant-Controlled Privacy</h4>
                <p className="text-muted-foreground text-xs leading-normal">
                  Your identity is never public. You decide who sees your brief.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-4 pt-6 sm:pt-0 lg:px-8">
              <div className="w-10 h-10 rounded-full bg-sky-100/80 text-sky-700 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-base text-primary mb-1">Approved Professional Access</h4>
                <p className="text-muted-foreground text-xs leading-normal">
                  Only vetted property managers and landlords can connect.
                </p>
              </div>
            </div>

          </div>
        </div>
        <TestimonialsSection />
        {/* <FAQsSection /> */}
        <ContactUsSection />
      </section>
    </div>
  );
};

export default Landing;
