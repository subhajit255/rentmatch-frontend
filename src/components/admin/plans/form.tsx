import React, { useEffect, useState } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { toast } from "../../../custom-hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addSubscriptionPlan,
  updateSubscriptionPlanApi,
} from "../../../actions/subscriptions";
import { useLocation, useNavigate } from "react-router-dom";
import {
  cyclesForSubscription,
  roleTypesForSubscription,
  subscriptionform,
} from "../../../types/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import Icon from "../../icons/icon";
const memberRoles = [
  // {
  //     id: 0,
  //     value: "PROPERTY OWNER",
  //     title: "Property Owner"
  // },
  {
    id: 0,
    value: "LANDLORD",
    title: "Property Owner",
  },
  {
    id: 1,
    value: "PROPERTY MANAGER",
    title: "Property Manager",
  },
];
const cycles = [
  {
    id: 0,
    value: "WEEKLY",
    title: "Weekly",
  },
  {
    id: 1,
    value: "FORTNIGHTLY",
    title: "Fortnightly",
  },
  {
    id: 2,
    value: "MONTHLY",
    title: "Monthly",
  },
  {
    id: 3,
    value: "QUARTERLY",
    title: "Quarterly",
  },
  {
    id: 4,
    value: "HALF YEARLY",
    title: "Half Yearly",
  },
  {
    id: 5,
    value: "YEARLY",
    title: "Yearly",
  },
];

const SubscriptionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    name,
    description,
    _id,
    price,
    features,
    role_type,
    plan_type,
    cycles_for_subscription,
  } = location.state || {};
  const [planPayload, setPlanPayload] = useState<subscriptionform>({
    name: name || "",
    description: description || "",
    price: price || 0,
    features: features?.length > 0 ? features : [{ title: "" }],
    role_type: role_type || "LANDLORD",
    // role_type: role_type || 'PROPERTY OWNER',
    plan_type: plan_type || "",
    cycles_for_subscription: cycles_for_subscription || "WEEKLY",
  });
  // const [errors, setErrors] = useState({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [featureErrors, setFeatureErrors] = useState<string[]>([]);



  const { mutate: createPropertyType, isPending } = useMutation({
    mutationFn: (payload: { name: string; description: string }) =>
      addSubscriptionPlan(payload),
    onSuccess: () => {
      // This will trigger refetch of ['users']
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast({
        title: `Plan Created`,
        description: `The new plan has been successfully created.`,
        variant: "success",
      });
      navigate("/subscription/plans/");
    },
    onError: (error) => {
      toast({
        title: `Failed to Create Plan`,
        description: `An error occurred while creating the plan. Please try again.`,
        variant: "error",
      });
      // setServerError(error.response?.data?.message || 'Can not able to add user.');
    },
  });

  const { mutate: updatePropertyType, isPending: isUpdatePending } =
    useMutation({
      mutationFn: (payload: subscriptionform) =>
        updateSubscriptionPlanApi(payload, _id),
      onSuccess: () => {
        // This will trigger refetch of ['users']
        queryClient.invalidateQueries({ queryKey: ["plans"] });
        toast({
          title: `Plan Updated`,
          description: `The plan has been successfully updated.`,
          variant: "success",
        });
        navigate("/subscription/plans/");
      },
      onError: (error) => {
        toast({
          title: `Failed to Update Plan`,
          description: `An error occurred while updating the plan. Please try again.`,
          variant: "error",
        });
      },
    });

  const handleSaveBtn = () => {
    // const validation = createPropertyTypeSchema.safeParse(planPayload)
    // if (!validation.success) {
    //     const formError: any = {};
    //     validation.error.issues.forEach(err => {
    //         const field = err.path[0];
    //         formError[field] = err.message;
    //     })
    //     setErrors(prev => ({ ...prev,
    //         name: formError?.name ?? "",
    //         description: formError?.description ?? ""
    //     }))
    //     return
    // }
    console.log(planPayload, "<----planPayload")

    const newErrors: Record<string, string> = {};
    const newFeatureErrors: string[] = [];
    if (!planPayload.name.trim()) newErrors.name = "Plan name is required";
    if (!planPayload.description.trim()) newErrors.description = "Description is required";
    if (!planPayload.price || Number(planPayload.price) <= 0) newErrors.price = "Valid price required";
    if (!planPayload.plan_type.trim()) newErrors.plan_type = "Plan type is required";

    if (!planPayload.role_type) newErrors.role_type = "Please select who this plan is for";
    if (!planPayload.cycles_for_subscription) newErrors.cycles_for_subscription = "Please select a billing cycle";


    const cleanedFeatures = planPayload.features.filter(f => f.title.trim() !== "");
    planPayload.features.forEach((f, i) => {
      if (f.title.trim() === "") {
        newFeatureErrors[i] = "Feature cannot be empty";
      }
    });

    if (cleanedFeatures.length === 0) {
      newErrors.features = "At least one feature is required";
    }

    if (newFeatureErrors.some(err => err)) {
      setFeatureErrors(newFeatureErrors);
    }
    console.log(newFeatureErrors, "<---new ftr err")
    if (Object.keys(newErrors).length > 0 || newFeatureErrors.some(err => err)) {
      setErrors(newErrors);
      toast({ title: "Please fix the errors in the form", variant: "error" });
      return;
    }
    const payload = {
      ...planPayload,
      price: Number(planPayload.price),
      features: cleanedFeatures,
    };
    console.log(planPayload, "<---opt")
    if (_id) {
      updatePropertyType(planPayload);
      return;
    }
    createPropertyType(planPayload);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "name" && value?.length > 100) return;
    if (name === "description" && value?.length > 1000) return;
    // if (name === "features") {
    //   // console.log("[name]: [{title : value}]", {[name]: [{title : value}]});

    //   setPlanPayload((prev) => ({
    //     ...prev,
    //     [name]: [{ title: value }],
    //   }));
    //   return;
    // }
    setErrors(prev => ({ ...prev, [name]: "" }));

    setPlanPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const updateFeature = (index: number, value: string) => {
    setPlanPayload(prev => {
      const newFeatures = [...prev.features];
      newFeatures[index] = { title: value };
      return { ...prev, features: newFeatures };
    });
    setFeatureErrors(prev => {
      const newErrors = [...prev];
      newErrors[index] = value.trim() ? "" : "Feature cannot be empty";
      return newErrors;
    });
    setErrors(prev => ({ ...prev, features: "" }));
  };

  const addFeature = () => {
    const lastFeature = planPayload.features[planPayload.features.length - 1];

    if (lastFeature && lastFeature.title.trim() === "") {
      // Show error on the last (empty) field
      setFeatureErrors(prev => {
        const newErrors = [...prev];
        newErrors[planPayload.features.length - 1] = "Please fill this feature first";
        return newErrors;
      });
      return;
    }

    setPlanPayload(prev => ({
      ...prev,
      features: [...prev.features, { title: "" }],
    }));
  };

  const removeFeature = (index: number) => {
    setPlanPayload(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
    setFeatureErrors(prev => prev.filter((_, i) => i !== index));

  };

  // useEffect(() => {
  //   // console.log("planPayload :: ", planPayload);
  // }, [planPayload]);

  return (
    <div>
      <div className="flex flex-col gap-7 py-7">
        <div className="text-center text-2xl font-bold">
          {_id ? "Edit" : "Add"} New Plan
        </div>
        <div className="flex flex-col gap-6 bg-white py-10 px-8 rounded-lg shadow-md w-[80%] mx-auto">
          <div className="flex gap-5 w-full">
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="name" className="font-medium">
                Plan Name <Required />
              </Label>
              <Input
                name="name"
                onChange={handleChange}
                value={planPayload?.name}
                type="text"
                // className="rounded-md py-2 px-4"
                className={errors.name ? "border-destructive" : ""}
                placeholder="Enter plan name"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="price" className="font-medium">
                Price <Required />
              </Label>
              <div className="relative">
                <Input
                  name="price"
                  type="number"
                  onChange={handleChange}
                  value={planPayload?.price}
                  // className="rounded-md py-2 px-4 pl-8"
                  className={`pl-8 ${errors.price ? "border-destructive" : ""}`}
                  placeholder="Enter price"
                />
                <Icon
                  name="DollarSign"
                  className="w-3 h-3 absolute top-1/2 left-4 -translate-y-1/2 text-primary"
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="font-medium">
              Brief Description <Required />
            </Label>
            <Textarea
              name="description"
              onChange={handleChange}
              value={planPayload?.description}
              // className="rounded-md py-2 px-4"
              className={errors.description ? "border-destructive" : ""}
              placeholder="Enter plan description"
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>
          <div className="flex gap-5">
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="role_type" className="font-medium">
                Plan For <Required />{" "}
              </Label>
              <Select
                // onValueChange={(value) =>
                //   setPlanPayload((prev) => ({
                //     ...prev,
                //     role_type: value as roleTypesForSubscription,
                //   }))
                // }
                onValueChange={v => {
                  setPlanPayload(p => ({ ...p, role_type: v as roleTypesForSubscription }));
                  setErrors(prev => ({ ...prev, role_type: "" }));
                }}
                value={planPayload?.role_type}
              >
                <SelectTrigger
                  className={errors.role_type ? "border-destructive" : "w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none "}
                >
                  <SelectValue placeholder="Select Your Role" />
                </SelectTrigger>
                <SelectContent>
                  {memberRoles?.map((role) => (
                    <SelectItem key={role?.id} value={role?.value}>
                      {role?.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role_type && (
                <p className="text-sm text-destructive">{errors.role_type}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="cycles_for_subscription" className="font-medium">
                Cycle <Required />{" "}
              </Label>
              <Select
                onValueChange={(value) =>
                  setPlanPayload((prev) => ({
                    ...prev,
                    cycles_for_subscription: value as cyclesForSubscription,
                  }))
                }
                value={planPayload?.cycles_for_subscription}
              >
                <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
                  <SelectValue placeholder="Select Your Role" />
                </SelectTrigger>
                <SelectContent>
                  {cycles?.map((cycle) => (
                    <SelectItem key={cycle?.id} value={cycle?.value}>
                      {cycle?.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cycles_for_subscription && (
                <p className="text-sm text-destructive">{errors.cycles_for_subscription}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="plan_type" className="font-medium">
              Plan Type <Required />{" "}
            </Label>
            <Input
              name="plan_type"
              onChange={handleChange}
              value={planPayload?.plan_type}
              // className="rounded-md py-2 px-4"
              className={errors.plan_type ? "border-destructive" : ""}
              placeholder="Enter plan type"
            />
            {errors.plan_type && <p className="text-sm text-destructive">{errors.plan_type}</p>}
          </div>
          {/* <div className="flex flex-col gap-2">
            <Label htmlFor="featurs" className="font-medium">
              Features <Required />{" "}
            </Label>
            <Input
              name="features"
              onChange={handleChange}
              value={planPayload?.features[0]?.title}
              type="text"
              className="rounded-md py-2 px-4"
              placeholder="Enter plan features"
            />
          </div> */}

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Features <Required /></Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
                className="gap-1"
                disabled={planPayload.features.length > 0 &&
                  !planPayload.features[planPayload.features.length - 1].title?.trim()}
              >
                <Icon name="Plus" className="h-4 w-4" />
                Add Feature
              </Button>
            </div>

            {planPayload.features.map((feature, index) => (
              <div>
                <div key={index} className="flex gap-3 items-start">
                  <Input
                    value={feature.title}
                    onChange={e => updateFeature(index, e.target.value)}
                    placeholder={`Feature ${index + 1} (e.g. Unlimited properties)`}
                    // className="flex-1"
                    className={`flex-1 ${featureErrors[index] ? "border-destructive" : ""}`}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFeature(index)}
                    disabled={planPayload.features.length === 1}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
                {featureErrors[index] && (
                  <p className="text-sm text-destructive mt-1">
                    {featureErrors[index]}
                  </p>
                )}
              </div>
            ))}
            {errors.features && planPayload.features.every(f => f.title?.trim() === "") && (
              <p className="text-sm text-destructive">{errors.features}</p>
            )}
            {/* {errors.features && (
              <p className="text-sm text-destructive">{errors.features}</p>
            )} */}
          </div>
          <Button
            disabled={isPending || isUpdatePending}
            onClick={handleSaveBtn}
            className=" mx-auto cursor-pointer text-white rounded-full px-9 py-4 mt-4 w-fit"
          >
            {_id
              ? isUpdatePending
                ? "Updating"
                : "Update"
              : isPending
                ? "Creating"
                : "Create"}{" "}
            Plan{isPending || isUpdatePending ? "..." : ""}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionForm;

const Required = () => {
  return <span className="text-sm text-destructive-foreground">*</span>;
};
