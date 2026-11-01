import React, { useEffect, useState } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { toast } from "../../../custom-hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useLocation, useNavigate } from "react-router-dom";
import { FormError } from "../../errors";
import { Required } from "../../ui/miscellenious";
import {
  addTermsAndPrivacyApi,
  getTermsAndPrivacyApi,
} from "../../../actions/cms/faq";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { roleTypesForSubscription } from "@/src/types/admin";
import { memberRoles } from "@/src/constants/userType";

const Editor = React.lazy(() => import("../../../components/Layout/Editor"));

const TermsConditionsAndPrivacyPolicyAdminForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { name, description, _id, role_type } = location.state || {};
  const [privacyPolicyData, setPrivacyPolicyData] = useState<{
    title: string;
    description: string;
    role_type: string;
  }>({
    title: name || "",
    role_type: role_type || "",
    description: description || "",
  });

  const [errors, setErrors] = useState<{
    title: string;
    description: string;
    role_type: string;
  }>({ title: "", description: "", role_type: "" });

  const [planPayload, setPlanPayload] = useState<any>({
    name: name || "",
    role_type: role_type || "",
    description: description || "",
  });

  // Determine type based on current path
  const getPolicyType = () => {
    const path = location.pathname;
    if (path.includes("/privacy-policy/edit")) {
      return "PRIVACY_POLICY";
    }
    if (path.includes("/terms-and-conditions/edit")) {
      return "TERMS_AND_CONDITIONS";
    }
    return "PRIVACY_POLICY";
  };
  const policyType = getPolicyType();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["privecy-n-terms", policyType],
    queryFn: () => getTermsAndPrivacyApi(policyType),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
  // const content: string = data?.result ? data?.result?.content : "";
  // console.log(data, "<-=-- in form content");

  useEffect(() => {
    if (data?.result) {
      setPrivacyPolicyData({
        title: data.result.title || "",
        role_type: data.result.role_type || "",
        description: data.result.content || "",
      });
    }
  }, [data]);

  const { mutate: EditTermsAndPrivacy, isPending } = useMutation({
    mutationFn: (payload: { title: string; type: string; content: string }) =>
      addTermsAndPrivacyApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["privecy-n-terms"] });
      toast({
        title: `Terms and Privacy Policy Updated`,
        description: `The terms and privacy policy has been successfully updated.`,
        variant: "success",
      });
      ridirectToList();
    },
    onError: (error) => {
      toast({
        title: `Failed to Update Terms and Privacy Policy`,
        description: `An error occurred while updating the terms and privacy policy. Please try again.`,
        variant: "error",
      });
    },
  });

  const ridirectToList = () => {
    navigate(`/${policyType.toLowerCase().replace(/_/g, "-")}`);
  };

  //submit
  const handleSaveBtn = () => {
    console.log(privacyPolicyData, "privacyPolicyData");
    setErrors({ title: "",   description: "", role_type: "" });

    const title = privacyPolicyData.title.trim();
    const description = privacyPolicyData.description.trim();

    let hasError = false;

    if (!title) {
      setErrors((prev) => ({ ...prev, title: "Title is required" }));
      hasError = true;
    }

    if (!description || description === "<p></p>" || description === "") {
      setErrors((prev) => ({ ...prev, description: "Content is required" }));
      hasError = true;
    }

    if (hasError) return;

    const payload = {
      title: title,
      content: description,
      type: policyType,
      role_type: privacyPolicyData.role_type,
    };

    EditTermsAndPrivacy(payload);
  };

  //data load
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "title" && value?.length > 100) return;
    if (name === "description" && value?.length > 1000) return;
    setPrivacyPolicyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-7 my-5 w-full">
      <div className="text-center text-2xl font-bold">
        {policyType === "PRIVACY_POLICY"
          ? "Privacy Policy"
          : "Terms and Conditions"}{" "}
        Edit
      </div>
      <div className="flex flex-col gap-8 bg-white py-10 px-6 sm:px-10 rounded-xl shadow-lg w-full max-w-[1600px] mx-auto border border-gray-100">
        <div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="name" className="font-medium">
              Title <Required />
            </Label>
            <Input
              name="title"
              onChange={handleChange}
              value={privacyPolicyData?.title}
              type="text"
              className="rounded-md p-2"
              placeholder="Enter Privacy Policy Title"
            />
          </div>
          {errors?.title && <FormError message={errors?.title} />}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="role_type" className="font-medium">
            Plan For <Required />{" "}
          </Label>
          <Select
            onValueChange={(v) => {
              setPlanPayload((p: typeof planPayload) => ({
                ...p,
                role_type: v as roleTypesForPolicy,
              }));
              setErrors((prev) => ({ ...prev, role_type: "" }));
            }}
            value={planPayload?.role_type}
          >
            {/* <SelectTrigger
              className={
                errors.role_type
                  ? "border-destructive"
                  : "w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none "
              }
            >
              <SelectValue placeholder="Select Your Role" />
            </SelectTrigger> */}

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
        <div className="flex flex-col gap-3">
          <Label htmlFor="description" className="text-lg font-semibold">
            {policyType === "PRIVACY_POLICY"
              ? "Privacy Policy"
              : "Terms and Conditions"}{" "}
            Content <Required />
          </Label>
          <div className="min-h-[600px] w-full prose prose-lg max-w-none border rounded-lg overflow-hidden">
            <Editor
              value={privacyPolicyData?.description}
              onChange={(content: string) =>
                setPrivacyPolicyData((prev) => ({
                  ...prev,
                  description: content,
                }))
              }
            />
          </div>
          {errors?.description && <FormError message={errors?.description} />}
        </div>
        <Button
          disabled={isPending}
          onClick={() => {
            handleSaveBtn();
          }}
          className="mx-auto cursor-pointer text-white rounded-full px-8 py-2 mt-4 w-fit"
        >
          {isPending ? "Saving..." : "Update"}
        </Button>
      </div>
    </div>
  );
};

export default TermsConditionsAndPrivacyPolicyAdminForm;
