import { SearchIcon } from "lucide-react";
import React from "react";
// import { Button } from "../../../../../components/ui/button";
import { Button } from "../../../../../../ui/button";
import { Card, CardContent } from "../../../../../../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../ui/select";
import { IMAGES } from "../../../../../../../assets/index";

const propertyTypes = [
  {
    icon: IMAGES.house_icon,
    label: "Houses",
  },
  {
    icon: IMAGES.villa_icon,
    label: "Villa",
  },
  {
    icon: IMAGES.office_icon,
    label: "Office",
  },
  {
    icon: IMAGES.apartment_icon,
    label: "Apartments",
  },
];

export const ContentSection = () => {
  return (
    <section className="w-full min-h-[623px] bg-accent relative">
      <div className="w-full max-w-[1174px] h-auto min-h-[519px] pt-8 md:pt-[104px] relative px-4 sm:md:px-0">
        <img
          className="absolute w-[960px] h-[168px] top-[455px] left-0 hidden lg:block z-0"
          alt="Group"
          src={IMAGES.dashboard_back}
        />

        <div className="flex flex-col w-full max-w-[1070px] items-start gap-6 md:gap-10 pl-0 md:pl-8 lg:pl-[104px]">
          <div className="flex flex-col w-full max-w-[796px] items-start gap-3">
            <h1 className="w-full max-w-[753px] [font-family:'Maven_Pro',Helvetica] font-extrabold text-3xl md:text-5xl lg:text-[66px] leading-tight md:leading-[66px] tracking-[0]">
              <span className="text-foreground">Post Your Need, Let </span>
              <span className="text-[#38ac78]">
                Landlords <br />
              </span>
              <span className="text-foreground">Find You!</span>
            </h1>

            {/* <p className="w-full max-w-[753px] font-sans font-normal text-primary-foreground text-lg md:text-[22px] leading-relaxed md:leading-[30.8px] tracking-[0]">
              We are a real estate agency that will help you find the best
              <br />
              residence you dream of.
            </p> */}
          </div>

          <div
            className="flex flex-col w-full max-w-[833px] items-start gap-4 md:gap-6 z-9"
            // style={{ zIndex: 9 }}
          >
            <div className="flex flex-col md:flex-row items-start gap-3 md:gap-5">
              <p className="font-body-body-02 font-[number:var(--body-body-02-font-weight)] text-foreground text-[length:var(--body-body-02-font-size)] tracking-[var(--body-body-02-letter-spacing)] leading-[var(--body-body-02-line-height)] [font-style:var(--body-body-02-font-style)]">
                What are you looking for:
              </p>

              <div className="flex flex-wrap items-start gap-3 md:gap-4">
                {propertyTypes.map((type, index) => (
                  <button
                    key={index}
                    className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                  >
                    <img className="w-3.5 h-3.5" alt="Icon" src={type.icon} />
                    <span className="font-sans font-bold text-foreground text-sm leading-[22px] tracking-[0]">
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button className="z-9 h-auto bg-primary hover:bg-primary/90 rounded-[99px] px-6 md:px-10 py-[11px] gap-2 w-full md:w-auto">
            <span className="font-sans font-semibold text-background text-base">
              Post Your Requirement
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};
