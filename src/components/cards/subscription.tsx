import React, { useState } from "react";
import Icon, { IconName } from "../icons/icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteSubscriptionPlanApi,
  updateSubscriptionPlanApi,
  updateSubscriptionPlanStatusChangeApi,
} from "../../actions/subscriptions";
import { toast } from "../../custom-hooks/use-toast";
import { useModal } from "../../context/modalProvider";
import { cn } from "../lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuth } from "../../context/AuthContext";
import { Check } from "lucide-react";

const SubscriptionCard = ({
  features,
  plan,
  isAdmin = false,
}: {
  features: any;
  plan: any;
  isAdmin?: boolean;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openModal, setParameters, closeModal } = useModal();
  const {
    price,
    name,
    cycles_for_subscription,
    description,
    active_subscriber,
    is_active,
    _id,
  } = plan;
  const [currentStatus, setCurrentStatus] = useState<boolean>(
    is_active ?? false,
  );
  const { user } = useAuth();

  const handleEditPlan = () => {
    navigate("/subscription/plans/edit", { state: { ...plan } });
  };

  const { mutate: deletePlan } = useMutation({
    mutationFn: deleteSubscriptionPlanApi,
    onSuccess: () => {
      // This will trigger refetch of ['users']
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast({
        title: `Plan Deleted`,
        description: `Plan has been deleted in the system.`,
        variant: "success",
      });
      closeModal();
    },
    onError: (error) => {
      // setServerError(error.response?.data?.message || 'Can not able to add user.');
      toast({
        title: `Delete Failed`,
        description: `Could not delete the property type. Please check try again.`,
        variant: "error",
      });
    },
  });

  const { mutate: statusUpdate } = useMutation({
    mutationFn: updateSubscriptionPlanStatusChangeApi,
    onSuccess: (data) => {
      // console.log("data : ", data);

      // This will trigger refetch of ['users']
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      setCurrentStatus((prev) => !prev);
      toast({
        title: `Plan Status Updated`,
        description: `Plan has been updated in the system.`,
        variant: "success",
      });
      closeModal();
    },
    onError: (error) => {
      // setServerError(error.response?.data?.message || 'Can not able to add user.');
      toast({
        title: `Updated Failed`,
        description: `Could not update the property type. Please check try again.`,
        variant: "error",
      });
    },
  });

  const handleDelete = () => {
    // console.log("Delete plan action triggered.");

    openModal("remove");
    setParameters({
      header: `Are you sure you want to permanently delete this record?`,
      description: `This action cannot be undone and may affect related data.`,
      fn: () => deletePlan(plan._id),
    });
  };

  const isCurrentPlan = Boolean(user?.is_subscribe);

  const handleSelectPlan = () => {
    if (isCurrentPlan) return;
    const planId = plan?._id || plan?.id;
    const token =
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("@jwt");

    if (!token || !user) {
      toast({
        title: "Please Log In",
        description: "Please log in to your account to subscribe to this plan.",
        variant: "default",
      });
      navigate("/login", {
        state: {
          from: "/checkout",
          plan_id: planId,
          plan_details: plan,
        },
      });
      return;
    }

    navigate("/checkout", {
      state: { plan_id: planId, plan_details: plan },
    });
  };

  if (!isAdmin) {
    return (
      <div
        onClick={!isCurrentPlan ? handleSelectPlan : undefined}
        className={cn(
          "bg-white rounded-2xl p-6 sm:p-7 border shadow-xs transition-all flex flex-col justify-between h-full relative",
          isCurrentPlan
            ? "border-emerald-500/80 ring-2 ring-emerald-500/20"
            : "border-slate-200 hover:shadow-md cursor-pointer"
        )}
      >
        <div>
          {isCurrentPlan && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full w-fit mb-3">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Current Plan</span>
            </div>
          )}
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="font-bold text-slate-900 text-3xl sm:text-4xl tracking-tight">
              ${price}
            </span>
            <span className="font-normal text-slate-500 text-sm">
              /{cycles_for_subscription?.toLowerCase() ?? "monthly"}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-xl mb-1.5">
            {name}
          </h3>

          <p className="text-slate-500 text-sm leading-relaxed mb-5">
            {description}
          </p>

          <div className="border-t border-slate-100 pt-5 mb-6">
            <ul className="flex flex-col gap-3">
              {Array.isArray(plan?.features) && plan.features.length > 0 ? (
                plan.features.map(
                  (feature: any, i: number) => (
                    <li key={feature?._id || i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className="leading-snug">{feature?.title || feature?.name}</span>
                    </li>
                  )
                )
              ) : (
                features?.map((feature: any, i: number) => (
                  <li key={feature?.id || i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span className="leading-snug">{feature?.name}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {isCurrentPlan ? (
          <Button
            disabled
            className="w-full mt-4 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-sm py-2.5 h-11 rounded-xl shadow-none cursor-default opacity-100 hover:bg-emerald-50"
          >
            <Check className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            Current Active Plan
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleSelectPlan();
            }}
            className="w-full mt-4 bg-primary hover:bg-primary/95 text-white font-semibold text-sm py-2.5 h-11 rounded-xl shadow-none transition-all"
          >
            Choose Plan
          </Button>
        )}
      </div>
    );
  }

  return (
    <Label htmlFor={plan.id}>
      <Card className="py-6 px-7 border border-card-border bg-white relative">
        <CardHeader className="flex flex-row items-center justify-between p-0 mb-4 w-full">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary text-4xl m-0 ">
              ${price}
            </span>
            <span className="text-xl font-semibold/[1.2] text-secondary-foreground">
              /{cycles_for_subscription?.toLocaleLowerCase() ?? "monthly"}
            </span>
          </div>
          {isAdmin && (
            <div>
              <div
                onClick={() => statusUpdate(_id)}
                className={cn(
                  "h-[33px] w-[64px] px-2 flex items-center rounded-full cursor-pointer",
                  currentStatus ? " bg-[#E3FFF2] " : " bg-[#FEF0F0] ",
                )}
              >
                <div
                  className={cn(
                    "w-[22.77px] h-[22.77px] rounded-full ",
                    currentStatus
                      ? "bg-active translate-x-6"
                      : "bg-destructive translate-x-0",
                  )}
                ></div>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="pl-0 pr-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-0">
              <CardTitle className="text-lg font-bold text-popover-foreground">
                {name}
              </CardTitle>
              <CardDescription
                title={description}
                className="text-sm/[1.5] line-clamp-1 tracking-tight text-secondary-foreground"
              >
                {description}
              </CardDescription>
            </div>
            <div className="text-xs text-muted-foreground py-6 flex flex-col gap-2 border-t-2 border-card-border">
              <ul className="flex flex-col gap-4">
                {Array.isArray(plan?.features) &&
                  plan.features.map(
                    (feature: {
                      icon: IconName | string;
                      title: string;
                      id: number;
                    }) => (
                      <li key={feature?.id} className="flex items-center gap-2">
                        <Icon
                          name="CheckIcon"
                          className="w-4 h-4 font-bold text-active"
                        />
                        <span className="text-secondary-foreground text-md/[1.8]">
                          {feature?.title}
                        </span>
                      </li>
                    ),
                  )}
              </ul>
            </div>
          </div>    
        </CardContent>
        {isAdmin && (
          <CardFooter className="px-2 py-0 flex flex-col items-center mx-auto justify-center gap-4 ">
            <div className="w-full">
              <Badge className="text-sm w-full rounded-full flex items-center h-[45px] px-8">
                {active_subscriber || "99"} Active subcribers
              </Badge>
            </div>
            <div className="flex items-center gap-2 w-full">
              <Button
                variant="outline"
                onClick={handleEditPlan}
                className="h-[41px] rounded-full w-[calc(100%-41px)] shadow-none cursor-pointer"
              >
                <span>Edit Plan</span>
                <Icon name="PencilIcon" className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="h-[41px] w-[41px] px-0 py-0 flex items-center justify-center rounded-full shadow-none cursor-pointer"
              >
                <Icon name="Trash2" className="w-3 h-3 mr-2 text-destructive" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </Label>
  );
};

export default SubscriptionCard;
