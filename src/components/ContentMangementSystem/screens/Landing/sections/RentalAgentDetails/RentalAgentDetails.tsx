import React, { useEffect, useState } from "react";
// import TopRentalAgent from "../TopRentalAgent/TopRentalAgent";
// import SearchRentalAgent from "../SearchRentalAgent/SearchRentalAgent";
// import RentalAgentList from "../RentalAgentList/RentalAgentList";
import { IMAGES } from "../../../../../../assets/index";
import { ArrowLeft, Grid, List } from "lucide-react";
import { Button } from "../../../../../ui/button";
import Property from '../../../../../ChildComponent/Common/Property';
import PropertyHorizontal from "../../../../../ChildComponent/PropertyHorizontal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../ui/select";
import { cn } from "../../../../../lib/utils";

const RentalAgentDetails = () => {
  const [view, setView] = useState("horizontal");
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setIsVisible(scrolled > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const handleCardClick = (id: number) => {
    setSelectedId(selectedId === id ? null : id); // Toggle selection
  };

  interface Property {
    id: number;
    title: string;
    location: string;
    price: string;
    beds: number;
    baths: number;
    sqm: string;
    image: string;
    featured: boolean;
    forRent: boolean;
    postedDate: string;
    type: string;
    status: string;
  }

  // const properties: Property[] = [];
  const properties = [
    {
      id: 1,
      title: "Casa Lomas De Machail Machala",
      location: "Machala",
      price: "$750.00",
      beds: 3,
      baths: 2,
      sqm: "100 m²",
      image: IMAGES.villa_image, // Updated to use generated image
      featured: true,
      forRent: true,
      postedDate: "16 Aug 2025",
      type: "Appartment",
      status: "For Rent",
    },
    {
      id: 2,
      title: "Casa Lomas De Machail Machala",
      location: "Machala",
      price: "$750.00",
      beds: 4,
      baths: 3,
      sqm: "120 m²",
      image: IMAGES.villa_image, // Updated to use generated image
      featured: false,
      forRent: true,
      postedDate: "16 Aug 2025",
      type: "Appartment",
      status: "For Rent",
    },
    {
      id: 3,
      title: "Casa Lomas De Machail Machala",
      location: "Machala",
      price: "$750.00",
      beds: 2,
      baths: 1,
      sqm: "80 m²",
      image: IMAGES.villa_image, // Updated to use generated image
      featured: false,
      forRent: true,
      postedDate: "16 Aug 2025",
      type: "Appartment",
      status: "For Rent",
    },
    {
      id: 4,
      title: "Casa Lomas De Machail Machala",
      location: "Machala",
      price: "$750.00",
      beds: 3,
      baths: 2,
      sqm: "110 m²",
      image: IMAGES.villa_image, // Updated to use generated image
      featured: false,
      forRent: true,
      postedDate: "16 Aug 2025",
      type: "Appartment",
      status: "For Rent",
    },
    {
      id: 5,
      title: "Casa Lomas De Machail Machala",
      location: "Machala",
      price: "$751.00",
      beds: 3,
      baths: 2,
      sqm: "110 m²",
      image: IMAGES.villa_image, // Updated to use generated image
      featured: true,
      forRent: true,
      postedDate: "16 Aug 2025",
      type: "Appartment",
      status: "For Rent",
    },
    {
      id: 6,
      title: "Casa Lomas De Machail Machala Casa Lomas De Machail Machala",
      location:
        "Premises no.03-319 Block, DH-6/11, Action Area 1D, Newtown, Kolkata, Chakpachuria, West Bengal 700160",
      price: "$752.00",
      beds: 3,
      baths: 2,
      sqm: "110 m²",
      image: IMAGES.villa_image, // Updated to use generated image
      featured: true,
      forRent: true,
      postedDate: "16 Aug 2025",
      type: "Appartment",
      status: "For Rent",
    },
    {
      id: 7,
      title: "Casa Lomas De Machail Machala",
      location: "Machala",
      price: "$750.00",
      beds: 3,
      baths: 2,
      sqm: "110 m²",
      image: IMAGES.villa_image, // Updated to use generated image
      featured: false,
      forRent: true,
      postedDate: "16 Aug 2025",
      type: "Appartment",
      status: "For Rent",
    },
    {
      id: 8,
      title: "Casa Lomas De Machail Machala",
      location: "Machala",
      price: "$751.00",
      beds: 3,
      baths: 2,
      sqm: "110 m²",
      image: IMAGES.villa_image, // Updated to use generated image
      featured: true,
      forRent: true,
      postedDate: "16 Aug 2025",
      type: "Appartment",
      status: "For Rent",
    },
    {
      id: 9,
      title: "Casa Lomas De Machail Machala Casa Lomas De Machail Machala",
      location:
        "Premises no.03-319 Block, DH-6/11, Action Area 1D, Newtown, Kolkata, Chakpachuria, West Bengal 700160",
      price: "$752.00",
      beds: 3,
      baths: 2,
      sqm: "110 m²",
      image: IMAGES.villa_image, // Updated to use generated image
      featured: true,
      forRent: true,
      postedDate: "16 Aug 2025",
      type: "Appartment",
      status: "For Rent",
    },
  ];
  return (
    <section className="py-12 px-10 bg-accent">
      <div className="flex gap-2">
        <div className="bg-[#1563DF0A] pt-2 pb-20 px-5 rounded-xl">
          <a href="/find-rental-agent">
            <ArrowLeft />
          </a>
          <div className="flex flex-col justify-center items-center gap-1 py-2">
            <div className="">
              <img src={IMAGES.real_estate} alt="" className="w-[117px] h-[117px]" />
            </div>
            <p className="font-semibold text-lg w-[190px]">Dream Property Finder</p>
            <p className="text-primary text-sm font-semibold">Property Manager</p>
            <p className="text-muted-foreground">ID:RENTMATCH64746444</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-1 border-t-[2px] py-2">
            <p className="text-sm text-muted-foreground">Email Id</p>
            <p className="text-sm">abcd@gmail.com</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-1 border-t-[2px] py-2">
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="text-sm text-[#08914F]">Active</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-1 border-t-[2px] py-2">
            <p className="text-sm text-muted-foreground">Joined On</p>
            <p className="text-sm">10/02/2025</p>
          </div><div className="flex flex-col justify-center items-center gap-1 border-t-[2px] py-2">
            <p className="text-sm text-muted-foreground">Phone Number</p>
            <p className="text-sm">123456789</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-1 border-t-[2px] py-2">
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="text-sm">Califonia, New York</p>
          </div>
        </div>
        <div className="bg-white rounded-xl w-full p-2">
          <div className="flex justify-between mb-5">
            <p className="text-2xl">{properties?.length > 0 ? properties?.length + " Properties" : ""} </p>
            <div className="flex items-center gap-4">
              <div className="flex border rounded-lg">
                <Button variant="ghost" size="sm" id="vertical_view" onClick={() => setView("vertical")}
                  className={`px-3 ${view === "vertical" ? "bg-blue-500" : ""}`}>
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" id="horizontal_view" onClick={() => setView("horizontal")}
                  className={`px-3 ${view === "horizontal" ? "bg-blue-500" : ""}`}>
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Select defaultValue="default">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Sort by Default</SelectItem>
                  <SelectItem value="price-low">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price-high">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-6">
            {(properties?.length > 0) ? (
              <>
                {view === "horizontal" && <div id="horizontal_slider"
                  className={cn("h-[570px] overflow-y-auto thin-scrollbar ",
                    // view === "horizontal" ? "block" : "hidden"
                  )}
                // style={{
                //   display: view === "horizontal" ? "block" : "none", height: "570px",
                //   overflowY: "auto",
                // }}
                >
                  <div className="grid grid-cols-2">
                    {properties.map((property) => (
                      <PropertyHorizontal
                        // id={property.id}
                        id={property.id}
                          property={{
                            image: property.image,
                            type: property.type,
                            status: property.status,
                            location: property.location,
                            title: property.title,
                            beds: property.beds,
                            baths: property.baths,
                            sqm: property.sqm,
                            postedDate: property.postedDate,
                            price: property.price,
                            isSelected: false
                          }}
                          // onCardClick={handleCardClick}
                      />
                    ))}
                  </div>
                </div>}
                {view === "vertical" && <div id="vertical_slider"
                  className={cn("h-[570px] overflow-y-auto thin-scrollbar ",
                    // view === "horizontal" ? "block" : "hidden"
                  )}
                // style={{
                //   display: view === "vertical" ? "block" : "none", height: "570px",
                //   overflowY: "auto",
                // }}
                >
                  <div className="grid grid-cols-4">
                    {properties.map((property) => (
                      <div key={property.id} className="px-2 col-span-1 mb-5">
                        <Property
                          id={property.id}
                          property={{
                            image: property.image,
                            type: property.type,
                            status: property.status,
                            location: property.location,
                            title: property.title,
                            beds: property.beds,
                            baths: property.baths,
                            sqm: property.sqm,
                            postedDate: property.postedDate,
                            price: property.price,
                            isSelected: false
                          }}
                          // onCardClick={handleCardClick}
                        />
                      </div>
                    ))}
                  </div>
                </div>}
              </>
            ) : (
              <div className="flex justify-center items-center mt-10">
                <div className="flex justify-center items-center flex-col">
                  <img src={IMAGES.error} alt="No Properties" className="mb-4 w-[50%]" />
                  <p className="text-2xl">Currently, there are no properties available. Please check with another agent!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default RentalAgentDetails;
