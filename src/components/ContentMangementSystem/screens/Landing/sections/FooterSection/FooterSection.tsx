import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import React from "react";
import { Separator } from "../../../../../ui/separator";
import { IMAGES } from "../../../../../../assets/index";
import { useInView } from "react-intersection-observer";

const FooterSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.3, // Trigger when 10% of the image is visible
  });
  const [footerRef, inFooterView] = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.3, // Trigger when 10% of the image is visible
  });
  const contactInfo = [
    {
      icon: MapPinIcon,
      text: "PO Box 121, Newport Beach NSW 2106, Australia",
    },
    {
      icon: MailIcon,
      text: "info@rentmatch.au",
    },
  ];

  const socialMediaInfo = [
    {
      icon: IMAGES.facebook,
      url: "#",
    },
    // {
    //   icon: IMAGES.linkedin,
    //   url: "#",
    // },
    // {
    //   icon: IMAGES.twitter,
    //   url: "#",
    // },
    // {
    //   icon: IMAGES.pinterest,
    //   url: "#",
    // },
    {
      icon: IMAGES.instagram,
      url: "#",
    },
    // {
    //   icon: IMAGES.youtube,
    //   url: "#",
    // },
  ];


  const categoryLinks = ["Rent a Property", "Post Your Property"];

  const importantLinks = ["Terms and Conditions", "Privacy Policies"];
  return (
    <footer className="flex flex-col w-full items-center gap-8 md:gap-[50px] pt-8 md:pt-[50px] pb-[30px] px-4 relative bg-[#f7f7f7] border-t [border-top-style:solid] [border-right-style:none] [border-bottom-style:none] [border-left-style:none] border-[#00000017]">
      <div className="flex flex-col md:flex-row w-full max-w-[1720px] items-center justify-between relative flex-[0_0_auto] gap-4">
        <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
          <a href="/">
            <img
              className="relative w-[140px] h-[35px] md:w-[150px] md:h-[30px]"
              alt="Rentmatch logo"
              src={IMAGES.logo1}
            />
          </a>
        </div>

        <div className="inline-flex items-center gap-4 relative flex-[0_0_auto]">
          <div className="relative w-fit font-button-button-small font-[number:var(--button-button-small-font-weight)] text-primary text-[length:var(--button-button-small-font-size)] tracking-[var(--button-button-small-letter-spacing)] leading-[var(--button-button-small-line-height)] whitespace-nowrap [font-style:var(--button-button-small-font-style)]">
            Follow Us:
          </div>
          {socialMediaInfo.map((socialMedia, index) => (
            <a href={socialMedia.url} ref={ref} className={`${inView ? 'animate__animated animate__slideInRight' : ''}`} style={{ animationDelay: `${index * 0.2}s` }} key={index}>
              <img
                className="relative flex-[0_0_auto]"
                alt="Social icon"
                src={socialMedia.icon}
              />
            </a>
          ))}
        </div>
      </div>

      <Separator className="w-full max-w-[1720px] bg-[#3333331a]" />

      <div className={`flex flex-col lg:flex-row w-full max-w-[1720px] gap-8 lg:gap-[188px] items-start relative flex-[0_0_auto] ${inFooterView ? 'animate__animated animate__slideInUp' : ''}`} ref={footerRef}>
        <div className="flex flex-col w-full lg:w-[330px] items-start gap-3 relative">
          <div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
            {contactInfo.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 relative flex-[0_0_auto]"
                >
                  <IconComponent className="relative w-5 h-5 text-primary-foreground" />
                  <div className="relative w-fit mt-[-1.00px] font-sans font-normal text-primary-foreground text-sm tracking-[0] leading-[22px] whitespace-nowrap">
                    {item.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16 flex-1">

          <div className="inline-flex flex-col justify-center gap-3 items-start relative">
            <div className="relative w-fit mt-[-1.00px] font-button-button font-[number:var(--button-button-font-weight)] text-primary-foreground text-[length:var(--button-button-font-size)] tracking-[var(--button-button-letter-spacing)] leading-[var(--button-button-line-height)] [font-style:var(--button-button-font-style)]">
              Categories
            </div>

            <div className="inline-flex flex-col items-start gap-2 relative flex-[0_0_auto]">
              {categoryLinks.map((link, index) => (
                <div
                  key={index}
                  className="relative w-fit mt-[-1.00px] font-sans font-normal text-muted-foreground text-sm tracking-[0] leading-[22px] whitespace-nowrap"
                >
                  {link}
                </div>
              ))}
            </div>
          </div>

          <div className="inline-flex flex-col justify-center gap-3 items-start relative">
            <div className="relative w-fit mt-[-1.00px] font-button-button font-[number:var(--button-button-font-weight)] text-primary-foreground text-[length:var(--button-button-font-size)] tracking-[var(--button-button-letter-spacing)] leading-[var(--button-button-line-height)] [font-style:var(--button-button-font-style)]">
              Important Links
            </div>

            <div className="inline-flex flex-col items-start gap-2 relative flex-[0_0_auto]">
              {importantLinks.map((link, index) => (
                <div
                  key={index}
                  className="relative w-fit mt-[-1.00px] font-sans font-normal text-muted-foreground text-sm tracking-[0] leading-[22px] whitespace-nowrap"
                >
                  {link}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="inline-flex flex-col items-center lg:items-start justify-end gap-[28.43px] relative flex-[0_0_auto]">
          <img
            className="relative w-[150px] h-[44px] lg:w-[198.07px] lg:h-[58.76px] object-cover"
            alt="Image"
            src={IMAGES.play_store}
          />

          <img
            className="relative w-[148px] h-[44px] lg:w-[195.23px] lg:h-[57.81px]"
            alt="Image"
            src={IMAGES.apple_store}
          />
        </div>
      </div>

      <div className="flex w-full max-w-[1714px] items-center justify-center pt-[30px] pb-0 relative flex-[0_0_auto] border-t [border-top-style:solid] border-[#66666614]">
        <div className="relative w-fit mt-[-1.00px] font-sans font-normal text-muted-foreground text-sm tracking-[0] leading-[22px] text-center">
          ©2025 RentMatch. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
export default FooterSection;