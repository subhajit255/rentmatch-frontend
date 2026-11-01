import React from "react";
import {
    Star,
} from "lucide-react";
import { IMAGES } from "../../../assets/index";

type RentalAgentProps = {
    id: string | number;
    image: string;
    name: string;
    address: string;
    no_of_property: string | number;
};

const RentalAgent: React.FC<RentalAgentProps> = ({
    id,
    image,
    name,
    address,
    no_of_property
}) => {
    return (
        <div className="bg-white rounded-xl mx-2 border-1 my-2 hover:shadow-lg">
            <div className="flex justify-end mr-2 mt-2">
                <a href="/login">
                    <Star className="text-[#FFA920]" />
                </a>
            </div>
            <a href="/rental-agent-details">
                <div className="flex flex-col justify-center items-center gap-1 pb-[33px] pr-[12px] pl-[30px]">
                    <div className="mt-[-20px]">
                        <img src={image} alt="" className="w-[117px] h-[117px]" />
                    </div>
                    <p className="font-semibold text-lg">{name}</p>
                    <div className="flex">
                        <img src={IMAGES.location} alt="" className="w-[20px] h-auto" />
                        <p className="text-active text-sm">{address}</p>
                    </div>
                    <p className="text-lg font-bold text-primary">{no_of_property}+ Properties</p>
                </div>
            </a>
        </div>
    );
};

export default RentalAgent;
