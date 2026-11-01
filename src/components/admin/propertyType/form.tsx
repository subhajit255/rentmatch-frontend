import React, { useState } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { toast } from "../../../custom-hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPropertyType, updatePropertyTypeApi } from "../../../actions/propertyMaster";
import { useLocation, useNavigate } from "react-router-dom";
import { createPropertyTypeSchema } from "../../../schemas/cms";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import Icon from "../../icons/icon";
import { cn } from "../../lib/utils";
import { FormError } from "../../errors";
import { Required } from "../../ui/miscellenious";

const HOUSING_ICON = ["Appartment", "House"]

const PropertyTypeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { name, description, _id, img } = location.state || {};
  const [propertyTypePayload, setPropertyTypePayload] = useState<{
    name: string;
    description: string;
    img: string;
  }>({
    name: name || "",
    description: description || "",
    img: img || "",
  });

  const [errors, setErrors] = useState({ name: "", description: "", img: "" });
  const [active, setActive] = useState<null | string>(null);

  const { mutate: createPropertyType, isPending } = useMutation({
    mutationFn: (payload: { name: string; description: string }) =>
      addPropertyType(payload),
    onSuccess: () => {
      // This will trigger refetch of ['users']
      queryClient.invalidateQueries({ queryKey: ["propertyType"] });
      toast({
        title: `Property Type Created`,
        description: `The new property Type account has been successfully created.`,
        variant: "success",
      });
      navigate("/property-type/");
    },
    onError: (error) => {
      toast({
        title: `Failed to Update Property Type`,
        description: `An error occurred while creating the property Type. Please try again.`,
        variant: "error",
      });
      // setServerError(error.response?.data?.message || 'Can not able to add user.');
    },
  });

  const { mutate: updatePropertyType, isPending: isUpdatePending } =
    useMutation({
      mutationFn: (payload: { name: string; description: string }) =>
        updatePropertyTypeApi(payload, _id),
      onSuccess: () => {
        // This will trigger refetch of ['users']
        queryClient.invalidateQueries({ queryKey: ["propertyType"] });
        toast({
          title: `Property Type Updated`,
          description: `The property Type has been successfully updated.`,
          variant: "success",
        });
        navigate("/property-type/");
      },
      onError: (error) => {
        toast({
          title: `Failed to Create Property Type`,
          description: `An error occurred while updating the property Type. Please try again.`,
          variant: "error",
        });
      },
    });

  const handleSaveBtn = () => {
    // const validation = createPropertyTypeSchema.safeParse(propertyTypePayload);
    // if (!validation.success) {
    //   const formError: any = {};
    //   validation.error.issues.forEach((err) => {
    //     const field = err.path[0];
    //     formError[field] = err.message;
    //   });
    //   setErrors((prev) => ({
    //     ...prev,
    //     name: formError?.name ?? "",
    //     description: formError?.description ?? "",
    //     img: formError?.img ?? "",
    //   }));
    //   return;
    // }
    if (_id) {
      updatePropertyType(propertyTypePayload);
      return;
    }
    createPropertyType(propertyTypePayload);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "name" && value?.length > 100) return;
    if (name === "description" && value?.length > 1000) return;
    setPropertyTypePayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="flex flex-col gap-7 my-5">
        <div className="text-center text-2xl font-bold">Add Property Type</div>
        <div className="flex flex-col gap-6 2xl:gap-8 bg-white py-10 px-8 rounded-lg shadow-md w-[60%] mx-auto">
          <div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="name" className="font-medium">
                Property Type Name <Required />
              </Label>
              <Input
                name="name"
                onChange={handleChange}
                value={propertyTypePayload?.name}
                type="text"
                className="rounded-md p-2"
                placeholder="Enter property type name"
              />
            </div>
            {errors?.name && <FormError message={errors?.name} />}
          </div>
          <div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="description" className="font-medium">
                Property Type Description <Required />
              </Label>
              <Textarea
                name="description"
                onChange={handleChange}
                value={propertyTypePayload?.description}
                className="rounded-md p-2"
                placeholder="Enter description"
              />
            </div>
            {errors?.description && <FormError message={errors?.description} />}
          </div>
          <div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="icons" className="font-medium">
                Choose any Icon for type <Required />
              </Label>

              <div
                id="icons"
                className="grid grid-cols-3 w-full h-full gap-4 border px-10 py-8 rounded-lg bg-primary/10"
              >
                {[
                  "Appartment",
                  "CustomHouse",
                  "GrannyHouse",
                  "Duplex",
                  "Villa",
                  "Office",
                  "Commercial",
                  "Parking",
                  "Shop",
                ]?.map((icon: string) => (
                  <div
                    onMouseEnter={() => setActive(icon)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(icon)}
                    onClick={() =>
                      setPropertyTypePayload((prev) => ({ ...prev, img: icon }))
                    }
                    className={cn(
                      "flex items-center justify-center rounded-lg cursor-pointer bg-white border-2 ",
                      `${active === icon || propertyTypePayload?.img === icon ? "shadow-sm border-primary/90" : "shadow-xs border-white"}`,
                    )}
                  >
                    <Icon
                      name={icon as any}
                      className={`w-1/2 h-1/2`}
                      color={
                        active === icon || propertyTypePayload?.img === icon
                          ? "var(--primary)"
                          : "var(--muted-foreground)"
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
            {errors?.img && <FormError message={errors?.img} />}
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
              " Property Type" +
              (isUpdatePending || isPending ? "..." : "")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PropertyTypeForm;