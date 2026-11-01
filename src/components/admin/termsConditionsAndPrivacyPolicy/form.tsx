import React, { useEffect, useState } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { toast } from "../../../custom-hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useLocation, useNavigate } from "react-router-dom";
import { FormError } from "../../errors";
import { Required } from "../../ui/miscellenious";
import {
  addTermsAndPrivacyApi,
  getTermsAndPrivacyApi,
} from "../../../actions/cms/faq";

const Editor = React.lazy(() => import("../../../components/Layout/Editor"));

const TermsConditionsAndPrivacyPolicyAdminForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { name, description, _id } = location.state || {};
  const [privacyPolicyData, setPrivacyPolicyData] = useState<{
    title: string;
    role: string;
    description: string;
  }>({
    title: name || "",
    role: "",
    description: description || "",
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    role: "",
  });

  const memberRoles = [
    {
      id: 0,
      value: "TENANT",
      title: "Tenant",
    },
    {
      id: 1,
      value: "LANDLORD",
      title: "Property Owner",
    },
    {
      id: 2,
      value: "PROPERTY MANAGER",
      title: "Property Manager",
    },
  ];

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

  // getLegalTerms returns an array of docs (one per role); pick the one for the selected role
  const legalDocs: any[] = Array.isArray(data?.result) ? data.result : [];
  const selectedDoc =
    legalDocs.find((doc: any) => doc?.role === privacyPolicyData.role) ??
    legalDocs[0];

  useEffect(() => {
    if (selectedDoc) {
      setPrivacyPolicyData((prev) => ({
        title: selectedDoc.title || "",
        description: selectedDoc.content || "",
        role: prev.role || selectedDoc.role || "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDoc?._id]);

  const { mutate: EditTermsAndPrivacy, isPending } = useMutation({
    mutationFn: (payload: {
      title: string;
      type: string;
      content: string;
      role: string;
    }) => addTermsAndPrivacyApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["privecy-n-terms"] });
      toast({
        title: `Terms and Privacy Policy Updated`,
        description: `The terms and privacy policy has been successfully updated.`,
        variant: "success",
      });
      redirectToList();
    },
    onError: (error) => {
      toast({
        title: `Failed to Update Terms and Privacy Policy`,
        description: `An error occurred while updating the terms and privacy policy. Please try again.`,
        variant: "error",
      });
    },
  });

  const redirectToList = () => {
    navigate(`/${policyType.toLowerCase().replace(/_/g, "-")}`);
  };

  //submit
  const handleSaveBtn = () => {
    console.log(privacyPolicyData, "privacyPolicyData");
    setErrors({ title: "", description: "", role: "" });

    const title = privacyPolicyData.title.trim();
    const description = privacyPolicyData.description.trim();

    if (!privacyPolicyData.role) {
      setErrors((prev) => ({ ...prev, role: "Role is required" }));
      return;
    }

    let hasError = false;

    if (!title) {
      setErrors((prev) => ({ ...prev, title: "Title is required" }));
      hasError = true;
    }

    if (!description || description === "<p></p>" || description === "") {
      setErrors((prev) => ({ ...prev, description: "Content is required" }));
      hasError = true;
    }

    if (!privacyPolicyData.role) {
      setErrors((prev) => ({ ...prev, role: "Role is required" }));
      hasError = true;
    }

    if (hasError) return;

    const payload = {
      title: title,
      content: description,
      type: policyType,
      role: privacyPolicyData.role,
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
          <Label htmlFor="role" className="font-medium">
            Role Type <Required />{" "}
          </Label>
          <Select
            onValueChange={(v) => {
              setPrivacyPolicyData((p) => ({
                ...p,
                role: v as string,
              }));
              setErrors((prev) => ({ ...prev, role: "" }));
            }}
            value={privacyPolicyData?.role}
          >
            <SelectTrigger
              className={
                errors.role
                  ? "border-destructive"
                  : "w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none "
              }
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
          {errors.role && (
            <p className="text-sm text-destructive">{errors.role}</p>
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
