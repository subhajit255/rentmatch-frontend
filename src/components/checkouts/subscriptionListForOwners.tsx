import React, { useState } from "react";
import SubscriptionCard from "../cards/subscription";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionPlanListForOwnersApi } from "../../actions/subscriptions";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Check } from "lucide-react";

type planType = {
    "_id"?: string,
    "id"?: string,
    "name": string,
    "slug": string,
    "plan_type": string,
    "role_type": string,
    "price": number,
    "cycles_for_subscription": string,
    "description": string,
    "features"?: [
        {
            "title"?: string,
            "_id"?: string
        }
    ],
    "is_active?": boolean,
    "status?": boolean,
    "__v"?: number
}

const features = [
    {
        id: 1,
        name: "Full renter profiles",
        icon: "CheckIcon",
    },
    {
        id: 2,
        name: "Unlimited matches & invitations",
        icon: "CheckIcon",
    },
    {
        id: 3,
        name: "Inspection scheduling",
        icon: "CheckIcon",
    },
    {
        id: 4,
        name: "Tenant shortlisting & direct contact",
        icon: "CheckIcon",
    },
];

const SubscriptionListForOwners = () => {
    const { user } = useAuth();
    const [params, setParams] = useState<{ search?: string }>({});

    const roleType =
        user?.role === "LANDLORD" || localStorage.getItem("signup_role") === "LANDLORD"
            ? "landlord"
            : "property_manager";

    const { data, isLoading } = useQuery({
        queryKey: ['plans', params, roleType],
        queryFn: () => getSubscriptionPlanListForOwnersApi(roleType, params),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const plans = data?.result ?? [];

    return (
        <div className="w-full max-w-5xl mx-auto py-8 sm:py-12">
            {/* Header Section */}
            <div className="text-center max-w-xl mx-auto mb-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
                    Subscription Plans
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                    {user?.is_subscribe
                        ? "Your subscription is active. Here is your current membership plan."
                        : "Select a plan to connect with verified renters and manage your properties."}
                </p>
            </div>

            {user?.is_subscribe && (
                <div className="max-w-md mx-auto mb-8 bg-emerald-50/90 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
                        <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-sm text-emerald-900">Active Subscription</p>
                        <p className="text-xs text-emerald-700 leading-snug">
                            Your landlord membership is active with full access to renter profiles, property tools, and inspection scheduling.
                        </p>
                    </div>
                </div>
            )}

            {/* Plans Grid or Loader */}
            {isLoading ? (
                <div className="flex justify-center items-center">
                    <div className="w-full max-w-md bg-white rounded-2xl p-7 border border-slate-200 animate-pulse space-y-5">
                        <div className="h-9 bg-slate-200 rounded w-28" />
                        <div className="h-6 bg-slate-200 rounded w-48" />
                        <div className="h-4 bg-slate-100 rounded w-full" />
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <div className="w-4 h-4 bg-slate-200 rounded shrink-0" />
                                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                                </div>
                            ))}
                        </div>
                        <div className="h-11 bg-slate-200 rounded-xl w-full pt-2" />
                    </div>
                </div>
            ) : plans.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Plans Available</h3>
                    <p className="text-sm text-slate-500">
                        There are currently no active plans for your account type. Please check back later.
                    </p>
                </div>
            ) : (
                <div className={`grid gap-6 sm:gap-8 justify-center ${
                    plans.length === 1
                        ? "grid-cols-1 max-w-md mx-auto"
                        : plans.length === 2
                        ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
                        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
                }`}>
                    {plans.map((elem: planType, indx: number) => (
                        <SubscriptionCard
                            key={elem?._id || elem?.id || indx}
                            features={features}
                            plan={elem}
                            isAdmin={false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubscriptionListForOwners;