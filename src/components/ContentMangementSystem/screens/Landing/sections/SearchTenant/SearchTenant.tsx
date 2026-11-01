import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../../../context/AuthContext";
import { advanceSearch } from "@/src/types/property";
import { getAllPostCMS } from "../../../../../../actions/myPost";
import { getProprtyTypeList } from "../../../../../../actions/cms/cmsPageApis";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../ui/select";
import { Button } from "../../../../../ui/button";
import { MapPin, Search, Filter, RefreshCw, Sparkles } from "lucide-react";
import { Input } from "../../../../../ui/input";
import Tenant from "../../../../../ChildComponent/Tenant";
import { IMAGES } from "../../../../../../assets/index";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { toast } from "../../../../../../custom-hooks/use-toast";

const properties = [
  {
    id: "1",
    user: {
      name: "Indranil Sen",
      image: IMAGES.user_img,
    },
    title: "Looking for 2BR apartment for rent",
    location: "Newport, NSW",
    postedDate: "28 Aug 2024 | 19:35",
    price: "$1000 - $1500",
    type: "Apartment",
    sqm: "700sqm - 1400sqm",
    beds: 3,
    baths: 2,
    isUrgent: true,
  },
  {
    id: "2",
    user: {
      name: "Anonymous",
      image: IMAGES.user_img,
    },
    title: "Looking for 2BR apartment for rent",
    location: "Dee Why, NSW",
    postedDate: "28 Aug 2024 | 19:35",
    price: "$1000 - $1500",
    type: "Apartment",
    sqm: "700sqm - 1400sqm",
    beds: 3,
    baths: 2,
    isUrgent: false,
  },
  {
    id: "3",
    user: {
      name: "Anonymous",
      image: IMAGES.user_img,
    },
    title: "Looking for 2BR apartment for rent",
    location: "Mona Vale, NSW",
    postedDate: "28 Aug 2024 | 19:35",
    price: "$1000 - $1500",
    type: "Apartment",
    sqm: "700sqm - 1400sqm",
    beds: 3,
    baths: 2,
    isUrgent: false,
  },
  {
    id: "4",
    user: {
      name: "Indranil Sen",
      image: IMAGES.user_img,
    },
    title: "Looking for 2BR apartment for rent",
    location: "Manly, NSW",
    postedDate: "28 Aug 2024 | 19:35",
    price: "$1000 - $1500",
    type: "Apartment",
    sqm: "700sqm - 1400sqm",
    beds: 3,
    baths: 2,
    isUrgent: false,
  },
];

interface NormalizedPost {
  id: string;
  user: {
    name: string;
    image: string;
    gender?: string;
  };
  type: string;
  location: string;
  title: string;
  beds: number;
  baths: number;
  sqm: string;
  postedDate: any;
  price: string;
  isUrgent: boolean;
}

