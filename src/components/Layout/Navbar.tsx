import React, { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { IMAGES } from "../../assets/index";
import { Button } from "../ui/button";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isFixed, setIsFixed] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`w-full min-h-[65px] bg-background shadow-[0px_-11px_54px_#00000014] ${isFixed ? "fixed top-0 left-0 right-0 z-50" : "relative"
        }`}
    >
      <div className="flex items-center justify-between w-full max-w-[1548px] h-auto min-h-[62px] mx-auto px-4 md:px-8 lg:px-[100px] py-2 md:pt-[9px]">
        <a href="/">
          <img
            className="relative w-[140px] h-[35px] md:w-[150px] md:h-[30px] object-contain"
            alt="Rentmatch logo"
            src={IMAGES.logo2}
          />
        </a>

        <a href="/" className="flex items-center justify-center gap-2 w-[200px] h-[54px] px-5 py-[11px] bg-background rounded-full border border-solid hover:bg-[#2a429326] h-auto">
          <img className="w-5 h-5" alt="Icon" src={IMAGES.home} />
          <span className="hidden lg:inline font-sans font-semibold text-primary text-base tracking-[0] leading-[normal] hover:text-primary">
            Back To Home
          </span>
        </a>
      </div>
    </header>
  );
};
export default Navbar;