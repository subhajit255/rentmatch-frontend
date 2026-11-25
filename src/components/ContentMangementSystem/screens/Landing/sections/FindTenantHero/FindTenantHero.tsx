import React from "react";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FindTenantHero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-[#F0F4FA] py-14 sm:py-16 lg:py-20 relative overflow-hidden border-b border-slate-200/60">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline and intro */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <span className="inline-block px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-[#E8F8EE] text-[#0F7A4A] mb-5">
              TENANT MATCHING
            </span>
            <h1 className="font-sans font-extrabold text-[#1E3A8A] text-3xl sm:text-4xl lg:text-[48px] tracking-tight leading-[1.14] mb-5">
              Find renters who fit your property.
            </h1>
            <p className="font-sans text-[#64748B] text-base sm:text-lg leading-relaxed max-w-xl">
              Add your property and RentMatch shows suitable renter briefs, without exposing anyone's personal details.
            </p>
          </div>

          {/* Right Column: Sign in card */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white rounded-[26px] p-7 sm:p-9 shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-slate-100 max-w-md w-full mx-auto lg:ml-auto">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#1E40AF] flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-[#1E40AF]" />
                </div>
                <h3 className="font-sans font-bold text-[#0F172A] text-xl tracking-tight">
                  Sign in to find tenants
                </h3>
              </div>
              <p className="text-[#64748B] text-xs sm:text-[13px] leading-relaxed mb-6">
                Private landlords sign in with a landlord account. Real estate professionals need an approved Agency Account.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full py-3.5 px-6 rounded-full bg-[#0F7A4A] hover:bg-[#0c623b] text-white font-bold text-sm tracking-wide shadow-sm hover:shadow transition-all text-center"
                >
                  Continue as a private landlord
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("signup_role", "PROPERTY MANAGER");
                    navigate("/registration");
                  }}
                  className="w-full py-3.5 px-6 rounded-full border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-slate-50 font-bold text-sm tracking-wide transition-all text-center"
                >
                  Request a professional account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindTenantHero;

