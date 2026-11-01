import React, { useEffect, useState } from "react";
import { Button } from "../../../../../ui/button";
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../../../../ui/navigation-menu";
import { IMAGES } from "../../../../../../assets/index";
import { Menu, X } from "lucide-react";

const NavbarSection = () => {
  const location = useLocation();
  const currentPath = location.pathname + location.hash;
  const navigationItems = [
    { label: "Home", href: "/", isActive: currentPath === '/' },
    { label: "How It Works", href: "/how-it-works", isActive: currentPath === '/how-it-works' },
    { label: "Browse Rentals", href: "/find-property", isActive: currentPath === '/find-property' },
    { label: "Find Tenants", href: "/find-tenant", isActive: currentPath === '/find-tenant' },
    { label: "Advice", href: "/advice", isActive: currentPath === '/advice' },
    // { label: "Find Rental Agent", href: "/find-rental-agent", isActive: currentPath === '/find-rental-agent' || currentPath === '/rental-agent-details' },
    // { label: "FAQ's", href: "/#faq", isActive: currentPath === '/#faq' },
    // { label: "Contacts", href: "/#contact", isActive: currentPath === '/#contact' },
  ];
  const [isFixed, setIsFixed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); // small delay to allow DOM to render
      }
    }
  }, [location.hash, location.pathname]);

  return (
    <>
    {/* keeps page content from jumping when the header switches to fixed */}
    {isFixed && <div className="min-h-[81px]" aria-hidden="true" />}
    <header
      className={`w-full min-h-[81px] bg-background shadow-[0px_-11px_54px_#00000014] ${isFixed ? "fixed top-0 left-0 right-0 z-50" : "relative"
        }`}
    >
      <div className="flex items-center justify-between gap-2 w-full max-w-[1548px] h-auto min-h-[62px] mx-auto px-4 md:px-8 lg:px-[100px] sm:py-2 md:pt-[9px]">
        <a href="/">
          <img
            className="relative w-[140px] h-[35px] md:w-[150px] md:h-[30px] object-contain"
            alt="Rentmatch logo"
            src={IMAGES.logo2}
          />
        </a>

        <NavigationMenu className="hidden lg:flex flex-1 max-w-none">
          <NavigationMenuList className="flex items-center justify-center md:gap-2 lg:gap-4 xl:gap-6 gap-8 w-full">
            {navigationItems.map((item, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink asChild>
                  <Link
                    to={item.href}
                    className={`inline-flex items-center gap-1 relative font-sans font-medium text-base tracking-[0] leading-[normal] ${item.isActive ? "text-primary" : "text-foreground"
                      }`}
                  >
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <a href="/login" aria-label="Login" className="flex items-center justify-center gap-2 px-4 sm:px-5 py-[11px] bg-primary rounded-full border border-solid hover:bg-primary/90 h-auto">
            <img className="w-5 h-5" alt="" src={IMAGES.user} />
            <span className="hidden sm:inline font-sans font-semibold text-background text-base tracking-[0] leading-[normal]">
              Login
            </span>
          </a>
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full text-foreground hover:bg-accent"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="lg:hidden border-t border-[#00000017] bg-background px-4 pb-4">
          <ul className="flex flex-col">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`block py-3 font-sans font-medium text-base ${item.isActive ? "text-primary" : "text-foreground"}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
    </>
  );
};
export default NavbarSection;