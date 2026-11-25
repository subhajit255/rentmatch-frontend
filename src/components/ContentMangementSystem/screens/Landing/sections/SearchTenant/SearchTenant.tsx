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
import { MapPin, Search, Filter, RefreshCw, Sparkles, Lock } from "lucide-react";
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
      name: "Alex Morgan",
      image: IMAGES.user_img,
      user_name: "RM-4812",
      first_name: "Alex",
      last_name: "Morgan",
    },
    title: "Looking for 2BR apartment for rent",
    location: "Newtown and surrounds",
    postedDate: "2026-11-20",
    moveInDate: "Move in 7 to 28 Nov",
    price: "$720 to $820 per week",
    type: "Apartment",
    sqm: "700sqm - 1400sqm",
    beds: 2,
    baths: 1,
    isUrgent: false,
    matchPercentage: 94,
    tags: ["Budget fits", "Preferred suburb", "Dates align"],
  },
  {
    id: "2",
    user: {
      name: "Jordan Miller",
      image: IMAGES.user_img,
      user_name: "RM-1940",
      first_name: "Jordan",
      last_name: "Miller",
    },
    title: "Quiet courtyard home wanted",
    location: "Marrickville and Dulwich Hill",
    postedDate: "2026-11-20",
    moveInDate: "Move in by 20 Nov",
    price: "$700 to $780 per week",
    type: "House",
    sqm: "700sqm - 1400sqm",
    beds: 2,
    baths: 1,
    isUrgent: false,
    matchPercentage: 91,
    tags: ["Budget fits", "Pets considered", "Dates align"],
  },
  {
    id: "3",
    user: {
      name: "Sam Lee",
      image: IMAGES.user_img,
      user_name: "RM-6027",
      first_name: "Sam",
      last_name: "Lee",
    },
    title: "Looking for bright top-floor unit",
    location: "Inner West, within 10 km",
    postedDate: "2026-12-01",
    moveInDate: "Move in from 1 Dec",
    price: "$680 to $780 per week",
    type: "Unit",
    sqm: "700sqm - 1400sqm",
    beds: 2,
    baths: 1,
    isUrgent: false,
    matchPercentage: 88,
    tags: ["Budget fits", "Property type", "Lease length"],
  },
];

interface NormalizedPost {
  id: string;
  user: {
    name: string;
    image: string;
    gender?: string;
    user_name?: string;
    first_name?: string;
    last_name?: string;
  };
  type: string;
  location: string;
  title: string;
  beds: number;
  baths: number;
  sqm: string;
  postedDate: any;
  moveInDate?: string;
  price: string;
  isUrgent: boolean;
  matchPercentage?: number;
  tags?: string[];
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
    const cleanParams: Record<string, any> = {};
    if (params.search?.trim()) cleanParams.search = params.search.trim();
    if (params.start_price) cleanParams.start_price = params.start_price;
    if (params.end_price) cleanParams.end_price = params.end_price;
    if (params.type && params.type !== "all") {
      cleanParams.type = params.type;
      cleanParams.property_type = params.type;
    }
    // changing appliedParams changes the query key, which triggers the fetch
    setAppliedParams(Object.keys(cleanParams).length > 0 ? cleanParams : null);
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

