import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import React from "react";
import { useInView } from "react-intersection-observer";
import { IMAGES } from "../../assets/index";

const Footer = () => {
  const [ref, inView] = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.3, // Trigger when 10% of the image is visible
  });

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
  return (
    <footer className="flex flex-col w-full items-center gap-8 md:gap-[50px] p-2 px-4 relative bg-background border-t [border-top-style:solid] [border-right-style:none] [border-bottom-style:none] [border-left-style:none] border-[#00000017]">
      <div className="flex flex-col md:flex-row w-full max-w-[1720px] items-center justify-between relative flex-[0_0_auto] gap-4">
        <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
          <a href="/">©2025 RentMatch. All Rights Reserved.</a>
        </div>

        <div className="inline-flex items-center gap-4 relative flex-[0_0_auto]">
          <div className="relative w-fit font-button-button-small font-[number:var(--button-button-small-font-weight)] text-primary text-[length:var(--button-button-small-font-size)] tracking-[var(--button-button-small-letter-spacing)] leading-[var(--button-button-small-line-height)] whitespace-nowrap [font-style:var(--button-button-small-font-style)]">
            Follow Us:
          </div>
          {socialMediaInfo.map((socialMedia, index) => (
            <a
              href={socialMedia.url}
              ref={ref}
              className={`${inView ? "animate__animated animate__slideInRight" : ""
                }`}
              style={{ animationDelay: `${index * 0.2}s` }}
              key={index}
            >
              <img
                className="relative flex-[0_0_auto]"
                alt="Social icon"
                src={socialMedia.icon}
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
export default Footer;
