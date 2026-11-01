import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useInView } from 'react-intersection-observer';
import { Star } from "lucide-react";
import { IMAGES } from "../../../../../../assets/index";
import RentalAgent from '../../../../../ChildComponent/Common/RentalAgent';

const RentalAgentList = () => {
    const [ref, inView] = useInView({
        triggerOnce: true, // Trigger animation only once
        threshold: 0.3, // Trigger when 10% of the image is visible
    });
    const agents = [
        {
            id:1,
            avatar: IMAGES.real_estate,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
        {
            id:2,
            avatar: IMAGES.dream_property,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
        {
            id:3,
            avatar: IMAGES.dream_property1,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
        {
            id:4,
            avatar: IMAGES.company,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
        {
            id:5,
            avatar: IMAGES.real_estate,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
        {
            id:6,
            avatar: IMAGES.real_estate,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
        {
            id:7,
            avatar: IMAGES.dream_property,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
        {
            id:8,
            avatar: IMAGES.dream_property1,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
        {
            id:9,
            avatar: IMAGES.company,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
        {
            id:10,
            avatar: IMAGES.real_estate,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
        {
            id:11,
            avatar: IMAGES.real_estate,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
        {
            id:12,
            avatar: IMAGES.dream_property,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
        {
            id:13,
            avatar: IMAGES.dream_property1,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
        {
            id:14,
            avatar: IMAGES.company,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
        {
            id:15,
            avatar: IMAGES.real_estate,
            name: "Dream Property Finder",
            address: "Califonia, New York",
            no_of_property: "67",
        },
    ];
    return (
        <section className="py-4 px-10 bg-white">
            <div className="grid grid-cols-5">
                {agents.map((agent) => (
                <RentalAgent id={agent?.id} image={agent?.avatar} name={agent?.name} address={agent?.address} no_of_property={agent?.no_of_property}/>
                ))}
            </div>
        </section>

    );
};
export default RentalAgentList;