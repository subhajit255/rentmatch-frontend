import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../../ui/button";
import { Card, CardContent } from "../../../../../ui/card";
import { IMAGES } from "../../../../../../assets/index";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../../../../ui/tabs";
import { getSubscriptionPlanListCms } from "../../../../../../actions/cms/cmsPageApis";

import { Check, Sparkles } from "lucide-react";

// Type definitions for the plan
type Plan = {
  price: string;
  cycles_for_subscription: string;
  name: string;
  description: string;
  features: { title: string; _id: string }[];
  buttonStyle?: string;
  icons?: string[];
};

const PlanCard = ({ plan, index, inView, refObj, onBuy }: { plan: Plan; index: number; inView: boolean; refObj: any; onBuy: () => void }) => {
  const isPopular = plan.buttonStyle === "filled";
  
  return (
    <Card
      ref={refObj}
      className={`relative bg-white rounded-[2rem] border-2 transition-all duration-500 flex flex-col h-full ${
        isPopular 
          ? "border-primary shadow-xl shadow-primary/10 lg:scale-105 z-10" 
          : "border-slate-100 shadow-md hover:shadow-xl"
      } ${
        inView 
          ? "animate-in fade-in slide-in-from-bottom-8 duration-700" 
          : "opacity-0"
      } hover:-translate-y-2`}
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: "forwards" }}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs md:text-sm font-bold py-1.5 px-4 rounded-full flex items-center gap-1.5 shadow-md shadow-primary/20">
          <Sparkles className="w-3 h-3 md:w-4 md:h-4 fill-white" />
          MOST POPULAR
        </div>
      )}
      
      <CardContent className="p-6 md:p-8 flex flex-col h-full gap-6 mt-4">
        {/* Price & Cycle */}
        <div className="flex items-baseline gap-1 mt-2">
          <span className="font-sans font-bold text-slate-900 text-3xl md:text-4xl lg:text-5xl tracking-tight">
            ${plan.price}
          </span>
          <span className="font-sans font-medium text-slate-500 text-base md:text-lg">
            /{plan.cycles_for_subscription}
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="font-sans font-extrabold text-slate-900 text-xl md:text-2xl mb-2">
            {plan.name}
          </h3>
          <p className="font-sans text-slate-500 text-sm md:text-base leading-relaxed min-h-[48px]">
            {plan.description}
          </p>
        </div>

        <div className="w-full h-[1px] bg-slate-100" />

        {/* Features */}
        <div className="flex flex-col gap-4 flex-grow">
          {plan.features?.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mt-0.5 flex-shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="font-sans text-slate-600 text-sm md:text-base leading-relaxed">
                {feature.title}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <Button
            onClick={onBuy}
            variant={isPopular ? "default" : "outline"}
            className={`w-full h-12 md:h-14 rounded-full font-sans font-bold text-base md:text-lg transition-all duration-300 ${
              isPopular 
                ? "bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02]" 
                : "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white"
            }`}
          >
            Buy This Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const RentalPlansSection = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [role, setRole] = useState<string>("landlord");
  const [params] = useState<{ search?: string }>({});

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["plans", params, role],
    queryFn: () => getSubscriptionPlanListCms(role, params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });

  const plans = data?.result ?? [];

  const handleBuyPlan = () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      navigate("/pricing-and-plans");
    } else {
      const regRole = role === "landlord" ? "LANDLORD" : "PROPERTY MANAGER";
      localStorage.setItem("signup_role", regRole);
      navigate("/email-verification");
    }
  };

  return (
    <div className="w-full relative px-4 md:px-8 lg:px-[100px]">
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Header and Toggle Area */}
        <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8 text-center lg:text-left">
          <div className="flex flex-col gap-3 max-w-2xl mx-auto lg:mx-0">
            <div className="font-sans font-semibold text-primary text-sm md:text-base tracking-[0.1em] uppercase">
              PLANS FOR LANDLORD & PROPERTY MANAGER
            </div>
            <h2 className="font-sans font-extrabold text-slate-900 text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
              Choose Your Right Plan
            </h2>
          </div>
          
          {/* Tabs for Plan Types */}
          <div className="mx-auto lg:mx-0 w-full max-w-[400px]">
            <Tabs
              value={role}
              onValueChange={(val) => setRole(val)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 p-1.5 bg-slate-200/60 rounded-full h-14">
                <TabsTrigger 
                  value="landlord" 
                  className="rounded-full font-bold text-sm md:text-base text-slate-600 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                >
                  Property Owner
                </TabsTrigger>
                <TabsTrigger 
                  value="property-manager" 
                  className="rounded-full font-bold text-sm md:text-base text-slate-600 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                >
                  Property Manager
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </header>

        {/* Loading State or Plans Grid */}
        {isLoading && !data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full h-[550px] bg-slate-100/80 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8 transition-opacity duration-300 ${isFetching ? "opacity-60" : "opacity-100"}`}>
            {plans?.map((plan: Plan, indx: number) => (
              <PlanCard key={indx} plan={plan} index={indx} inView={inView} refObj={ref} onBuy={handleBuyPlan} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalPlansSection;
