import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useInView } from 'react-intersection-observer';
import {
    MapPin,
    Search,
    Filter,
} from "lucide-react";
import { Input } from "../../../../../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../../ui/select";
import { Button } from "../../../../../ui/button";

const SearchRentalAgent = () => {
    const [searchRef, inSearchView] = useInView({
        triggerOnce: true, // Trigger animation only once
        threshold: 0.3, // Trigger when 10% of the image is visible
    });
    return (
        <section className="py-2 px-10 bg-[#CADFFF75]">
            <p className="text-sm">Search Your Rental Agent</p>
            <div className="w-full mx-auto">
                {/* Search Filters */}
                <div className={`rounded-lg mb-2 ${inSearchView ? 'animate__animated animate__slideInLeft' : ''}`} ref={searchRef}>
                    <div className="flex">
                        <div className="w-10/12">
                            <div className="flex">
                                <div className="w-1/3 p-2">
                                    <div className="relative">
                                        <Input
                                            placeholder="Search By Name"
                                            className="pr-10 rounded-[99px] bg-white h-11"
                                        />
                                    </div>
                                </div>
                                <div className="w-1/3 p-2">
                                    <div className="relative">
                                        <Input
                                            placeholder="Location"
                                            className="pr-10 rounded-[99px] bg-white h-11"
                                        />
                                        <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                                <div className="w-1/3 p-2">
                                    <Select>
                                        <SelectTrigger className="w-full rounded-[99px] bg-white h-11">
                                            <SelectValue placeholder="Property Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="house">House</SelectItem>
                                            <SelectItem value="apartment">Apartment</SelectItem>
                                            <SelectItem value="villa">Villa</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="w-2/12 p-2">
                            <Button
                                variant="outline"
                                className="px-10 bg-white text-blue-700 hover:text-white hover:bg-blue-700 rounded-[99px] h-11"
                            >
                                Search
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </section>

    );
};
export default SearchRentalAgent;