const SearchTenant = () => {
  const navigate = useNavigate();

  const [searchRef, inSearchView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { user } = useAuth();
  const [params, setParams] = useState<advanceSearch & { type?: string }>({
    search: "",
    start_price: "",
    end_price: "",
    type: "all",
  });

  const [budgetValue, setBudgetValue] = useState<string>("all");
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [appliedParams, setAppliedParams] = useState<advanceSearch | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(100);

  // Fetch dynamic property types from backend API
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await getProprtyTypeList();
        // backend responds with { message, result: PropertyType[] }
        if (Array.isArray(res?.result)) {
          setPropertyTypes(res.result);
        }
      } catch (err) {
        console.error("Failed to fetch property types:", err);
      }
    };
    fetchTypes();
  }, []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["all_post", page, limit, appliedParams],
    queryFn: () => getAllPostCMS(page, limit, appliedParams),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleTypeChange = (value: string) => {
    setParams((prev) => ({ ...prev, type: value }));
  };

  const handleBudgetChange = (value: string) => {
    setBudgetValue(value);
    if (value === "all") {
      setParams((prev) => ({ ...prev, start_price: "", end_price: "" }));
    } else if (value === "0-500") {
      setParams((prev) => ({ ...prev, start_price: "0", end_price: "500" }));
    } else if (value === "500-1000") {
      setParams((prev) => ({ ...prev, start_price: "500", end_price: "1000" }));
    } else if (value === "1000+") {
      setParams((prev) => ({ ...prev, start_price: "1000", end_price: "100000" }));
    }
  };

  const handleSearch = () => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([key, value]) => value !== "" && value !== null && value !== undefined && key !== "type")
    );
    // changing appliedParams changes the query key, which triggers the fetch
    setAppliedParams(filteredParams);
    setPage(1);
  };

  const handleClearFilters = () => {
    setParams({
      search: "",
      start_price: "",
      end_price: "",
      type: "all",
    });
    setBudgetValue("all");
    setAppliedParams(null);
    setPage(1);
  };

  const handleRedirectFilter = () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      navigate("/explore-properties");
    } else {
      toast({
        title: `Please Login to your account`,
        description: `Explore the advance search & other features.`,
        variant: "success",
      });
      navigate("/login");
    }
  };

  // Normalize both mock and API post structures
  // Demo data is only shown when the request failed; an empty real result stays empty
  const postData: any[] = isError ? properties : (Array.isArray(data?.result) ? data.result : []);

  const normalizePost = (post: any): NormalizedPost => {
    if (post.id && !post._id) {
      return {
        id: post.id,
        user: post.user,
        type: post.type,
        location: post.location,
        title: post.title,
        beds: post.beds,
        baths: post.baths,
        sqm: post.sqm,
        postedDate: post.postedDate,
        price: post.price,
        isUrgent: post.isUrgent,
      };
    }

    const userObj = {
      name: post.created_by ? `${post.created_by.first_name || ""} ${post.created_by.last_name || ""}`.trim() || "Anonymous" : "Anonymous",
      image: IMAGES.user_img,
      gender: post.created_by?.gender || "Male",
    };

    const priceRange = post.start_price && post.end_price 
      ? `$${post.start_price} - $${post.end_price}` 
      : `$${post.price || "N/A"}`;

    const sizeVal = post.size ? `${post.size} sqm` : "N/A";

    return {
      id: post._id,
      user: userObj,
      type: post.property_type_object_id?.name || "Apartment",
      location: post.location || "N/A",
      title: post.subject || "No Subject",
      beds: Number(post.bedrooms) || 0,
      baths: Number(post.bathrooms) || 0,
      sqm: sizeVal,
      postedDate: post.created_date,
      price: priceRange,
      isUrgent: post.move_in_requirements === "less_than_15_days",
    };
  };

  // Client-side filter fallback logic for maximum correctness
  const filteredPosts = useMemo(() => {
    let list = postData.map(normalizePost);

    if (params.search?.trim()) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p: NormalizedPost) =>
          p.location.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.user.name.toLowerCase().includes(q)
      );
    }

    if (params.type && params.type !== "all") {
      const typeLower = params.type.toLowerCase();
      list = list.filter((p: NormalizedPost) => p.type.toLowerCase() === typeLower);
    }

    return list;
  }, [postData, params]);

  const typeOptions = propertyTypes.length > 0 ? propertyTypes : [
    { _id: "house", name: "House", slug: "house" },
    { _id: "apartment", name: "Apartment", slug: "apartment" },
    { _id: "townhouse", name: "Townhouse", slug: "townhouse" },
    { _id: "unit", name: "Unit", slug: "unit" }
  ];

  return (
    <section className="w-full bg-[#f8fafc] py-16 md:py-24 relative overflow-hidden border-t border-slate-100">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#075d51]/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1761d7]/5 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-[100px]">
        {/* Header Section with Modern Feel */}
        <div className="text-center md:text-left mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex flex-col gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#e6f4f1] text-[#075d51] w-fit self-center md:self-start">
              <Sparkles className="w-3.5 h-3.5" />
              Tenant Matching
            </span>
            <h2 className="font-sans font-extrabold text-[#102a2a] text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
              Connect with Verified Tenants
            </h2>
            <p className="font-sans text-[#647472] text-base md:text-lg max-w-2xl mt-1">
              Browse current housing requests, budget details, and requirements posted by tenants looking for a new home.
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            {appliedParams || params.type !== "all" || params.search ? (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="text-[#647472] hover:text-[#102a2a]"
              >
                Reset Filters
              </Button>
            ) : null}
          </div>
        </div>

        {/* Premium Floating Search Bar */}
        <div
          ref={searchRef}
          className={`bg-white rounded-2xl md:rounded-full shadow-[0_14px_36px_rgba(16,42,42,0.06)] border border-slate-100 p-4 mb-16 relative z-10 ${
            inSearchView ? "animate-in fade-in slide-in-from-bottom-4 duration-700" : "opacity-0"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="relative">
              <Input
                placeholder="Suburb, postcode or keyword..."
                className="pl-4 pr-10 rounded-full bg-[#f8faf8] border-transparent hover:border-[#dbe5e2] focus:border-[#075d51] h-12 text-sm text-[#102a2a]"
                value={params.search || ""}
                onChange={handleInputChange}
              />
              <MapPin className="absolute right-4 top-4 h-4 w-4 text-[#647472]" />
            </div>

            <div>
              <Select onValueChange={handleTypeChange} value={params.type || "all"}>
                <SelectTrigger className="w-full rounded-full bg-[#f8faf8] border-transparent hover:border-[#dbe5e2] focus:border-[#075d51] h-12 text-sm text-[#102a2a]">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Type</SelectItem>
                  {typeOptions.map((type) => (
                    <SelectItem key={type._id} value={type.slug || type._id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select onValueChange={handleBudgetChange} value={budgetValue}>
                <SelectTrigger className="w-full rounded-full bg-[#f8faf8] border-transparent hover:border-[#dbe5e2] focus:border-[#075d51] h-12 text-sm text-[#102a2a]">
                  <SelectValue placeholder="Weekly Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Budget</SelectItem>
                  <SelectItem value="0-500">$0 - $500</SelectItem>
                  <SelectItem value="500-1000">$500 - $1000</SelectItem>
                  <SelectItem value="1000+">$1000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 h-12">
              <Button
                variant="outline"
                className="px-6 rounded-full h-full border-[#075d51] text-[#075d51] hover:bg-[#075d51]/5 hover:text-[#075d51] font-semibold transition-all flex-1"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4 mr-2" />
                Find
              </Button>
              <Button
                className="px-6 rounded-full h-full bg-[#1761d7] hover:bg-[#1761d7]/90 text-white font-semibold transition-all flex-1"
                onClick={handleRedirectFilter}
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced
              </Button>
            </div>
          </div>
        </div>

        {/* Loading / Error States / Results Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="w-full h-64 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-slate-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/4" />
                  </div>
                </div>
                <div className="space-y-2 py-4">
                  <div className="h-4 bg-slate-200 rounded w-5/6" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
                <div className="h-8 bg-slate-200 rounded w-1/3 self-end" />
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="space-y-6">
            {isError && (
              <div className="p-4 bg-amber-50/80 text-amber-800 border border-amber-200/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  <span>Currently showing demo results due to a server connection issue.</span>
                </div>
                <Button 
                  onClick={() => refetch()} 
                  variant="outline" 
                  size="sm" 
                  className="h-8 border-amber-300 hover:bg-amber-100/50 text-amber-800 font-semibold rounded-full"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> 
                  Retry Connection
                </Button>
              </div>
            )}
            
            <div
              ref={ref}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 ${
                inView ? "animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200" : "opacity-0"
              }`}
            >
              {filteredPosts.map((post: NormalizedPost) => (
                <div 
                  key={post.id} 
                  className="transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#102a2a]/4 rounded-[15.93px] overflow-hidden bg-white"
                >
                  <Tenant
                    id={post.id}
                    user={post.user}
                    type={post.type}
                    location={post.location}
                    title={post.title}
                    beds={post.beds}
                    baths={post.baths}
                    sqm={post.sqm}
                    postedDate={post.postedDate}
                    price={post.price}
                    isUrgent={post.isUrgent}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 max-w-md mx-auto shadow-sm">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-[#102a2a] font-bold text-xl">No tenant requests match</h3>
            <p className="text-[#647472] text-sm mt-2 mb-6">
              Try adjusting your search filters or clear filters to view all listings.
            </p>
            <Button
              onClick={handleClearFilters}
              className="bg-[#075d51] hover:bg-[#075d51]/90 rounded-full"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchTenant;