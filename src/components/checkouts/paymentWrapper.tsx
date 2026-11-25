import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../lib/stripe";
import CheckoutForm from "./checkoutForm";
import { useQuery } from "@tanstack/react-query";
import { getPaymentIntent } from "../../actions/payment";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { Lock, AlertCircle } from "lucide-react";

const PaymentWrapper = () => {
    const { user, token, loading: authLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { plan_id, plan_details } = location.state || {};

    const authToken =
        token ||
        localStorage.getItem("auth_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("@jwt") ||
        "";

    const userId = user?._id || user?.id || (user as any)?.member_id || "";
    const subscriptionId = plan_details?._id || plan_details?.id || plan_id || "";

    const { data, isLoading, error, isError } = useQuery({
        queryKey: ['create-payment-intent', subscriptionId, userId],
        queryFn: () => getPaymentIntent({
            "user_object_id": userId,
            "subscription_id": subscriptionId,
        }),
        enabled: Boolean(userId && subscriptionId && authToken),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1
    });

    const clientSecret =
        data?.result?.payment?.payment_data?.client_secret ||
        data?.result?.payment_data?.client_secret ||
        data?.result?.payment?.client_secret ||
        data?.result?.client_secret ||
        data?.result?.clientSecret ||
        data?.payment_data?.client_secret ||
        data?.client_secret;

    if (authLoading || isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[350px] gap-3">
                <div className="w-9 h-9 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-slate-500 font-medium">Setting up secure checkout...</span>
            </div>
        );
    }

    if (!subscriptionId) {
        return (
            <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Plan Selected</h3>
                <p className="text-sm text-slate-500 mb-6">
                    Please select a subscription plan to proceed with checkout.
                </p>
                <Button onClick={() => navigate("/pricing-and-plans")} className="rounded-full px-6">
                    View Plans
                </Button>
            </div>
        );
    }

    if (!authToken || !userId) {
        return (
            <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Login Required</h3>
                <p className="text-sm text-slate-500 mb-6">
                    Please log in to your Landlord or Real Estate account to complete your subscription.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                        onClick={() =>
                            navigate("/login", {
                                state: {
                                    from: "/checkout",
                                    plan_id: subscriptionId,
                                    plan_details,
                                },
                            })
                        }
                        className="rounded-full px-6 w-full sm:w-auto"
                    >
                        Log In to Continue
                    </Button>
                    <Button
                        onClick={() => navigate("/pricing-and-plans")}
                        variant="outline"
                        className="rounded-full px-6 w-full sm:w-auto"
                    >
                        Back to Plans
                    </Button>
                </div>
            </div>
        );
    }

    if (!clientSecret || isError) {
        const errorMsg =
            data?.message ||
            (error as any)?.response?.data?.message ||
            (error as any)?.message ||
            "";
        const isAuthError =
            (error as any)?.response?.status === 401 ||
            errorMsg.toLowerCase().includes("token") ||
            errorMsg.toLowerCase().includes("access denied") ||
            errorMsg.toLowerCase().includes("unauthorized");

        return (
            <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        isAuthError ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                    }`}
                >
                    {isAuthError ? <Lock className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {isAuthError ? "Session Expired or Login Required" : "Checkout Error"}
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                    {isAuthError
                        ? "Your login session has expired or requires authentication. Please log in to complete your subscription."
                        : errorMsg || "Unable to initialize payment session. Please try again or choose another plan."}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    {isAuthError && (
                        <Button
                            onClick={() =>
                                navigate("/login", {
                                    state: {
                                        from: "/checkout",
                                        plan_id: subscriptionId,
                                        plan_details,
                                    },
                                })
                            }
                            className="rounded-full px-6 w-full sm:w-auto"
                        >
                            Log In
                        </Button>
                    )}
                    <Button
                        onClick={() => navigate("/pricing-and-plans")}
                        variant="outline"
                        className="rounded-full px-6 w-full sm:w-auto"
                    >
                        Back to Plans
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
                clientSecret={clientSecret}
                price={plan_details?.price}
                user_object_id={data?.result?.payment?.member_objectId || userId}
                payment_intent_id={data?.result?.payment?.payment_intent_id}
            />
        </Elements>
    );
};

export default PaymentWrapper;
