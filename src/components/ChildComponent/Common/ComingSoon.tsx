import React from "react";
import { IMAGES } from "../../../assets/index";

const ComingSoon = () => {
  return (
    <div className="flex justify-center items-center bg-white rounded-lg shadow-md w-full h-full rounded-lg">
      <img src={IMAGES.coming_soon} alt="" className="blink w-[50%]"/>
    </div>
  );
};

export default ComingSoon;
