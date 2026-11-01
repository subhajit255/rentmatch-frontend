import React from "react";
import { Button } from "../../../../../ui/button";
import { IMAGES } from "../../../../../../assets/index";

export const ServicesSection = () => {
  const processSteps = [
    {
      text: "Find Property for Rent",
      className: "w-[200px] md:w-[248px] h-[50px] md:h-[63px] top-0 left-px",
    },
    {
      text: "Post Your Requirement",
      className:
        "w-[200px] md:w-[250px] h-[50px] md:h-[63px] top-[11px] left-[300px] md:left-[489px]",
    },
    {
      text: "Connect With Landlord",
      className:
        "w-[200px] md:w-[258px] h-[50px] md:h-[63px] top-[200px] md:top-[306px] left-0",
    },
    {
      text: "Start conversation",
      className:
        "w-[180px] md:w-[221px] h-[50px] md:h-[63px] top-[170px] md:top-[262px] left-[320px] md:left-[507px]",
    },
  ];

  return (
    <section className="w-full relative px-4 py-8 md:py-16">
      <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16 max-w-7xl mx-auto">
        <div className="flex flex-col w-full lg:w-[714px] items-start gap-4 md:gap-7">
          <div className="flex flex-col w-full items-start gap-4 md:gap-[22px]">
            <div className="flex flex-col w-full lg:w-[630px] items-start gap-1">
              <div className="font-sans font-semibold text-primary text-lg tracking-[1.44px] leading-6 whitespace-nowrap">
                WHAT WE DO
              </div>

              <h2 className="font-heading-heading-03 font-[number:var(--heading-heading-03-font-weight)] text-foreground text-2xl md:text-[length:var(--heading-heading-03-font-size)] tracking-[var(--heading-heading-03-letter-spacing)] leading-tight md:leading-[var(--heading-heading-03-line-height)] [font-style:var(--heading-heading-03-font-style)]">
                Discover What Sets Our
              </h2>
            </div>

            <div className="w-full lg:w-[840px] font-sans font-normal text-primary-foreground text-sm md:text-base tracking-[0] leading-relaxed md:leading-[27.2px]">
              We&apos;re your partners in finding the perfect space to call
              home, grow your business, or invest in your future. Whether
              you&#39;re buying, selling, renting, or exploring investment
              opportunities, we bring clarity to every step of the process.
              <br />
              <br />
              To redefine the real estate experience in India by blending
              technology, trust, and human connection. We aim to be the most
              reliable bridge between dreams and reality—one property at a time.
              <br />
              <br />
              Our team of seasoned professionals, tech innovators, and local
              agents work together to deliver a seamless experience tailored to
              your needs.
            </div>

            <Button className="h-[52px] px-6 md:px-10 py-[11px] bg-primary rounded-[99px] font-sans font-semibold text-background text-base hover:bg-primary/90">
              Read More
            </Button>
          </div>
        </div>

        <div className="w-full lg:w-[739px] h-[300px] md:h-[414px] relative overflow-hidden">
          {/* <img className="absolute w-px h-px top-0 left-[46px]" alt="Group" /> */}

          <div className="absolute w-full h-full top-0 left-0 scale-75 md:scale-100 origin-top-left">
            <div className="absolute w-[739px] h-[369px] top-[45px] left-0">
              <img
                className="absolute w-[386px] h-[39px] top-[97px] left-[191px]"
                alt="Vector"
                src={IMAGES.discover_sets}
              />
              {/* {processSteps.map((step, index) => (
              <Card
                key={index}
                className={`absolute ${step.className} bg-background rounded-[58px] md:rounded-[116px] shadow-[0px_0px_44px_#0000001f] border-0`}
              >
                <CardContent className="flex items-center justify-center p-3 md:p-[30px] h-full">
                  <div className="font-sans font-semibold text-primary text-sm md:text-lg tracking-[0] leading-tight md:leading-[30px] text-center">
                    {step.text}
                  </div>
                </CardContent>
              </Card>
            ))} */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
