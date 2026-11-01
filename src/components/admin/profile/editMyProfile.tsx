import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getMyprofileInfo, updateMyprofile } from '../../../actions/common';
import { useAuth } from "../../../context/AuthContext";
import { toast } from '../../../custom-hooks/use-toast';

type FormValues = {
    first_name: string;
    middle_name: string;
    last_name: string;
    user_name: string;
    email: string;
    phone_number: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | '';
    country: string;

    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    zip: string;
    
    // Company fields (optional / nullable)
    company_name?: string;
    company_number?: string;
    company_address?: string;
    company_email?: string;
    company_phone?: string;
};

function EditProfile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();


    const {
        data: profileResponse,
        isLoading: isProfileLoading,
        error: profileError,
    } = useQuery({
        queryKey: ["MyProfileDetails"],
        queryFn: () => getMyprofileInfo(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });

    const userDetails = profileResponse?.result?.userDetails;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
    } = useForm<FormValues>({
        mode: 'onChange',
        // Do NOT set defaultValues here statically
    });

    // When real data arrives → reset form with real values
    useEffect(() => {
        if (userDetails) {
            const company = userDetails.company_details || {};

            reset({
                first_name: userDetails.first_name || '',
                middle_name: userDetails.middle_name || '',
                last_name: userDetails.last_name || '',
                user_name: userDetails.user_name || '',
                email: userDetails.email || '',
                phone_number: userDetails.phone_number?.toString() || '',
                gender: (userDetails.gender as FormValues['gender']) || '',
                country: userDetails.country || '',

                address_line_1: userDetails.address_line_1 || '',
                address_line_2: userDetails.address_line_2 || '',
                city: userDetails.city || '',
                state: userDetails.state || '',
                zip: userDetails.zip || '',

                // Company fields — safe access with fallback to empty string
                company_name: company.company_name || '',
                company_number: company.company_number?.toString() || '',
                company_address: company.company_address || '',
                company_email: company.company_email || '',
                company_phone: company.company_phone || '',
            });
        }
    }, [userDetails, reset]);

    // ────────────────────────────────────────────────
    //  Update mutation
    // ────────────────────────────────────────────────
    const updateMutation = useMutation({
        mutationFn: (payload: any) => updateMyprofile(payload),

        onSuccess: (responseData, sentData) => {
            queryClient.invalidateQueries({ queryKey: ["MyProfileDetails"] });
            toast({
                title: `Profile updated successfully!`,
                description: ``,
                variant: "success",
            });
            navigate("/profile");
        },

        onError: (err: any) => {
            console.error("Profile update failed:", err);

            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update profile. Please try again.";

            alert(message);
            // toast.error(message);
        },
    });

    // ────────────────────────────────────────────────
    //  Submit handler – shape payload like backend expects
    // ────────────────────────────────────────────────
    const onSubmit = async (formData: FormValues) => {
        const payload = {
            first_name: formData.first_name.trim(),
            middle_name: formData.middle_name?.trim() || "",
            last_name: formData.last_name.trim(),
            user_name: formData.user_name.trim(),
            email: formData.email.trim(),
            phone_number: formData.phone_number?.trim() || null,
            gender: formData.gender || null,
            country: formData.country?.trim() || null,

            
address_line_1: formData.address_line_1?.trim() || null,
            address_line_2: formData.address_line_2?.trim() || null,
            city: formData.city?.trim() || null,
            state: formData.state?.trim() || null,
            zip: formData.zip?.trim() || null,

            // address_line_1: userDetails?.address_line_1 || null,
            // address_line_2: userDetails?.address_line_2 || null,
            // city: userDetails?.city || null,
            // state: userDetails?.state || null,
            // zip: userDetails?.zip || null,
            date_of_birth: userDetails?.date_of_birth || null,
            contact_label: userDetails?.contact_label || null,
            phone_extension: userDetails?.phone_extension || null,

            // Company object – even if empty
            company_details: {
                company_name: formData.company_name?.trim() || null,
                company_number: formData.company_number?.trim() || null,
                company_address: formData.company_address?.trim() || null,
                company_email: formData.company_email?.trim() || null,
                company_phone: formData.company_phone?.trim() || null,
            },
        };

        // Optional: clean up empty strings → null (depends on backend)
        // Object.keys(payload).forEach((key) => {
        //   if (payload[key] === "") payload[key] = null;
        // });

        console.log("Submitting payload:", payload);

        updateMutation.mutate(payload);
    };

    if (isProfileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg text-gray-600">Loading profile...</div>
            </div>
        );
    }

    if (profileError || !userDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg text-red-600">
                    Failed to load profile. Please try again later.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="h-28 bg-gradient-to-r from-[#3352A4] to-indigo-700 relative">
                        <div className="absolute -bottom-12 left-6">
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                                <img
                                    src="https://rentmatch-files.s3.ap-south-1.amazonaws.com/property/images/1772028918826.jpg"
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="px-6 pt-16 pb-10">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Profile</h1>
                        <p className="text-gray-600 mb-8">Update your personal and company information</p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Personal Information */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-primary/30 pb-2">
                                    Personal Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name *
                                        </label>
                                        <input
                                            {...register('first_name', { required: 'First name is required' })}
                                            className={`block w-full rounded-lg border ${errors.first_name ? 'border-red-500' : 'border-gray-300'
                                                } px-4 py-2.5 focus:border-primary focus:ring-primary outline-none transition-colors`}
                                        />
                                        {errors.first_name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Middle Name
                                        </label>
                                        <input
                                            {...register('middle_name')}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-primary outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name *
                                        </label>
                                        <input
                                            {...register('last_name', { required: 'Last name is required' })}
                                            className={`block w-full rounded-lg border ${errors.last_name ? 'border-red-500' : 'border-gray-300'
                                                } px-4 py-2.5 focus:border-primary focus:ring-primary outline-none transition-colors`}
                                        />
                                        {errors.last_name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Username *
                                        </label>
                                        <input
                                            {...register('user_name', { required: 'Username is required' })}
                                            className={`block w-full rounded-lg border ${errors.user_name ? 'border-red-500' : 'border-gray-300'
                                                } px-4 py-2.5 focus:border-primary focus:ring-primary outline-none transition-colors`}
                                            disabled

                                        />
                                        {errors.user_name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.user_name.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Invalid email address',
                                                },
                                            })}
                                            className={`block w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                } px-4 py-2.5 focus:border-primary focus:ring-primary outline-none transition-colors`}
                                            disabled
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            {...register('phone_number')}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-primary outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Gender
                                        </label>
                                        <select
                                            {...register('gender')}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-primary outline-none transition-colors bg-white"
                                        >
                                            <option value="">Select gender</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Country
                                        </label>
                                        <input
                                            {...register('country')}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-primary outline-none transition-colors"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address Line 1
                                        </label>
                                        <input
                                            {...register('address_line_1')}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-primary outline-none transition-colors"
                                            placeholder="House no., Street name"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address Line 2 (Optional)
                                        </label>
                                        <input
                                            {...register('address_line_2')}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-primary outline-none transition-colors"
                                            placeholder="Apartment, suite, unit, etc."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City
                                        </label>
                                        <input
                                            {...register('city')}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-primary outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            State / Province
                                        </label>
                                        <input
                                            {...register('state')}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-primary outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            ZIP / Postal Code
                                        </label>
                                        <input
                                            {...register('zip')}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-primary outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Company Details - shown only for PROPERTY MANAGER */}
                            {user?.role === 'PROPERTY MANAGER' && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-primary/30 pb-2">
                                        Company / Business Details
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Company Name
                                            </label>
                                            <input
                                                {...register('company_name')}
                                                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-primary outline-none transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Company Number
                                            </label>
                                            <input
                                                {...register('company_number')}
                                                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-primary outline-none transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Company Email
                                            </label>
                                            <input
                                                type="email"
                                                {...register('company_email')}
                                                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-primary outline-none transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Company Phone
                                            </label>
                                            <input
                                                {...register('company_phone')}
                                                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-primary outline-none transition-colors"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Company Address
                                            </label>
                                            <input
                                                {...register('company_address')}
                                                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-primary outline-none transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || updateMutation.isPending}
                                    className={`flex-1 px-6 py-3 bg-primary hover:bg-[#2a4489] text-white font-medium rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${(isSubmitting || updateMutation.isPending) ? 'cursor-wait' : ''
                                        }`}
                                >
                                    {(isSubmitting || updateMutation.isPending) ? 'Saving...' : 'Save Changes'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;