import React, { useEffect, useMemo, useRef, useState } from "react";
import { IMAGES } from "../../assets";
import {
  Filter,
  Grid,
  List,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
// import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GoogleMapComponent from "../ChildComponent/GoogleMapComponent";
import PropertyHorizontal from "../ChildComponent/Common/PropertyHorizontal";
import Property from "../ChildComponent/Common/Property";
import { Card } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  getAllProperty,
  getMasterDataProperty,
  getTenantProperty,
} from "../../actions/property";
// import { dateFormat } from "../../lib/utils";
import { cn } from "../lib/utils";
import { Input } from "../ui/input";
import { useSheet } from "../../../src/context/sheetProvider";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { useGoogleMaps } from "../../context/GoogleMapsProvider";
import { useSearchParams } from "react-router-dom";
import { getPropertyTypeList } from "../../actions/propertyMaster";
import { RotateCcw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// 2. Define libraries outside the component to prevent re-renders
const LIBRARIES: "places"[] = ["places"];

type PropertyType = {
  _id: string;
  name: string;
};
export interface PropertyFilter {
  start_price?: string;
  end_price?: string;
  start_size?: string;
  end_size?: string;
  garages?: string;
  bathrooms?: string;
  bedrooms?: string;
  balcony?: string;
  amenities?: string[];
  type?: string;
  location?: string;
  sort?: string;
  sort_by_price?: string;
  property_type?: string;
  search?: string;
  lat?: string;
  lng?: string;
}

const defaultFilter: PropertyFilter = {
  start_price: "",
  end_price: "0",
  start_size: "0",
  end_size: "0",
  garages: "",
  bathrooms: "",
  bedrooms: "",
  balcony: "",
  amenities: [],
  type: "",
  location: "",
  sort: "",
  sort_by_price: "",
  property_type: "",
  search: "",
  lat: "",
  lng: "",
};

const ExploreProperties = () => {
  const { user } = useAuth();
  const isLandlord = user?.role === "LANDLORD" || user?.role === "PROPERTY MANAGER";
  // const defaultCenter = { lat: 22.5726, lng: 88.3639 }; // kolkata lat lng by default
  const defaultCenter = { lat: -35.2809, lng: 149.13 };
  const { isLoaded, loadError } = useGoogleMaps();
  const [filter, setFilter] = useState<PropertyFilter>(defaultFilter);

  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(4);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>(defaultCenter);
  const [view, setView] = useState("horizontal");

  const handleLocationClick = (property: any) => {
    const basic = property?.property_details?.basic;
    const lat = basic?.latitude
      ? parseFloat(basic.latitude)
      : property?.latitude
        ? parseFloat(property.latitude)
        : null;
    const lng = basic?.longitude
      ? parseFloat(basic.longitude)
      : property?.longitude
        ? parseFloat(property.longitude)
        : null;

    if (lat && lng && !isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
      setMapCenter({ lat, lng });
      setMapZoom(16);
      setSelectedPropertyId(property._id || property.id);
    } else {
      // Fallback: geocode by address if coordinates not in record
      const address =
        basic?.full_address || basic?.region_area || property?.location;
      if (address && window.google?.maps?.Geocoder) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
          if (status === "OK" && results?.[0]?.geometry?.location) {
            const loc = results[0].geometry.location;
            setMapCenter({ lat: loc.lat(), lng: loc.lng() });
            setMapZoom(16);
            setSelectedPropertyId(property._id || property.id);
          }
        });
      } else {
        setSelectedPropertyId(property._id || property.id);
      }
    }

    // Scroll to map on smaller screens (mobile / tablet)
    const mapElement =
      document.getElementById("mapview") ||
      document.getElementById("propertyDetails");
    if (mapElement && window.innerWidth < 1024) {
      mapElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getUserPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setMapCenter({ lat: latitude, lng: longitude });
        setMapZoom(14);
      },
      (error) => {
        console.error("Error getting location:", error);
        // You can show a toast/notification here if you want
      },
      {
        enableHighAccuracy: true, // try to get better accuracy
        timeout: 8000, // max wait time
        maximumAge: 0, // don't use cached position
      },
    );
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by your browser.");
      return;
    }
    getUserPosition();
  }, []);

  // 4. Use 'any' for the ref type if Google types aren't globally available yet
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMapCenter({ lat, lng });
        setFilter((prev) => ({
          ...prev,
          lat: lat.toString(),
          lng: lng.toString(),
        }));
        setMapZoom(15);
      }
    }
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requestSent, setRequestSent] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [list, setList] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("");

  const [searchsectionVisible, setSearchSectionVisible] = useState(false);

  const { openSheet, setParameters, parameter: drowerParameter } = useSheet();

  const {
    data: masterData,
    isLoading: isMasterLoading,
    isError: isMasterError,
  } = useQuery({
    queryKey: ["masterPropertyData"],
    queryFn: getMasterDataProperty,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const { data: propertyTypes, isLoading: propTypeLoading } = useQuery({
    queryKey: ["propertyType"],
    queryFn: () => getPropertyTypeList({}),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const amenities = masterData?.result?.amenities?.[0]?.data ?? [];
  // console.log(propertyTypes, "propertyTypes data")

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCardClick = (id: string) => {
    setSelectedId(selectedId === id ? null : id); // Toggle selection
  };
  const handleRequestClick = (id: string) => {
    setRequestSent((prev) => ({ ...prev, [id]: true })); // Mark request as sent for the specific property ID
  };

  const { data: property, isLoading } = useQuery({
    queryKey: ["allProperty", currentPage, limit, filter, searchQuery],
    queryFn: () =>
      getAllProperty({
        page: currentPage,
        limit,
        ...filter,
        search: searchQuery,
      }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // console.log("property:---------->", property?.pagination);
    setList(property?.result || []);
    setPagination(property?.pagination || []);
  }, [property, property?.result]);

  const totalPages = pagination?.total_pages;
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const openAdvanceFilter = () => {
    openSheet("advanceSearch");
    setParameters({
      initialFilter: filter,
      amenities,
      onApply: (newFilter: PropertyFilter) => {
        // merge so sort/type/location selections are kept
        setFilter((prev) => ({ ...prev, ...newFilter }));
        setCurrentPage(1);
      },
    });
  };

  if (loadError) {
    return (
      <div className="py-10 text-center text-red-600">
        Failed to load Google Maps. Please try again later.
      </div>
    );
  }

  const resetToInitialState = () => {
    setFilter(defaultFilter);
    setSelectedType("");
    setSelectedSort("");
    setCurrentPage(1);
    setSelectedId(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by your browser.");
      return;
    }
    getUserPosition();
    // // 2. Clear the Autocomplete input field
    // if (inputRef.current) {
    //   inputRef.current.value = "";           // Clear visible text
    // }

    // // Also clear Google Places Autocomplete internal state
    // if (autocompleteRef.current) {
    //   autocompleteRef.current.set("place", null); // Optional: clear internal place
    // }

    // // 3. Reset map to user's current location (like initial load)
    // if (userLocation.lat !== defaultCenter.lat || userLocation.lng !== defaultCenter.lng) {
    //   setMapCenter(userLocation);
    //   setMapZoom(14);
    // } else {
    //   // If user location was never fetched, fallback to default (Canberra in your case)
    //   setMapCenter(defaultCenter);
    //   setMapZoom(4);
    // }

    // // Optional: Close any selected property details
    // setSelectedId(null);
  };

  return (
    <div className="common-container pb-8">
      <div className="w-full mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* <!-- Property Listings --> */}
          <div className="lg:w-1/2">
            <div className="flex items-center justify-between mb-6 bg-white p-2 rounded-lg">
              <h2 className="text-md font-bold text-gray-900">
                {pagination?.total_records ?? 0} properties
              </h2>
              <div className="flex items-center gap-1">
                {searchsectionVisible ? (
                  <Select
                    value={selectedSort}
                    onValueChange={(value) => {
                      setSelectedSort(value);
                      // backend expects sort_by_price = LTH | HTL | NEWEST | OLDEST
                      setFilter((prev) => ({
                        ...prev,
                        sort_by_price:
                          value && value !== "default"
                            ? value.toUpperCase()
                            : undefined,
                      }));
                      setCurrentPage(1);
                    }}
                    defaultValue="default"
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by Default" />
                      {/* <SelectValue /> */}
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="default">Sort by Default</SelectItem>
                      <SelectItem value="LTH">Price: Low to High</SelectItem>
                      <SelectItem value="HTL">Price: High to Low</SelectItem>
                      <SelectItem value="Newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                ) : null}

                <div className="flex border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    id="vertical_view"
                    onClick={() => setView("vertical")}
                    className={`px-3 ${
                      view === "vertical" ? "bg-blue-500" : ""
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    id="horizontal_view"
                    onClick={() => setView("horizontal")}
                    className={`px-3 ${
                      view === "horizontal" ? "bg-blue-500" : ""
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* <!-- Horizontal Slider --> */}
              {view === "horizontal" && (
                <div
                  id="horizontal_slider"
                  className={cn(
                    "h-[500px] overflow-y-auto thin-scrollbar pr-3",
                  )}
                >
                  {list && list.length > 0 ? (
                    list
                      .filter(
                        (p: any) =>
                          p.property_details?.basic?.is_available_for_rent ===
                          true,
                      )
                      .map(
                        (property: any) =>
                          property.property_details?.basic
                            ?.is_available_for_rent === true && (
                            <div key={property._id}>
                              <PropertyHorizontal
                                id={property?._id}
                                property={property}
                                onLocationClick={handleLocationClick}
                                hideMatchBadge={isLandlord}
                                // onCardClick={() => handleCardClick(property?._id)}
                              />
                            </div>
                          ),
                      )
                  ) : (
                    <div className="flex justify-center items-center mt-10">
                      <div className="flex justify-center items-center flex-col">
                        <img
                          src={IMAGES.error}
                          alt="No Properties"
                          className="mb-4 w-[50%]"
                        />
                        <p className="text-2xl">No properties are availabe !</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* <!-- Vertical Slider --> */}
              {view === "vertical" && (
                <div
                  id="vertical_slider"
                  className={cn(
                    "h-[500px] overflow-y-auto thin-scrollbar pr-3",
                  )}
                  // style={{
                  //   display: view === "vertical" ? "block" : "none",
                  //   height: "500px",
                  //   overflowY: "auto",
                  // }}
                >
                  <div className="grid sm: grid-cols-1 xl:grid-cols-2">
                    {list && list.length > 0 ? (
                      list
                        .filter(
                          (p: any) =>
                            p.property_details?.basic?.is_available_for_rent ===
                            true,
                        )
                        .map(
                          (property: any, index: number) =>
                            property.property_details?.basic
                              ?.is_available_for_rent === true && (
                              <div
                                key={property._id}
                                className="px-2 col-span-1 mb-5"
                              >
                                <Property
                                  id={property?._id}
                                  property={property}
                                  onLocationClick={handleLocationClick}
                                  hideMatchBadge={isLandlord}
                                  // onCardClick={() => handleCardClick(property._id)}
                                />
                              </div>
                            ),
                        )
                    ) : (
                      <div className="flex justify-center items-center mt-10">
                        <div className="flex justify-center items-center flex-col">
                          <img
                            src={IMAGES.error}
                            alt="No Properties"
                            className="mb-4 w-[50%]"
                          />
                          <p className="text-2xl">
                            No properties are availabe !
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* <Slider {...settings}> */}

                  {/* </Slider> */}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-2 mb-4 px-1 py-2">
                <div className="w-28 flex justify-start">
                  {currentPage > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      className="rounded-full border-slate-200 hover:border-blue-600 hover:text-blue-600 font-semibold text-xs text-slate-700 px-3.5 py-1.5 h-9 transition-all flex items-center gap-1 shadow-xs bg-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                  )}
                </div>

                <span className="text-xs sm:text-sm font-medium text-slate-600 bg-slate-100/90 border border-slate-200/60 px-4 py-1.5 rounded-full shadow-2xs">
                  Page{" "}
                  <span className="text-slate-900 font-bold">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="text-slate-900 font-bold">{totalPages}</span>
                </span>

                <div className="w-28 flex justify-end">
                  {currentPage < totalPages && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      className="rounded-full border-slate-200 hover:border-blue-600 hover:text-blue-600 font-semibold text-xs text-slate-700 px-3.5 py-1.5 h-9 transition-all flex items-center gap-1 shadow-xs bg-white"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* <!-- Map --> */}
          <div
            className={`lg:w-1/2`}
            id={selectedId ? "propertyDetails" : "mapview"}
          >
            <div className="w-full mx-auto">
              {/* <!-- Search Filters --> */}
              <div className="rounded-lg mb-6 bg-white p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end">
                  {searchsectionVisible ? (
                    <>
                      {!propTypeLoading ? (
                        <div>
                          <Select
                            value={selectedType}
                            onValueChange={(value) => {
                              setSelectedType(value);
                              // backend filters on property_type (property type _id)
                              setFilter((prev) => ({
                                ...prev,
                                property_type:
                                  value && value !== "all" ? value : undefined,
                              }));
                              setCurrentPage(1);
                            }}
                          >
                            <SelectTrigger className="w-full h-10 shadow-none">
                              <SelectValue placeholder="Search by type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="all">All type</SelectItem>
                              {propertyTypes &&
                                propertyTypes?.result.length > 0 &&
                                propertyTypes?.result
                                  .filter((type: any) => !!type?._id)
                                  .map((type: any) => (
                                    <SelectItem key={type._id} value={type._id}>
                                      {type.name}
                                    </SelectItem>
                                  ))}
                              {/* <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem> */}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : null}

                      <div>
                        <div className="relative">
                          {isLoaded ? (
                            <Autocomplete
                              onLoad={(auto) =>
                                (autocompleteRef.current = auto)
                              }
                              onPlaceChanged={onPlaceChanged}
                            >
                              <Input
                                ref={inputRef}
                                placeholder="Search location..."
                                className="w-full pl-10 pr-4 py-3 text-base"
                              />
                            </Autocomplete>
                          ) : (
                            <Input
                              placeholder="Loading maps..."
                              disabled
                              className="w-full pl-10"
                            />
                          )}
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </>
                  ) : null}

                  <div className="flex gap-2 w-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        resetToInitialState();
                      }}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      className="py-5 hover:bg-blue-700 rounded-[99px] h-10 hover:text-white shadow-none border text-blue-700 border-blue-700"
                      onClick={() => {
                        setSearchSectionVisible(true);
                      }}
                    >
                      Search
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="py-5 hover:bg-blue-700 hover:text-white flex-1 rounded-[99px] h-10 shadow-none border border-blue-700 text-blue-700"
                      onClick={openAdvanceFilter}
                    >
                      Search advanced
                      <Filter className="h-4 w-4 mr-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* <GoogleMapComponent /> */}
            {isLoaded ? (
              <GoogleMapComponent
                center={mapCenter}
                zoom={mapZoom}
                userLocation={userLocation}
                propertiesData={list}
                selectedPropertyId={selectedPropertyId}
              />
            ) : (
              <div>Map Loading...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExploreProperties;
