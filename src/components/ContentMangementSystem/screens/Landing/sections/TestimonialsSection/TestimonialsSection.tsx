import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, CardContent } from "../../../../../ui/card";
import { IMAGES } from "../../../../../../assets/index";
import { useInView } from "react-intersection-observer";
import Slider from "react-slick";
import { useQuery } from "@tanstack/react-query";
import { getFeedbackCms } from "../../../../../../actions/cms/cmsPageApis";

const TestimonialsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.3, // Trigger when 10% of the image is visible
  });
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Duration for each slide (in milliseconds)
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  // const testimonials = [
  //   {
  //     avatar: IMAGES.dummy_img,
  //     name: "Annette Black",
  //     title: "CEO Themesflat",
  //   },
  //   {
  //     avatar: IMAGES.dummy_img,
  //     name: "John Smith",
  //     title: "Property Manager",
  //   },
  //   {
  //     avatar: IMAGES.dummy_img,
  //     name: "Sarah Johnson",
  //     title: "Real Estate Agent",
  //   },
  //   {
  //     avatar: IMAGES.dummy_img,
  //     name: "Michael Brown",
  //     title: "Investment Advisor",
  //   },
  //   {
  //     avatar: IMAGES.dummy_img,
  //     name: "Michael Brown",
  //     title: "Investment Advisor",
  //   },
  // ];

  // ___CALLING API LOGICS ________
  const { data, isLoading, isError } = useQuery({
    queryKey: ["property-feedback-cms"],
    queryFn: () => getFeedbackCms(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log(data, "<-- cms feedback");

  return (
    <>
      {!isLoading &&
      !isError &&
      data &&
      data?.result &&
      data?.result.length > 0 ? (
        <section className="h-full relative py-12 px-4">
          <div className="flex flex-col gap-12 max-w-7xl mx-auto">
            <header className="flex flex-col gap-1">
              <div className="font-sans font-semibold text-primary text-lg tracking-[1.44px] leading-6">
                CLIENTS FEEDBACK
              </div>
              <h2 className="font-sans font-extrabold text-foreground text-2xl md:text-4xl tracking-[0] leading-tight md:leading-[44px]">
                What&apos;s People Says
              </h2>
            </header>

            <div
              ref={ref}
              className={`grid grid-cols-1 gap-4 md:gap-[22px] ${inView ? "animate__animated animate__slideInLeft" : ""}`}
            >
              <Slider {...settings}>
                {data?.result.map(
                  (
                    testimonial: {
                      _id: string;
                      member_id?: {
                        first_name?: string;
                        last_name?: string;
                        profile_image?: string;
                      };
                      avatar?: string;
                      name?: string;
                      title?: string;
                      rating: string;
                      role?: string;
                      subject?: string;
                      commend?: string;
                      profile_image?: string;
                    },
                    index: number,
                  ) => {
                    const firstName =
                      testimonial?.member_id?.first_name || testimonial?.name || "";
                    const lastName = testimonial?.member_id?.last_name || "";
                    const fullName =
                      `${firstName} ${lastName}`.trim() || "Unknown";
                    const initial =
                      (firstName || fullName).charAt(0).toUpperCase() || "U";
                    const userImage =
                      testimonial?.member_id?.profile_image ||
                      testimonial?.profile_image ||
                      testimonial?.avatar;

                    return (
                      <div key={index} className="px-2 m-3">
                        <Card
                          className="bg-white rounded-[20px] shadow-[0px_0px_34px_#00000014] border-0 border border-card-border"
                        >
                          <CardContent className="flex flex-col gap-3 p-4 md:p-[30px]">
                            <img
                              className="w-10 h-10 md:w-[60px] md:h-[60px]"
                              alt="Quote icon"
                              src={IMAGES.quote}
                            />

                            <div className="flex flex-col gap-6">
                              <p className="font-sans font-normal text-primary-foreground text-xs md:text-sm tracking-[0] leading-[21.6px]">
                                {(testimonial.subject?.length ?? 0) > 400
                                  ? `${testimonial.subject?.substring(0, 400)}...`
                                  : testimonial.subject || "N/A"}
                              </p>

                              <div className="flex items-center gap-3">
                                {userImage ? (
                                  <img
                                    className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-full flex-shrink-0"
                                    alt={fullName}
                                    src={userImage}
                                  />
                                ) : (
                                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-lg md:text-xl">
                                    {initial}
                                  </div>
                                )}

                                <div className="flex flex-col justify-center gap-[4px]">
                                  <div className="flex flex-col gap-0.5">
                                    <h3 className="font-sans font-bold text-foreground text-sm md:text-lg tracking-[0] leading-[25.2px]">
                                      {fullName}
                                    </h3>
                                    <p className="font-caption-caption-02 text-muted-foreground text-xs tracking-[var(--caption-caption-02-letter-spacing)] leading-[var(--caption-caption-02-line-height)]">
                                      {testimonial.role}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {Array.from({
                                      length: parseInt(testimonial.rating) || 5,
                                    }).map((_, i) => (
                                      <img
                                        key={i}
                                        className="flex-shrink-0"
                                        alt="Rating star"
                                        src={IMAGES.star}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  },
                )}
              </Slider>
            </div>

            {/* <div className="flex justify-center">
          <div className="flex gap-1">
            <div className="w-[23px] h-[3px] bg-primary rounded-[40px]" />
            <div className="w-[23px] h-[3px] bg-[#1563df33] rounded-[40px]" />
          </div>
        </div> */}
          </div>
        </section>
      ) : (
        <div className="text-center py-8"></div>
      )}
    </>
  );
};
export default TestimonialsSection;