  const normalizePost = (post: any, index: number = 0): NormalizedPost => {
    if (post.id && !post._id) {
      const mockRaw = post.user?.user_name || post.user?.userName || "";
      const seedStr = (post.id || "4812").toString();
      let hash = 0;
      for (let i = 0; i < seedStr.length; i++) {
        hash = (hash * 31 + seedStr.charCodeAt(i)) % 9000;
      }
      const uniqueSuffix = 1000 + Math.abs(hash);
      const mockRenterId = mockRaw.toUpperCase().startsWith("RM-") ? mockRaw.toUpperCase() : `RM-${uniqueSuffix}`;

      return {
        id: post.id,
        user: {
          ...post.user,
          user_name: mockRenterId,
          name: `Renter ${mockRenterId}`,
        },
        type: post.type,
        location: post.location,
        title: post.title,
        beds: post.beds,
        baths: post.baths,
        sqm: post.sqm,
        postedDate: post.postedDate,
        moveInDate: post.moveInDate,
        price: post.price,
        isUrgent: post.isUrgent,
        matchPercentage: post.matchPercentage,
        tags: post.tags,
      };
    }

    const createdBy = post.created_by || {};
    const firstName = createdBy.first_name || "";
    const lastName = createdBy.last_name || "";
    const rawUsername = (createdBy.user_name || createdBy.member_id || createdBy.username || "").trim();
    
    // Format unique renter ID as RM-<unique_id> (e.g. RM-4812)
    let formattedRenterId = "";
    if (rawUsername.toUpperCase().startsWith("RM-")) {
      formattedRenterId = rawUsername.toUpperCase();
    } else {
      // Deterministic hash based on ID or username so the same post always has the exact same RM-xxxx
      const seedStr = (post.created_by?._id || post._id || post.id || rawUsername || "4812").toString();
      let hash = 0;
      for (let i = 0; i < seedStr.length; i++) {
        hash = (hash * 31 + seedStr.charCodeAt(i)) % 9000;
      }
      const uniqueSuffix = 1000 + Math.abs(hash);
      formattedRenterId = `RM-${uniqueSuffix}`;
    }

    const userName = formattedRenterId;

    const userObj = {
      name: `Renter ${formattedRenterId}`,
      image: IMAGES.user_img,
      gender: createdBy.gender || "Male",
      user_name: userName,
      first_name: "Renter",
      last_name: formattedRenterId,
    };

    // Calculate move-in text
    let moveInText = "Move in available now";
    if (post.move_in_requirements) {
      if (post.move_in_requirements === "less_than_15_days") {
        moveInText = "Move in within 15 days";
      } else {
        const d = new Date(post.move_in_requirements);
        if (!isNaN(d.getTime())) {
          const day = d.getDate();
          const month = d.toLocaleString("en-US", { month: "short" });
          moveInText = `Move in by ${day} ${month}`;
        } else {
          moveInText = `Move in: ${post.move_in_requirements}`;
        }
      }
    } else if (post.created_date) {
      const d = new Date(post.created_date);
      if (!isNaN(d.getTime())) {
        const day = d.getDate();
        const month = d.toLocaleString("en-US", { month: "short" });
        moveInText = `Move in from ${day} ${month}`;
      }
    }

    // Calculate price
    let priceText = "";
    const startPrice = Number(post.start_price);
    const endPrice = Number(post.end_price);
    if (!isNaN(startPrice) && !isNaN(endPrice) && (startPrice > 0 || endPrice > 0)) {
      if (startPrice > 0 && endPrice > 0) {
        priceText = `$${startPrice} to $${endPrice} per week`;
      } else if (endPrice > 0) {
        priceText = `Up to $${endPrice} per week`;
      } else {
        priceText = `From $${startPrice} per week`;
      }
    } else if (post.price) {
      const pStr = String(post.price);
      if (pStr.includes("-")) {
        priceText = `${pStr.replace("-", "to")} per week`;
      } else {
        priceText = `${pStr} per week`;
      }
    } else {
      priceText = "Budget upon request";
    }

    // Dynamic tags matching mockup
    const tags: string[] = ["Budget fits"];
    if (post.pets && post.pets !== "no" && post.pets !== "none") {
      tags.push("Pets considered");
    } else {
      tags.push("Preferred suburb");
    }
    if (post.property_type_object_id?.name || post.type) {
      tags.push("Dates align");
    } else {
      tags.push("Property type");
    }

    const DUMMY_MATCHES = [94, 91, 88, 95, 92, 89];
    const matchPercentage = DUMMY_MATCHES[Math.abs(index) % DUMMY_MATCHES.length];

    const sizeVal = post.size ? `${post.size} sqm` : "N/A";

    const suburb = post.rentalCityPreference || createdBy.city || "";
    const postcode = createdBy.zip || "";
    const state = post.rentalStatePreference || createdBy.state || "";
    let locStr = (post.location || "").trim();
    if (!locStr) {
      locStr = [suburb, state, postcode].filter(Boolean).join(", ").trim();
    } else if (suburb && !locStr.toLowerCase().includes(suburb.toLowerCase())) {
      locStr = `${suburb}, ${locStr}`;
    }
    if (!locStr) {
      locStr = "Preferred location";
    }

    return {
      id: post._id,
      user: userObj,
      type: post.property_type_object_id?.name || post.type || "Apartment",
      location: locStr,
      title: post.subject || "No Subject",
      beds: Number(post.bedrooms) || 0,
      baths: Number(post.bathrooms) || 0,
      sqm: sizeVal,
      postedDate: post.created_date,
      moveInDate: moveInText,
      price: priceText,
      isUrgent: post.move_in_requirements === "less_than_15_days",
      matchPercentage,
      tags,
    };
  };

