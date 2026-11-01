import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NavbarSection from "./ContentMangementSystem/screens/Landing/sections/NavbarSection/NavbarSection";
import FooterSection from "./ContentMangementSystem/screens/Landing/sections/FooterSection/FooterSection";
import { IMAGES } from "../assets";

const CMSLayout = () => {
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
    const [sidebarOpen, setSidebarOpen] = useState(false);


    return (
        <div className="w-full bg-background font-sans common-container">
            <NavbarSection />
            <Outlet />
            <FooterSection />
            <div
                className={`go-top ${isVisible ? "active" : ""}`}
                onClick={scrollToTop}
            >
                <img
                    src={IMAGES.up_arrow}
                    width="50%"
                    // style={{ marginTop: "9px", marginLeft: "9px" }}
                    alt="Scroll to top"
                    className="mt-2 ml-2"
                />
            </div>
        </div>
    );
};

export default CMSLayout;
