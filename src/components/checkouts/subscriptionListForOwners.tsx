import React, { useState } from "react";
import SubscriptionCard from "../cards/subscription";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    cancelMemberSubscriptionApi,
    getMemberSubscriptionHistoryApi,
    getSubscriptionPlanListForOwnersApi,
} from "../../actions/subscriptions";
import { useAuth } from "../../context/AuthContext";
import { Check, AlertTriangle, X, Receipt, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "../../custom-hooks/use-toast";

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

const getStatusBadge = (rawStatus?: string) => {
    const status = String(rawStatus || "").toUpperCase();
    if (status === "SUCCESS" || status === "PAID" || status === "APPROVED") {
        return {
            label: "Active / Paid",
            className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        };
    }
    if (status === "CANCELLED" || status === "CANCEL") {
        return {
            label: "Cancelled",
            className: "bg-rose-50 text-rose-700 border border-rose-200",
        };
    }
    if (status === "FAILED" || status === "REJECTED") {
        return {
            label: "Failed",
            className: "bg-red-50 text-red-700 border border-red-200",
        };
    }
    return {
        label: "Pending",
        className: "bg-amber-50 text-amber-700 border border-amber-200",
    };
};

const formatHistoryDate = (val?: string) => {
    if (!val) return "N/A";
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const SubscriptionListForOwners = () => {
    const { user, token, updateUser, refreshUser } = useAuth();
    const queryClient = useQueryClient();
    const [params] = useState<{ search?: string }>({});
    const [cancelModalOpen, setCancelModalOpen] = useState(false);

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

    const isAuthenticated = Boolean(token || localStorage.getItem("auth_token"));

    const { data: historyData, isLoading: historyLoading } = useQuery({
        queryKey: ['subscription-history', user?._id || user?.id],
        queryFn: getMemberSubscriptionHistoryApi,
        enabled: isAuthenticated,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const { mutate: cancelSubscription, isPending: isCancelling } = useMutation({
        mutationFn: cancelMemberSubscriptionApi,
        onSuccess: async (res) => {
            updateUser({ is_subscribe: false });
            try {
                await refreshUser();
            } catch (err) {
                console.warn("Could not refresh user after cancellation:", err);
            }
            queryClient.invalidateQueries({ queryKey: ['subscription-history'] });
            queryClient.invalidateQueries({ queryKey: ['plans'] });
            setCancelModalOpen(false);
            toast({
                title: "Subscription Cancelled",
                description: res?.message || "Your recurring subscription has been cancelled.",
                variant: "success",
            });
        },
        onError: (err: any) => {
            toast({
                title: "Cancellation Failed",
                description: err?.response?.data?.message || "Could not cancel your subscription. Please try again.",
                variant: "error",
            });
        },
    });

    const plans = data?.result ?? [];
    const historyList: any[] = historyData?.result?.history ?? [];

    return (
        <div className="w-full max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-0">
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
                <div className="max-w-2xl mx-auto mb-8 bg-emerald-50/90 border border-emerald-200 text-emerald-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-2xs">
                    <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
                            <Check className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-sm text-emerald-900">Active Subscription</p>
                            <p className="text-xs text-emerald-700 leading-snug">
                                Your {roleType === "landlord" ? "landlord" : "property manager"} membership is active with full access to renter profiles, property tools, and inspection scheduling.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCancelModalOpen(true)}
                        className="rounded-full border-rose-300 text-rose-700 bg-white hover:bg-rose-50 hover:border-rose-400 text-xs font-semibold px-4 h-9 shrink-0 cursor-pointer"
                    >
                        Cancel Subscription
                    </Button>
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

            {/* Subscription History Section */}
            {isAuthenticated && (
                <div className="mt-12 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7">
                    <div className="flex items-center justify-between gap-3 mb-5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                                <Receipt className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                                    Subscription History
                                </h2>
                                <p className="text-xs text-slate-500">
                                    All your past and current subscription payments &amp; status updates
                                </p>
                            </div>
                        </div>
                    </div>

                    {historyLoading ? (
                        <div className="space-y-3 py-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : historyList.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50/70 rounded-xl border border-slate-100">
                            <p className="text-sm font-medium text-slate-600">
                                No subscription history found yet.
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                Once you subscribe to a plan, your billing records will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                        <th className="py-3 pr-4">Plan</th>
                                        <th className="py-3 px-4">Billing Cycle</th>
                                        <th className="py-3 px-4">Amount</th>
                                        <th className="py-3 px-4">Date</th>
                                        <th className="py-3 px-4">Transaction ID</th>
                                        <th className="py-3 pl-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {historyList.map((item: any, idx: number) => {
                                        const badge = getStatusBadge(
                                            item?.transaction_status || item?.payment_status
                                        );
                                        return (
                                            <tr key={item?._id || idx} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="py-3.5 pr-4 font-semibold text-slate-900">
                                                    {item?.plan_name || "Subscription Plan"}
                                                </td>
                                                <td className="py-3.5 px-4 text-xs font-medium text-slate-600 capitalize">
                                                    {String(item?.cycles || "Monthly").toLowerCase()}
                                                </td>
                                                <td className="py-3.5 px-4 font-bold text-slate-900">
                                                    ${Number(item?.amount || 0).toLocaleString()}
                                                </td>
                                                <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                        {formatHistoryDate(item?.date)}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                                                    {item?.payment_intent_id
                                                        ? `${String(item.payment_intent_id).slice(0, 18)}...`
                                                        : "—"}
                                                </td>
                                                <td className="py-3.5 pl-4 text-right">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badge.className}`}
                                                    >
                                                        {badge.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Cancel Subscription Confirmation Modal */}
            <Dialog.Root open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50" />
                    <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-md bg-white p-6 rounded-3xl shadow-2xl z-50 border border-slate-100">
                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <Dialog.Title className="text-base font-bold text-slate-900">
                                    Cancel Recurring Subscription?
                                </Dialog.Title>
                            </div>
                            <Dialog.Close asChild>
                                <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                                    <X className="w-4 h-4" />
                                </button>
                            </Dialog.Close>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed py-4">
                            Are you sure you want to cancel your active recurring subscription? Your plan will be marked as cancelled and you will need to subscribe again to access landlord tools.
                        </p>

                        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCancelModalOpen(false)}
                                className="rounded-full px-5 h-9 text-xs"
                            >
                                Keep Subscription
                            </Button>
                            <Button
                                type="button"
                                disabled={isCancelling}
                                onClick={() => cancelSubscription()}
                                className="rounded-full px-5 h-9 text-xs bg-rose-600 hover:bg-rose-700 text-white"
                            >
                                {isCancelling ? "Cancelling..." : "Yes, Cancel Plan"}
                            </Button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default SubscriptionListForOwners;
