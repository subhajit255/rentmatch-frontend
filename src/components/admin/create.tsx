import React, { memo, useEffect, useState } from "react"
import { Required } from "../ui/miscellenious"
import { Input } from "../ui/input"
import { FormError } from "../errors"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { toast } from "../../custom-hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { createAdminSchema } from "../../schemas/cms"
import { addAdminPayload } from "../../types/admin"
import { createAdminApi, updateAdminApi } from "../../actions/cms/admin"

const AddAdmin = () => {
    const { state } = useLocation();
    // console.log(state, "<--- what is state");

    // state
    //     {
    //     "_id": "699d8c5728482bfd64f2b57a",
    //     "first_name": "soumadip",
    //     "middle_name": "",
    //     "last_name": "hazra",
    //     "user_name": "soumitaHazra33",
    //     "email": "soumita.admins@test.com",
    //     "phone_number": 9129900093,
    //     "password": "$2a$10$0OCjtwqhOxl9rU780yFNKedca6UQuCW8g.Hs.RZgbxcQnDwpwRUw.",
    //     "is_disabled": false,
    //     "role": "ADMIN",
    //     "gender": "MALE",
    //     "address_line_1": "kolkata",
    //     "address_line_2": "kolkata",
    //     "city": null,
    //     "state": null,
    //     "country": null,
    //     "zip": null,
    //     "contact_label": null,
    //     "phone_extension": 91,
    //     "is_registered": true,
    //     "last_login_date": "2026-03-19T09:13:12.497Z",
    //     "created_by": null,
    //     "devices_token": null,
    //     "otp": null,
    //     "expiresAt": null,
    //     "created_date": "2026-02-24T11:32:39.956Z",
    //     "createdAt": "2026-02-24T11:32:39.962Z",
    //     "updatedAt": "2026-03-19T09:13:12.499Z",
    //     "__v": 0,
    //     "id": "699d8c5728482bfd64f2b57a",
    //     "rolePermission": null
    // }
    
    const navigate = useNavigate()
    const { curRole, _id } = useParams();
    const queryClient = useQueryClient();
    const [payload, setPayload] = useState<addAdminPayload>({
        "first_name": "",
        "middle_name": "",
        "last_name": "",
        "email": ""
    })
    const [errors, setErrors] = useState({
        "first_name": "",
        "last_name": "",
        "email": ""
    })

    useEffect(() => {
        if (_id && state) {
            setPayload({
                first_name: state.first_name || "",
                middle_name: state.middle_name || "",
                last_name: state.last_name || "",
                email: state.email || ""
            });
        }
    }, [_id, state]);
    //create addAdmin
    const { mutate: createAdmin, isPending } = useMutation({
        mutationFn: (payload: addAdminPayload) =>
            createAdminApi(payload),
        onSuccess: () => {
            // This will trigger refetch of ['users']
            queryClient.invalidateQueries({ queryKey: ["user_management"] });
            toast({
                title: `Admin Created`,
                description: `The new admin has been successfully created.`,
                variant: "success",
            });
            navigate("/admin/" + curRole);
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
        mutationFn: (payload: addAdminPayload) =>
            updateAdminApi(payload, _id ?? ""),
        onSuccess: () => {
            // This will trigger refetch of ['users']
            queryClient.invalidateQueries({ queryKey: ["user_management"] });
            toast({
                title: `FAQ Updated`,
                description: `The addAdmin has been successfully updated.`,
                variant: "success",
            });
            navigate("/admin/" + curRole);
        },
        onError: (error) => {
            toast({
                title: `Failed to Create FAQ`,
                description: `An error occurred while updating the addAdmin. Please try again.`,
                variant: "error",
            });
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setPayload(prev => ({ ...prev, [name]: value }))
        setErrors(prev => ({ ...prev, [name]: "" }))
    }

    const handleSaveBtn = () => {
        const validation = createAdminSchema.safeParse(payload);
        if (!validation.success) {
            console.log("validation.error.issues : ", validation.error.issues);

            const formError: any = {};
            validation.error.issues.forEach((err) => {
                const field = err.path[0];
                formError[field] = err.message;
            });
            console.log("formError ::: ", formError);

            setErrors((prev) => ({
                ...prev,
                first_name: formError?.first_name ?? "",
                last_name: formError?.last_name ?? "",
                email: formError?.email ?? "",
            }));
            return;
        }
        if (_id) {
            updateFaq(payload);
            return;
        }
        createAdmin(payload);
    };

    return <div>
        <div className="flex flex-col gap-7 my-5">
            <div className="text-center text-2xl font-bold">Add Admin</div>
            <div className="flex flex-col gap-6 2xl:gap-8 bg-white py-10 px-8 rounded-lg shadow-md w-[60%] mx-auto">
                <div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="first_name" className="font-medium">
                            First Name <Required />
                        </Label>
                        <Input
                            name="first_name"
                            onChange={handleChange}
                            value={payload?.first_name}
                            type="text"
                            className="rounded-md p-2"
                            placeholder="Enter first name"
                        />
                    </div>
                    {errors?.first_name && <FormError message={errors?.first_name} />}
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="middle_name" className="font-medium">
                        Middle Name <Required />
                    </Label>
                    <Input
                        name="middle_name"
                        onChange={handleChange}
                        value={payload?.middle_name}
                        type="text"
                        className="rounded-md p-2"
                        placeholder="Enter middle name"
                    />
                </div>
                <div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="last_name" className="font-medium">
                            last Name <Required />
                        </Label>
                        <Input
                            name="last_name"
                            onChange={handleChange}
                            value={payload?.last_name}
                            type="text"
                            className="rounded-md p-2"
                            placeholder="Enter last name"
                        />
                    </div>
                    {errors?.last_name && <FormError message={errors?.last_name} />}
                </div>
                <div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="email" className="font-medium">
                            Email <Required />
                        </Label>
                        <Input
                            name="email"
                            onChange={handleChange}
                            value={payload?.email}
                            type="email"
                            className="rounded-md p-2"
                            placeholder="Enter last name"
                        />
                    </div>
                    {errors?.email && <FormError message={errors?.email} />}
                </div>
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
                    " Admin" +
                    (isUpdatePending || isPending ? "..." : "")}
            </Button>
        </div>
    </div>
}

export default AddAdmin
