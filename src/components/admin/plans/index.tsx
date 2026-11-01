import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
// import { Input } from "../../ui/input";
import Icon, { IconName } from "../../icons/icon";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../ui/tabs"
import SubscriptionCard from "../../cards/subscription";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionPlanList } from "../../../actions/subscriptions";
import { useNavigate } from "react-router-dom";
import { subscriptionform } from "@/src/types/admin";
import { useAuth } from "@/src/context/AuthContext";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
// import { Badge } from "../../ui/badge";

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

const poplans = [ 
    {
        name : "Basic",
        tanure : "month",
        price : 49,
        description : "Better for growing businesses that want more customers.",
        active_subscriber : 248,
        is_active : true,
        _id : 1
    },
    {
        name : "Standard",
        tanure : "quarter",
        price : 99,
        description : "Better for growing businesses that want more customers.",
        active_subscriber : 1072,
        is_active : true,
        _id : 2
    },
    {
        name : "Pro",
        tanure : "year",
        price : 199,
        description : "Better for growing businesses that want more customers.",
        active_subscriber : 148,
        is_active : true,
        _id : 3
    }
]

const pmplans = [ 
    {
        name : "Basic",
        tanure : "month",
        price : 39,
        description : "Better for growing businesses that want more customers.",
        active_subscriber : 48,
        is_active : true,
        _id : 4
    },
    {
        name : "Standard",
        tanure : "quarter",
        price : 59,
        description : "Better for growing businesses that want more customers.",
        active_subscriber : 97,
        is_active : true,
        _id : 5
    },
    {
        name : "Pro",
        tanure : "year",
        price : 99,
        description : "Better for growing businesses that want more customers.",
        active_subscriber : 12,
        is_active : true,
        _id : 6
    }
]

const SubscriptionList = ({ isAdmin = false }: { isAdmin: boolean }) => {
    const navigation = useNavigate();
    const [role, setRole] = useState<string>("landlord");
    const [params, setParams] = useState<{ search?: string }>({});
    const [pmplans, setPmplans] = useState([]);
    const [poplans, setPoplans] = useState([]);

    const { data, isLoading } = useQuery({
      queryKey: ["plans", params, role],
      queryFn: () => getSubscriptionPlanList(role, params),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });
    // derive directly from the query so switching tabs never shows the previous role's plans
    const plans: any[] = Array.isArray(data?.result) ? data.result : [];

    const handleAddSunscription = () => {
      navigation("/subscription/plans/create");
    };

    return (
      <div>
        <div className="flex flex-col gap-8">
          <div className="flex w-full flex-col gap-6">
            <Tabs
              value={role}
              onValueChange={(val) => setRole(val)}
              className="w-full"
            >
              <div className="flex items-center justify-between w-full">
                <TabsList>
                  <TabsTrigger value="landlord">Property Owner</TabsTrigger>
                  <TabsTrigger value="property-manager">
                    Property Manager
                  </TabsTrigger>
                </TabsList>
                <div className="flex gap-3 items-center">
                  <Button
                    variant="secondary"
                    className="h-[45px] rounded-full flex items-center"
                    onClick={handleAddSunscription}
                  >
                    <Icon name="PlusIcon" className="w-4 h-4" />
                    <span>Add New Plan</span>
                  </Button>
                </div>
              </div>
              <TabsContent value="landlord" className="my-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {plans?.map((elem, indx) => (
                    <SubscriptionCard
                      key={elem?._id ?? indx}
                      features={features}
                      plan={elem}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="property-manager" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {plans?.map((elem, indx) => (
                    <SubscriptionCard
                      key={elem?._id ?? indx}
                      features={features}
                      plan={elem}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
}

export default SubscriptionList;