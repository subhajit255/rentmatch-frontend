import React, { useEffect, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../lib/stripe";
import CheckoutForm from "./checkoutForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createPaymentIntent, getPaymentIntent } from "../../actions/payment";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PaymentWrapper = () => {  //{ clientSecret }: { clientSecret: string }
    const { user } = useAuth();
    // const [clientSecret, setClientSecret] = useState();
    const location = useLocation();
    const { plan_id, plan_details } = location.state || {};

    console.log("user ::: ", user);

    const { data, isLoading } = useQuery({
        queryKey: ['create-payment-intent', plan_id, plan_details, user?._id],
        queryFn: () => getPaymentIntent({
            "user_object_id": user?._id || "",
            "subscription_id": plan_details?._id,
            // "price": plan_details?.price.toString() || ""
        }),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 2
    });

    return (
        isLoading ? <div>Loading...</div> :
            <Elements stripe={stripePromise} options={{ clientSecret: data?.result?.payment?.payment_data?.client_secret ?? " " }}>
                <CheckoutForm
                    clientSecret={data?.result?.payment?.payment_data?.client_secret}
                    price={plan_details?.price}
                    user_object_id={data?.result?.payment?.member_objectId || user?._id || ""}
                    payment_intent_id={data?.result?.payment?.payment_intent_id}
                />
            </Elements>
    )
};

export default PaymentWrapper;