  // Client-side filter fallback logic for maximum correctness
  const filteredPosts = useMemo(() => {
    let list = postData.map((p, idx) => normalizePost(p, idx));

    if (params.search?.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (p: NormalizedPost) =>
          p.location.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.user.name.toLowerCase().includes(q) ||
          (p.user.user_name && p.user.user_name.toLowerCase().includes(q))
      );
    }

    if (params.type && params.type !== "all") {
      const typeLower = params.type.toLowerCase().trim();
      list = list.filter((p: NormalizedPost) => {
        const postType = (p.type || "").toLowerCase().trim();
        return postType === typeLower || postType.includes(typeLower) || typeLower.includes(postType);
      });
    }

    if (params.start_price || params.end_price) {
      const minP = Number(params.start_price) || 0;
      const maxP = Number(params.end_price) || Infinity;
      list = list.filter((p: NormalizedPost) => {
        const matches = (p.price || "").match(/\d+/g);
        if (matches && matches.length > 0) {
          const prices = matches.map(Number);
          const postMin = prices[0];
          const postMax = prices.length > 1 ? prices[1] : prices[0];
          return postMin <= maxP && postMax >= minP;
        }
        return true;
      });
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
    <section className="w-full bg-[#f8fafc] py-12 md:py-16 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#075d51]/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1761d7]/5 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-[100px]">
        {/* Reset Filters indicator if active */}
        {(appliedParams || params.type !== "all" || params.search) && (
          <div className="flex justify-end mb-3">
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className="text-[#647472] hover:text-[#102a2a] text-xs font-semibold"
            >
              ✕ Reset Filters
            </Button>
          </div>
        )}

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

        {/* Section Header matching mockup */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#102a2a] mb-2 tracking-tight">
            See how matching works
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Examples of what a landlord sees before a renter says yes.
          </p>
        </div>

        {/* Loading / Error States / Results Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="w-full h-72 bg-white border border-slate-100 rounded-[22px] p-6 shadow-sm flex flex-col justify-between animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-slate-200 rounded-full" />
                    <div className="h-4 bg-slate-200 rounded w-28" />
                  </div>
                  <div className="w-16 h-6 bg-slate-200 rounded-full" />
                </div>
                <div className="space-y-2 py-4">
                  <div className="h-4 bg-slate-200 rounded w-4/5" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 rounded w-2/3" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-200 rounded-full w-20" />
                  <div className="h-6 bg-slate-200 rounded-full w-24" />
                </div>
                <div className="h-10 bg-slate-200 rounded-xl w-full mt-4" />
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
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
                inView ? "animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200" : "opacity-0"
              }`}
            >
              {filteredPosts.map((post: NormalizedPost, idx: number) => (
                <div 
                  key={post.id} 
                  className="transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#102a2a]/4 rounded-[22px] overflow-hidden"
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
                    moveInDate={post.moveInDate}
                    price={post.price}
                    isUrgent={post.isUrgent}
                    matchPercentage={post.matchPercentage}
                    tags={post.tags}
                    index={idx}
                  />
                </div>
              ))}
            </div>

            {/* Bottom notification banner */}
            <div className="w-full bg-[#EBF3FE] border border-[#BFDBFE]/70 rounded-2xl py-3.5 px-6 text-center text-xs sm:text-sm font-semibold text-[#1E40AF] mt-8 shadow-sm">
              Names, photos and contact details stay hidden until the renter accepts an invitation.
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