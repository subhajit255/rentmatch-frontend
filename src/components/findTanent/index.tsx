import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import Icon from "../icons/icon";
import PostCard from "./postCard";
import { Slider } from "../ui/slider";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { balcony, bathrooms, bedrooms, garages } from "../../constants/property";
import { getAllPost } from "../../actions/myPost";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { advanceSearch } from "@/src/types/property";
import { IMAGES } from "../../assets/index";
import { SearchX } from "lucide-react";
import { Input } from "../ui/input";


const FindTenants = () => {
    const { user } = useAuth()
    const [params, setParams] = useState<advanceSearch>({
        start_price: "0",
        end_price: "0",
        // start_size: "0",
        // end_size: "0",
        garages: "",
        bathrooms: "",
        bedrooms: "",
        balcony: "",
        rentalCityPreference: "",
        rentalStatePreference: "",
    });
    const [appliedParams, setAppliedParams] = useState<advanceSearch | null>(null);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(100);
    // getAllPost

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['all_post', page, limit, appliedParams],
        queryFn: () => getAllPost(page, limit, appliedParams),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        // enabled: false
    });

    const postData: any[] = useMemo(() => {
        return isLoading ? [] : data?.result ?? [];
    }, [data])

    const handleSelectChange = (field: string, value: string) => {
        setParams(prev => ({ ...prev, [field]: value }));
    }

    const handleRangeChange = (field: string, value: number | number[]) => {
        if (Array.isArray(value)) {
            setParams(prev => ({ ...prev, [`start_${field}`]: value[0].toString(), [`end_${field}`]: value[1].toString() }));
        } else {
            setParams(prev => ({ ...prev, [field]: value.toString() }));
        }
    }

    const handleSearch = () => {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
        );

        console.log(filteredParams, "<-- cleaned search params");
        setAppliedParams(filteredParams);
        setPage(1);
        refetch();

    }

    // empty state is rendered inside the results column so the filter panel stays usable
    const emptyState = <div className="col-span-full flex justify-center items-center mt-10">
        <div className="flex justify-center items-center flex-col">
            <img
                src={IMAGES.error}
                alt="No Properties"
                className="mb-4 w-[50%]"
            />
            <div className="text-2xl">
                <div className="relative mb-6">
                    <div className="absolute inset-0 animate-ping rounded-full bg-primary opacity-20"></div>
                    {/* <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"> */}
                    {/* <SearchX size={20} className="text-primary" strokeWidth={1.5} /> */}
                    As of now, no post are availabe !
                    {/* </div> */}
                </div>
            </div>
        </div>
    </div>

    return <div className="py-4">
        <div className="w-full grid grid-cols-1 lg:grid-cols-7 gap-5">
            <div className="lg:col-span-5">
                <div className="rounded-lg w-full bg-white ">
                    <div className="grid lg:h-[67dvh] overflow-y-auto thin-scrollbar  grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 px-4 py-4">
                        {
                            isLoading ?
                                <div className="col-span-full flex justify-center items-center py-10 text-muted-foreground">Loading...</div>
                                : postData && postData.length > 0 ?
                                    postData?.map((postDetails, index) =>
                                        <PostCard key={index} postDetails={postDetails} isGuest={user?.role === "GUEST"} />
                                    ) : emptyState
                        }
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-between w-full lg:col-span-2">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <Icon name="Play" color="var(--muted-foreground)" fill="var(--muted-foreground)" />
                        <h3 className="text-lg/[1.5] font-bold text-warning">Advance Search</h3>
                    </div>
                    <div className="h-[50dvh] overflow-y-auto thin-scrollbar  pr-3 py-2">
                        <div className="grid grid-cols-1 gap-5 ">
                            <div className="w-full">
                                <div className="flex flex-col gap-2">
                                    <Label >Price: ${params?.start_price} - ${params?.end_price}</Label>
                                    <Slider
                                        value={[params?.start_price, params?.end_price].map(Number)}
                                        onValueChange={val => handleRangeChange("price", val)}
                                        // onValueChange={val => setMyPostPayload(prev => ({ ...prev, start_price: val[0].toString(), end_price: val[1].toString() }))}
                                        min={100}
                                        max={100000}
                                        step={1}
                                    />
                                </div>
                            </div>
                            {/* <div className="w-full">
                                <div className="flex flex-col gap-2">
                                    <Label >Size: {params?.start_size} sqm - {params?.end_size} sqm</Label>
                                    <Slider
                                        value={[params?.start_size, params?.end_size].map(Number)}
                                        onValueChange={val => handleRangeChange("size", val)}
                                        // onValueChange={val => setMyPostPayload(prev => ({ ...prev, start_size: val[0].toString(), end_size: val[1].toString() }))}
                                        min={0}
                                        max={20000}
                                        step={1}
                                    />
                                </div>
                            </div> */}

                            <div className="w-full">
                                <div className="flex flex-col gap-2.5 ">
                                    <Label >Garages </Label>
                                    <Select
                                        onValueChange={(val) => handleSelectChange("garages", val)}
                                        value={params?.garages}
                                    >
                                        <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
                                            <SelectValue placeholder="Select Your Garages" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                garages?.map(garage =>
                                                    <SelectItem key={garage?.id} value={garage?.value}>{garage?.title}</SelectItem>
                                                )
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="flex flex-col gap-2.5 ">
                                    <Label >Bathrooms </Label>
                                    <Select
                                        onValueChange={(val) => handleSelectChange("bathrooms", val)}
                                        value={params?.bathrooms}
                                    >
                                        <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
                                            <SelectValue placeholder="Select Your Bathrooms" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                bathrooms?.map(bathroom =>
                                                    <SelectItem key={bathroom?.id} value={bathroom?.value}>{bathroom?.title}</SelectItem>
                                                )
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* {errors?.bathrooms && <FormError message={errors?.bathrooms} />} */}
                            </div>
                            <div className="w-full">
                                <div className="flex flex-col gap-2.5 ">
                                    <Label >Bedrooms </Label>
                                    <Select
                                        onValueChange={(val) => handleSelectChange("bedrooms", val)}
                                        value={params?.bedrooms}
                                    >
                                        <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
                                            <SelectValue placeholder="Select Your Bedrooms" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                bedrooms?.map(bedroom =>
                                                    <SelectItem key={bedroom?.id} value={bedroom?.value}>{bedroom?.title}</SelectItem>
                                                )
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* <div className="w-full">
                                <div className="flex flex-col gap-2.5">
                                    <Label >Balcony</Label>
                                    <Select
                                        onValueChange={(val) => handleSelectChange("balcony", val)}
                                        value={params?.balcony}
                                    >
                                        <SelectTrigger className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
                                            <SelectValue placeholder="Select Your Balcony" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                balcony?.map(balconyItem =>
                                                    <SelectItem key={balconyItem?.id} value={balconyItem?.value}>{balconyItem?.title}</SelectItem>
                                                )
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div> */}



                            <div className="w-full">
                                <div className="flex flex-col gap-2.5">
                                    <Label htmlFor="rentalStatePreference">Suburb Zones</Label>
                                    <Input
                                        id="rentalStatePreference"
                                        type="text"
                                        placeholder="Enter Suburb Zones Preference"
                                        className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none"
                                        value={params?.rentalStatePreference || ""}
                                        onChange={(e) => handleSelectChange("rentalStatePreference", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="w-full">
                                <div className="flex flex-col gap-2.5">
                                    <Label htmlFor="rentalCityPreference">Suburb</Label>
                                    <Input
                                        id="rentalCityPreference"
                                        type="text"
                                        placeholder="Enter Suburb Preference"
                                        className="w-full h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none"
                                        value={params?.rentalCityPreference || ""}
                                        onChange={(e) => handleSelectChange("rentalCityPreference", e.target.value)}
                                    />
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
                {<div className="w-full flex justify-center">
                    <Button onClick={handleSearch} className="rounded-full">Find Tenant</Button>
                </div>}
            </div>
        </div>

    </div>
}

export default FindTenants;