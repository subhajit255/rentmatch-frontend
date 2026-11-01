import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IMAGES } from "../../../../../../assets/index";
import Slider from "react-slick";
import { Star } from "lucide-react";

const TopRentalAgent = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true, // Enable autoplay
        autoplaySpeed: 3000, // Duration for each slide (in milliseconds)
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
        ],
    };
    const agents = [
        {
            avatar: IMAGES.real_estate,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
        {
            avatar: IMAGES.dream_property,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
        {
            avatar: IMAGES.dream_property1,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
        {
            avatar: IMAGES.company,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
        {
            avatar: IMAGES.real_estate,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
    ];
    {/* <div className="bg-white rounded-xl relative mx-2"> 
                    <div className="absolute top-[-80px] left-4"> 
                        <img src={agent?.avatar} alt="" className="w-[149px] h-[149px]" />
                    </div>
                    <div className="">
                        <Star />
                    </div>
                    <div className="flex flex-col gap-1 pt-[68px] pb-[33px] pr-[12px] pl-[30px]">
                        <p className="font-semibold text-2xl">{agent?.name}</p>
                        <div className="flex">
                            <img src={IMAGES.location} alt="" className="w-[20px] h-auto" />
                            <p className="text-active">{agent?.address}</p>
                        </div>
                        <p className="text-xl font-bold text-primary">{agent?.no_of_property}+ Properties</p>
                    </div>
                </div> */}
    return (
        <section className="py-12 px-10 bg-accent">
            <h3 className="text-2xl font-semibold mb-5">Top Rental Agent</h3>
            <div className="mt-0">
                <Slider {...settings}>
                    {agents.map((agent) => (
                        <div className="">
                            <div className="bg-white rounded-xl mx-2">
                                <div className="flex justify-around mt-[75px]">
                                    <div className="mt-[-80px]">
                                        <img src={agent?.avatar} alt="" className="w-[149px] h-[149px]" />
                                    </div>
                                    <div className="">
                                        <a href="/login">
                                            <Star className="text-[#FFA920]" />
                                        </a>
                                    </div>
                                </div>
                                <a href="/rental-agent-details">
                                    <div className="flex flex-col gap-1 pb-[33px] pr-[12px] pl-[30px]">
                                        <p className="font-semibold text-2xl">{agent?.name}</p>
                                        <div className="flex">
                                            <img src={IMAGES.location} alt="" className="w-[20px] h-auto" />
                                            <p className="text-active">{agent?.address}</p>
                                        </div>
                                        <p className="text-xl font-bold text-primary">{agent?.no_of_property}+ Properties</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>

    );
};
export default TopRentalAgent;