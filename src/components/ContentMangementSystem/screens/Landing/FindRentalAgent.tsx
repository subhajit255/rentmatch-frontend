import React, { useEffect, useState } from "react";
import TopRentalAgent from "./sections/TopRentalAgent/TopRentalAgent";
import SearchRentalAgent from "./sections/SearchRentalAgent/SearchRentalAgent";
import RentalAgentList from "./sections/RentalAgentList/RentalAgentList";
const FindRentalAgent = () => {
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
  return (
    <>
      <TopRentalAgent />
      <SearchRentalAgent />
      <RentalAgentList />
    </>
  );
};
export default FindRentalAgent;
