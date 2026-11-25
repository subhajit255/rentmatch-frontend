import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../../ui/button";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionPlanListCms } from "../../../../../../actions/cms/cmsPageApis";
import { Check } from "lucide-react";

const DEFAULT_LANDLORD_FEATURES = [
  "Full renter profiles",
  "Unlimited matches & Invitations",
  "Inspection scheduling",
  "Shortlisting",
];

const DEFAULT_AGENCY_FEATURES = [
  "All Landlord Connect features",
  "Team management & portal access",
  "Feed & listing integration tools",
  "Administrator review & approval",
];

const RentalPlansSection = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Query Landlord Plans
  const { data: landlordData, isLoading: isLoadingLandlord } = useQuery({
    queryKey: ["plans", "landlord"],
    queryFn: () => getSubscriptionPlanListCms("landlord"),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Query Agency / Property Manager Plans (try property-manager and property_manager)
  const { data: agencyData, isLoading: isLoadingAgency } = useQuery({
    queryKey: ["plans", "property-manager"],
    queryFn: async () => {
      try {
        const res = await getSubscriptionPlanListCms("property-manager");
        if (Array.isArray(res?.result) && res.result.length > 0) return res;
        return await getSubscriptionPlanListCms("property_manager");
      } catch {
        return await getSubscriptionPlanListCms("property_manager");
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const landlordPlan = Array.isArray(landlordData?.result) && landlordData.result.length > 0
    ? landlordData.result[0]
    : null;

  const agencyPlan = Array.isArray(agencyData?.result) && agencyData.result.length > 0
    ? agencyData.result[0]
    : null;

  const handleChooseLandlord = () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      navigate("/pricing-and-plans");
    } else {
      localStorage.setItem("signup_role", "LANDLORD");
      navigate("/email-verification");
    }
  };

  const handleRequestAgency = () => {
    localStorage.setItem("signup_role", "PROPERTY MANAGER");
    navigate("/registration");
  };

  // Helper to extract features from API response or fall back
  const extractFeatures = (plan: any, defaultList: string[]): string[] => {
    if (Array.isArray(plan?.features) && plan.features.length > 0) {
      const list = plan.features
        .map((f: any) => (typeof f === "string" ? f : f?.title || f?.name || ""))
        .filter(Boolean);
      if (list.length > 0) return list;
    }
    return defaultList;
  };

  // Helper to extract price
  const extractPrice = (plan: any, defaultPrice: string) => {
    if (plan?.price !== undefined && plan?.price !== null && plan?.price !== "") {
      const p = String(plan.price).trim();
      const num = /^\d+(\.\d+)?$/.test(p) ? `$${p}` : (p.startsWith("$") ? p : `$${p}`);
      const cycle = plan?.cycles_for_subscription || "month";
      const cycleText = cycle.toLowerCase().includes("month") ? "AUD per month" : `AUD per ${cycle.toLowerCase()}`;
      return { amount: num, cycle: cycleText };
    }
    return { amount: defaultPrice, cycle: "AUD per month" };
  };

  const landlordPriceInfo = extractPrice(landlordPlan, "$29");
  const agencyPriceInfo = extractPrice(agencyPlan, agencyPlan?.price ? `$${agencyPlan.price}` : "$99");

  const landlordFeatures = extractFeatures(landlordPlan, DEFAULT_LANDLORD_FEATURES);
  const agencyFeatures = extractFeatures(agencyPlan, DEFAULT_AGENCY_FEATURES);

  const landlordTitle = landlordPlan?.name || "Landlord Connect";
  const agencyTitle = agencyPlan?.name || "Agency Connect";

  const landlordDescription = landlordPlan?.description || "1 active property · unlimited matches and invitations · cancel anytime. GST: [confirm inclusion].";
  const agencyDescription = agencyPlan?.description || "Web portal only · needs register check and administrator approval · team and feed tools.";

  return (
    <section className="w-full relative px-4 md:px-8 lg:px-[100px] py-16 bg-[#f8fafc]">
      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header Area */}
        <header className="mb-12 text-center">
          <div className="flex flex-col gap-2 max-w-2xl mx-auto">
            <div className="font-sans font-semibold text-primary text-xs md:text-sm tracking-[0.1em] uppercase">
              PLANS FOR LANDLORD & REAL ESTATE PROFESSIONAL
            </div>
            <h2 className="font-sans font-extrabold text-slate-900 text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
              Choose Your Right Plan
            </h2>
          </div>
        </header>

        {/* 2 Plans Side by Side */}
        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto ${
            inView
              ? "animate-in fade-in slide-in-from-bottom-6 duration-700"
              : "opacity-0"
          }`}
        >
          {/* Card 1: Landlord Connect */}
          <div className="bg-white rounded-[24px] p-8 md:p-10 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
            <div>
              <h3 className="font-sans font-bold text-[#1E3A8A] text-2xl md:text-3xl mb-4">
                {landlordTitle}
              </h3>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-sans font-extrabold text-slate-900 text-4xl md:text-5xl tracking-tight">
                  {landlordPriceInfo.amount}
                </span>
                <span className="font-sans font-medium text-slate-600 text-sm md:text-base">
                  {landlordPriceInfo.cycle}
                </span>
              </div>

              <p className="font-sans text-slate-600 text-sm md:text-[15px] leading-relaxed mb-6">
                {landlordDescription}
              </p>

              {/* API Features */}
              <div className="flex flex-col gap-3 mb-8">
                {landlordFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span className="font-sans text-slate-600 text-sm font-medium leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="button"
              onClick={handleChooseLandlord}
              className="w-full h-12 md:h-13 rounded-full font-sans font-semibold text-sm md:text-base bg-[#2B52BA] hover:bg-[#203E94] text-white shadow-sm transition-all"
            >
              Choose Landlord Connect
            </Button>
          </div>

          {/* Card 2: Agency Connect */}
          <div className="bg-white rounded-[24px] p-8 md:p-10 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
            <div>
              <h3 className="font-sans font-bold text-[#1E3A8A] text-2xl md:text-3xl mb-4">
                {agencyTitle}
              </h3>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-sans font-extrabold text-slate-900 text-4xl md:text-5xl tracking-tight">
                  {agencyPriceInfo.amount}
                </span>
                <span className="font-sans font-medium text-slate-600 text-sm md:text-base">
                  {agencyPriceInfo.cycle}
                </span>
              </div>

              <p className="font-sans text-slate-600 text-sm md:text-[15px] leading-relaxed mb-6">
                {agencyDescription}
              </p>

              {/* API Features */}
              <div className="flex flex-col gap-3 mb-8">
                {agencyFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span className="font-sans text-slate-600 text-sm font-medium leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="button"
              onClick={handleRequestAgency}
              variant="outline"
              className="w-full h-12 md:h-13 rounded-full font-sans font-semibold text-sm md:text-base border-2 border-[#2B52BA] text-[#2B52BA] hover:bg-[#2B52BA]/5 transition-all"
            >
              Request an account
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RentalPlansSection;
