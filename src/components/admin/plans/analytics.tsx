import React from "react";
import { icons } from "lucide-react";
import SubscriptionDataCard from "../../cards/subscriptionData";
import { ChartBarMultiple } from "../../cards/barCharts";
import ProgressAnalysis from "../../cards/progressAnalysis";

const analytics = [
    {
        _id : 1,
        icon : "NotePlus",
        title : "Monthly Recurring Revenue",
        numeric : "$45,678",
        tanure : "month",
        growth : 12.5
    },
    {
        _id : 2,
        icon : "Connector",
        title : "New Subscribers",
        numeric : "234",
        tanure : "month",
        growth : 6
    },
    {
        _id : 3,
        icon : "Heart",
        title : "Churn Rate",
        numeric : "2.4%",
        tanure : "month",
        growth : 6
    },
    {
        _id : 4,
        icon : "NotePlus",
        title : "Average Revenue Per User",
        numeric : "$67.89",
        tanure : "month",
        growth : 12.5
    },{
        _id : 5,
        icon : "Connector",
        title : "Active Subscriptions",
        numeric : "1,180",
        tanure : "month",
        growth : 6
    },
    {
        _id : 6,
        icon : "Heart",
        title : "Conversion Rate",
        numeric : "23.5%",
        tanure : "month",
        growth : 6
    }
]
const SubscriptionAnalytics = ({ }) => {
    return (
        <div>
            <div className="flex flex-col gap-8 py-10">
                <div className="px-3 py-4 grid grid-cols-1 sm:grid-cols-3 bg-white rounded-lg">
                    {analytics?.map((analytic, indx) => 
                        <SubscriptionDataCard key={analytic?._id} analytic={analytic} className={`${(indx < 3) ? "" : "border-t border-black/10 rounded-[0px]"}`} internalBorder={indx !== 2 && indx !== 5} />
                    )}
                    
                </div>
                <div className="flex gap-4">
                    <ChartBarMultiple />
                    <ProgressAnalysis />
                </div>
            </div>
        </div>
    )
}

export default SubscriptionAnalytics;