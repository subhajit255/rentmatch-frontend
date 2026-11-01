import React, { useState } from "react";
import SubscriptionCard from "../cards/subscription";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionPlanListForOwnersApi } from "../../actions/subscriptions";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


type planType = {
    "_id"?: string,
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
        name: "Can list upto 2 properties",
        icon: "CheckIcon",
    },
    {
        id: 2,
        name: "Advanced dashboard",
        icon: "CheckIcon",
    },
    {
        id: 3,
        name: "All components included",
        icon: "CheckIcon",
    },
    {
        id: 4,
        name: "Advanced insight",
        icon: "CheckIcon",
    },
];

const SubscriptionListForOwners = () => {
    const { user } = useAuth();
    // const navigation = useNavigate();
    const [params, setParams] = useState<{ search?: string }>({});

    const { data, isLoading } = useQuery({
        queryKey: ['plans', params, user?.role],
        queryFn: () => getSubscriptionPlanListForOwnersApi(user?.role === "LANDLORD" ? "landlord" : "property_manager", params),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
// console.log("Subscription plans for owners data ::: ", user,data);
    return <div>
        <div className="flex flex-col gap-8">
            <div className="flex w-full flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {!isLoading && data?.result?.map((elem:planType, indx: number) => 
                            <SubscriptionCard key={indx} features={features} plan={elem} isAdmin={false} />
                        )}
                    </div>
            </div>
        </div>
    </div>;
}

export default SubscriptionListForOwners;