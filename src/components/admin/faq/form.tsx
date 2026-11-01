import React, { useState } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { toast } from "../../../custom-hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addPropertyType,
  updatePropertyTypeApi,
} from "../../../actions/propertyMaster";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createFaqSchema,
  createPropertyTypeSchema,
} from "../../../schemas/cms";
import { FormError } from "../../errors";
import { Required } from "../../ui/miscellenious";
import { addFaqe, updateFaqApi } from "../../../actions/cms/faq";

const HOUSING_ICON = ["Appartment", "House"];

const FaqsAdminForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { name, description, _id, img } = location.state || {};
  const [faqPayload, setFaqPayload] = useState<{
    name: string;
    description: string;
  }>({
    name: name || "",
    description: description || "",
  });
  const [errors, setErrors] = useState({ name: "", description: "", img: "" });
  const [active, setActive] = useState<null | string>(null);

  //create faq
  const { mutate: createFaq, isPending } = useMutation({
    mutationFn: (payload: { name: string; description: string }) =>
      addFaqe(payload),
    onSuccess: () => {
      // This will trigger refetch of ['users']
      queryClient.invalidateQueries({ queryKey: ["faq"] });
      toast({
        title: `FAQ Created`,
        description: `The new faq has been successfully created.`,
        variant: "success",
      });
      navigate("/faq-management");
    },
    onError: (error) => {
      toast({
        title: `Failed to Update FAQ`,
        description: `An error occurred while creating the faq. Please try again.`,
        variant: "error",
      });
      // setServerError(error.response?.data?.message || 'Can not able to add user.');
    },
  });

  //upadate faq
  const { mutate: updateFaq, isPending: isUpdatePending } = useMutation({
    mutationFn: (payload: { name: string; description: string }) =>
      updateFaqApi(payload, _id),
    onSuccess: () => {
      // This will trigger refetch of ['users']
      queryClient.invalidateQueries({ queryKey: ["faq"] });
      toast({
        title: `FAQ Updated`,
        description: `The faq has been successfully updated.`,
        variant: "success",
      });
      navigate("/faq-management");
    },
    onError: (error) => {
      toast({
        title: `Failed to Create FAQ`,
        description: `An error occurred while updating the faq. Please try again.`,
        variant: "error",
      });
    },
  });

  //submit faq
  const handleSaveBtn = () => {
    const validation = createFaqSchema.safeParse(faqPayload);
    if (!validation.success) {
      const formError: any = {};
      validation.error.issues.forEach((err) => {
        const field = err.path[0];
        formError[field] = err.message;
      });
      setErrors((prev) => ({
        ...prev,
        name: formError?.name ?? "",
        description: formError?.description ?? "",
      }));
      return;
    }
    if (_id) {
      updateFaq(faqPayload);
      return;
    }
    createFaq(faqPayload);
  };

  //data load
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "name" && value?.length > 100) return;
    if (name === "description" && value?.length > 1000) return;
    setFaqPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="flex flex-col gap-7 my-5">
        <div className="text-center text-2xl font-bold">FAQ</div>
        <div className="flex flex-col gap-6 2xl:gap-8 bg-white py-10 px-8 rounded-lg shadow-md w-[60%] mx-auto">
          <div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="name" className="font-medium">
                FAQ Questions <Required />
              </Label>
              <Input
                name="name"
                onChange={handleChange}
                value={faqPayload?.name}
                type="text"
                className="rounded-md p-2"
                placeholder="Enter FAQ name"
              />
            </div>
            {errors?.name && <FormError message={errors?.name} />}
          </div>
          <div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="description" className="font-medium">
                FAQ Answer <Required />
              </Label>
              <Textarea
                name="description"
                onChange={handleChange}
                value={faqPayload?.description}
                className="rounded-md p-2"
                placeholder="Enter description"
              />
            </div>
            {errors?.description && <FormError message={errors?.description} />}
          </div>
          <Button
            disabled={isPending || isUpdatePending}
            onClick={handleSaveBtn}
            className="mx-auto cursor-pointer text-white rounded-full px-8 py-2 mt-4 w-fit"
          >
            {(_id
              ? isUpdatePending
                ? "Updating"
                : "Update"
              : isPending
                ? "Createing"
                : "Create") +
              " FAQ" +
              (isUpdatePending || isPending ? "..." : "")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FaqsAdminForm;
