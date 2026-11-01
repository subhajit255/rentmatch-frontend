import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getMyprofileInfo } from '../../../actions/common';
import { IMAGES } from '../../../assets/index';
import { useAuth } from "../../../context/AuthContext";


function ProfileDetails() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const {
        data: ProfileDetails,
        isLoading: isProfileLoading,
        error: ProfileError,
    } = useQuery({
        queryKey: ["MyProfileDetails"],
        queryFn: () => getMyprofileInfo(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    console.log(ProfileDetails?.result?.userDetails, "<---??")
    if (isProfileLoading) {
        return <div>Loading...</div>;
    }

    if (ProfileError) {
        return <div>Error fetching data</div>;
    }
    const userDetails = ProfileDetails?.result?.userDetails;
    const fullName = [userDetails.first_name, userDetails.middle_name, userDetails.last_name]
        .filter(Boolean)
        .join(" ");

    const fullAddress = [userDetails.address_line_1, userDetails.address_line_2, userDetails.city]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header / Card */}
                <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
                    {/* Top banner / cover area */}
                    <div className="h-32 bg-gradient-to-r from-[#3352A4] to-indigo-700">
                        <img alt="Group" src="/assets/174ec0d35b481292983b.png" />

                    </div>

                    <div className="px-6 pb-8 relative">
                        {/* Profile picture */}
                        <div className="absolute -top-16 left-6">
                            <div className="relative">
                                <img
                                    src={userDetails.profile_image || IMAGES.user_img}
                                    alt={`${fullName}'s profile`}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                                />
                                {userDetails.is_verified && (
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium border-2 border-white">
                                        Verified
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Main content */}
                        <div className="pt-20">
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
                                    <p className="text-lg text-gray-600 mt-1">@{userDetails.user_name}</p>
                                    <div className="flex items-center gap-4 mt-3">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/30">
                                            {userDetails.role}
                                        </span>
                                        {userDetails.is_subscribe && userDetails.role !== 'TENANT' && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                                                Premium Member
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    className="mt-4 sm:mt-0 px-6 py-2.5 bg-primary hover:bg-[#2a4489] text-white font-medium rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
                                    onClick={() => {
                                        navigate("/profile/edit")
                                    }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Edit Profile
                                </button>
                            </div>

                            {/* Grid of details */}
                            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Personal Information */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-800 border-b border-primary/30 pb-2">
                                        Personal Information
                                    </h2>

                                    <div className="space-y-4">
                                        <DetailItem label="Email" value={userDetails.email} />
                                        <DetailItem label="Phone" value={userDetails.phone_number?.toString()} />
                                        <DetailItem label="Gender" value={userDetails.gender} />
                                        <DetailItem label="Address" value={fullAddress} />
                                        <DetailItem label="Country" value={userDetails.country} />
                                    </div>
                                </div>

                                {/* Company / Business */}
                                {user?.role === 'PROPERTY MANAGER' && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-semibold text-gray-800 border-b border-primary/30 pb-2">
                                            Company Details
                                        </h2>

                                        <div className="space-y-4">
                                            <DetailItem label="Company Name" value={userDetails.company_details?.company_name} />
                                            <DetailItem label="Company Number" value={userDetails.company_details?.company_number?.toString()} />
                                            <DetailItem label="Company Email" value={userDetails.company_details?.company_email} />
                                            <DetailItem label="Company Phone" value={userDetails.company_details?.company_phone} />
                                            <DetailItem label="Company Address" value={userDetails.company_details?.company_address} />
                                        </div>
                                    </div>)}
                            </div>

                            {/* Account Info Footer */}
                            <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
                                <div className="flex flex-wrap gap-x-8 gap-y-2">
                                    <div>
                                        Member ID: <span className="font-medium text-gray-700">{"userDetails.member_id"}</span>
                                    </div>
                                    <div>
                                        Joined: <span className="font-medium text-gray-700">{new Date(userDetails.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                        Last Login: <span className="font-medium text-gray-700">{new Date(userDetails.last_login_date).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

type DetailItemProps = {
    label: string;
    value?: string | null;
};

function DetailItem({ label, value }: DetailItemProps) {
    if (!value) return null;

    return (
        <div>
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-gray-900">{value}</dd>
        </div>
    );
}

export default ProfileDetails;