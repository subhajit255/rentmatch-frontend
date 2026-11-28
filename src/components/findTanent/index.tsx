import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import PostCard from "./postCard";
import { Slider } from "../ui/slider";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { bathrooms, bedrooms, garages } from "../../constants/property";
import { getAllPost } from "../../actions/myPost";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { advanceSearch } from "@/src/types/property";
import { IMAGES } from "../../assets/index";
import { Input } from "../ui/input";
import { Lock, Play, RotateCcw } from "lucide-react";

const DEMO_TENANT_POSTS = [
    {
        _id: "demo-1",
        created_by: {
            user_name: "RM-4812",
            first_name: "Renter",
            last_name: "RM-4812",
            gender: "Male"
        },
        subject: "Looking for bright modern apartment",
        location: "Newtown and Inner West",
        rentalCityPreference: "Newtown and Inner West",
        rentalStatePreference: "NSW",
        move_in_requirements: "2026-11-28",
        start_price: 600,
        end_price: 700,
        match_percentage: 92,
        is_wishlisted: false,
        pets: "no"
    },
    {
        _id: "demo-2",
        created_by: {
            user_name: "RM-1940",
            first_name: "Renter",
            last_name: "RM-1940",
            gender: "Female"
        },
        subject: "Courtyard home with quiet surroundings",
        location: "Marrickville",
        rentalCityPreference: "Marrickville",
        rentalStatePreference: "NSW",
        move_in_requirements: "2026-11-20",
        start_price: 650,
        end_price: 720,
        match_percentage: 88,
        is_wishlisted: false,
        pets: "dog"
    },
    {
        _id: "demo-3",
        created_by: {
            user_name: "RM-6027",
            first_name: "Renter",
            last_name: "RM-6027",
            gender: "Male"
        },
        subject: "Spacious unit near public transport",
        location: "Inner West, within 10 km",
        rentalCityPreference: "Inner West, within 10 km",
        rentalStatePreference: "NSW",
        move_in_requirements: "2026-12-01",
        start_price: 680,
        end_price: 780,
        match_percentage: 94,
        is_wishlisted: false,
        pets: "no"
    }
];

const ACCESSIBILITY_OPTIONS = [
    { id: "any", title: "Any", value: "any" },
    { id: "step_free", title: "Step-free entry", value: "step_free" },
    { id: "ground_floor", title: "Ground floor living", value: "ground_floor" },
    { id: "wide_doors", title: "Wide doorways", value: "wide_doors" },
    { id: "accessible_bath", title: "Accessible bathroom", value: "accessible_bath" },
];

const DEFAULT_PARAMS: advanceSearch & { accessibility?: string } = {
    start_price: "0",
    end_price: "2000",
    garages: "",
    bathrooms: "",
    bedrooms: "",
    balcony: "",
    rentalCityPreference: "",
    rentalStatePreference: "",
    accessibility: "",
};

const FindTenants = () => {
    const { user } = useAuth();
    const [params, setParams] = useState<advanceSearch & { accessibility?: string }>({ ...DEFAULT_PARAMS });

    const [appliedParams, setAppliedParams] = useState<advanceSearch | null>(null);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(100);
    const [resetKey, setResetKey] = useState<number>(0);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['all_post', page, limit, appliedParams],
        queryFn: () => getAllPost(page, limit, appliedParams),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const postData: any[] = useMemo(() => {
        if (isLoading) return [];
        if (Array.isArray(data?.result) && data.result.length > 0) {
            return data.result;
        }
        if (isError || (data?.result && data.result.length === 0 && !appliedParams)) {
            return DEMO_TENANT_POSTS;
        }
        return data?.result ?? [];
    }, [data, isLoading, isError, appliedParams]);

    const handleSelectChange = (field: string, value: string) => {
        setParams(prev => ({ ...prev, [field]: value }));
    };

    const handleRangeChange = (field: string, value: number | number[]) => {
        if (Array.isArray(value)) {
            setParams(prev => ({ ...prev, [`start_${field}`]: value[0].toString(), [`end_${field}`]: value[1].toString() }));
        } else {
            setParams(prev => ({ ...prev, [field]: value.toString() }));
        }
    };

    const handleSearch = () => {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined && value !== "any")
        );
        setAppliedParams(filteredParams);
        setPage(1);
    };

    const handleReset = () => {
        setParams({ ...DEFAULT_PARAMS });
        setAppliedParams(null);
        setPage(1);
        setResetKey((prev) => prev + 1);
    };

    const emptyState = (
        <div className="flex flex-col justify-center items-center py-16 bg-white rounded-2xl border border-slate-100 p-8 shadow-xs text-center">
            <img
                src={IMAGES.error}
                alt="No Properties"
                className="mb-4 w-40 opacity-80"
            />
            <h4 className="text-lg font-bold text-slate-800">No tenant requests found</h4>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
                Try broadening your budget or search criteria to see more prospective renters.
            </p>
        </div>
    );

    return (
        <div className="py-4 max-w-[1500px] mx-auto">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Privacy Banner + Stacked Tenant Cards */}
                <div className="lg:col-span-8 flex flex-col">
                    {/* Privacy notice banner matching mockup */}
                    <div className="w-full bg-[#EBF3FE] border border-[#BFDBFE]/60 rounded-2xl py-3 px-5 flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#1E40AF] mb-5 shadow-2xs">
                        <Lock className="w-4 h-4 text-[#1E40AF] shrink-0" />
                        <span>Contact details stay private until the renter accepts your invitation.</span>
                    </div>

                    {/* Cards List matching mockup */}
                    <div className="flex flex-col gap-4 max-h-[calc(100vh-210px)] overflow-y-auto thin-scrollbar pr-2 pb-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-16 text-slate-400 font-medium">
                                Loading tenants...
                            </div>
                        ) : postData && postData.length > 0 ? (
                            postData.map((postDetails, index) => (
                                <PostCard
                                    key={postDetails._id || index}
                                    postDetails={postDetails}
                                    isGuest={user?.role === "GUEST"}
                                    index={index}
                                />
                            ))
                        ) : (
                            emptyState
                        )}
                    </div>
                </div>

                {/* Right Column: Advance Search Panel */}
                <div className="lg:col-span-4 sticky top-4">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_14px_rgba(0,0,0,0.03)] p-6 flex flex-col gap-5">
                        {/* Title matching mockup */}
                        <div className="flex items-center gap-2 pb-1">
                            <Play className="w-4 h-4 fill-[#EA580C] text-[#EA580C]" />
                            <h3 className="text-lg font-bold text-[#EA580C] tracking-tight">Advance Search</h3>
                        </div>

                        {/* Rent Slider */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs font-semibold text-slate-700">
                                Weekly rent: ${Number(params?.start_price || 0).toLocaleString()} to ${Number(params?.end_price || 2000).toLocaleString()}
                            </Label>
                            <Slider
                                value={[Number(params?.start_price || 0), Number(params?.end_price || 2000)]}
                                onValueChange={val => handleRangeChange("price", val)}
                                min={0}
                                max={10000}
                                step={50}
                                className="py-2"
                            />
                        </div>

                        {/* Garages */}
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs font-semibold text-slate-700">Garages</Label>
                            <Select
                                key={`${resetKey}-garages`}
                                onValueChange={(val) => handleSelectChange("garages", val)}
                                value={params?.garages || undefined}
                            >
                                <SelectTrigger className="w-full h-11 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs shadow-none hover:border-slate-300 transition-colors">
                                    <SelectValue placeholder="Select your garages" />
                                </SelectTrigger>
                                <SelectContent>
                                    {garages?.map(garage => (
                                        <SelectItem key={garage?.id} value={garage?.value}>
                                            {garage?.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Bathrooms */}
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs font-semibold text-slate-700">Bathrooms</Label>
                            <Select
                                key={`${resetKey}-bathrooms`}
                                onValueChange={(val) => handleSelectChange("bathrooms", val)}
                                value={params?.bathrooms || undefined}
                            >
                                <SelectTrigger className="w-full h-11 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs shadow-none hover:border-slate-300 transition-colors">
                                    <SelectValue placeholder="Select your bathrooms" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bathrooms?.map(bathroom => (
                                        <SelectItem key={bathroom?.id} value={bathroom?.value}>
                                            {bathroom?.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Bedrooms */}
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs font-semibold text-slate-700">Bedrooms</Label>
                            <Select
                                key={`${resetKey}-bedrooms`}
                                onValueChange={(val) => handleSelectChange("bedrooms", val)}
                                value={params?.bedrooms || undefined}
                            >
                                <SelectTrigger className="w-full h-11 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs shadow-none hover:border-slate-300 transition-colors">
                                    <SelectValue placeholder="Select your bedrooms" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bedrooms?.map(bedroom => (
                                        <SelectItem key={bedroom?.id} value={bedroom?.value}>
                                            {bedroom?.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Accessibility needs it can meet */}
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs font-semibold text-slate-700">Accessibility needs it can meet</Label>
                            <Select
                                key={`${resetKey}-accessibility`}
                                onValueChange={(val) => handleSelectChange("accessibility", val)}
                                value={params?.accessibility || undefined}
                            >
                                <SelectTrigger className="w-full h-11 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs shadow-none hover:border-slate-300 transition-colors">
                                    <SelectValue placeholder="Select accessibility features" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ACCESSIBILITY_OPTIONS.map(opt => (
                                        <SelectItem key={opt.id} value={opt.value}>
                                            {opt.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Suburb zones */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="suburbZones" className="text-xs font-semibold text-slate-700">Suburb zones</Label>
                            <Input
                                id="suburbZones"
                                type="text"
                                placeholder="Enter suburb zone preference"
                                className="w-full h-11 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs shadow-none placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#1E3A8A]"
                                value={params?.rentalCityPreference || ""}
                                onChange={(e) => handleSelectChange("rentalCityPreference", e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSearch();
                                    }
                                }}
                            />
                        </div>

                        {/* Find Tenant & Reset action buttons */}
                        <div className="w-full flex items-center gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                                className="rounded-full border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold px-5 py-2.5 h-11 text-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSearch}
                                className="flex-1 rounded-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold px-8 py-2.5 h-11 text-sm shadow-sm transition-all cursor-pointer"
                            >
                                Find Tenant
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindTenants;
