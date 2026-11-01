import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavbarSection from "./ContentMangementSystem/screens/Landing/sections/NavbarSection/NavbarSection";
import FooterSection from "./ContentMangementSystem/screens/Landing/sections/FooterSection/FooterSection";
import { IMAGES } from "../assets";
import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";

const AuthLayout = () => {
    const location = useLocation();
    const isLoginPage = ["/login", "/admin/login", "/super-admin/login"].includes(location.pathname);
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
        <div className="w-full bg-accent font-sans ">
            {!isLoginPage && <Navbar />}
            <Outlet />
            {!isLoginPage && <Footer />}
        </div>
    );
};

export default AuthLayout;
