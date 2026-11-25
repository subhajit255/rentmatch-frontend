import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavbarSection from "./ContentMangementSystem/screens/Landing/sections/NavbarSection/NavbarSection";
import FooterSection from "./ContentMangementSystem/screens/Landing/sections/FooterSection/FooterSection";
import { IMAGES } from "../assets";
import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";

const AuthLayout = () => {
    const location = useLocation();
    const isLoginPage = [
      "/login",
      "/admin/login",
      "/super-admin/login",
      "/registration",
      "/email-verification",
    ].some((path) => location.pathname.startsWith(path));
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
        <div className="w-full min-h-screen flex flex-col justify-between bg-[#F8FAFC] font-sans">
            {!isLoginPage && <Navbar />}
            <div className="flex-1 flex flex-col">
                <Outlet />
            </div>
            {!isLoginPage && <Footer />}
        </div>
    );
};

export default AuthLayout;
