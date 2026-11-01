import React from "react";
import { IMAGES } from "../../../../../../assets/index";
import { useInView } from "react-intersection-observer";
import { getWhatWeDo } from "../../../../../../actions/cms/cmsPageApis";
import { useQuery } from "@tanstack/react-query";

const ServicesSection = () => {
  const [rightRef, inRightView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [leftRef, inLeftView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["what-we-do-cms"],
    queryFn: () => getWhatWeDo(),
    staleTime: 5 * 60 * 1000,     // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // ── Early returns ────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="px-15 py-10 text-center">
        <p className="text-gray-500">Loading services section...</p>
      </div>
    );
  }

  if (isError || !data?.result || data.result.length === 0) {
    return (
      <div className="px-15 py-10 text-center">
        <p className="text-red-500">Failed to load content. Please try again later.</p>
      </div>
    );
  }

  // Find sections by section_type (API uses "LEFT" / "RIGHT")
  const sections = data.result;

  const leftSection = sections.find(
    (s: any) => s.section_type?.toUpperCase() === "LEFT"
  );

  const rightSection = sections.find(
    (s: any) => s.section_type?.toUpperCase() === "RIGHT"
  );

  // Optional: fallback message if structure is unexpected
  if (!leftSection && !rightSection) {
    return (
      <div className="px-15 py-10 text-center">
        <p>No valid sections found in CMS data.</p>
      </div>
    );
  }

  // console.log(data, "<-- what-we-do API response");

  return (
    <div className="px-15 py-10">
      <h4 className="font-sans font-semibold text-primary text-sm tracking-[1.44px] leading-[1.2] whitespace-nowrap mb-2">
        WHAT WE DO
      </h4>

      <div className="w-full flex gap-6 flex-col lg:flex-row" id="discover">
        {/* Left section – usually Tenant side */}
        {leftSection && (
          <section
            ref={leftRef}
            className={`w-full lg:w-1/2 relative flex flex-col gap-6 ${inLeftView ? "animate__animated animate__slideInLeft" : "opacity-0"
              }`}
          >
            <div className="flex flex-col items-start gap-2 max-w-[630px]">
              <h3 className="font-sans text-2xl font-extrabold text-foreground tracking-tight leading-7">
                {leftSection.question}
              </h3>
              <p className="text-[12px] text-gray-600">{leftSection.ans}</p>
            </div>

            <div className="flex flex-col gap-4">
              {leftSection.subInfo?.map((item: any, idx: number) => (
                <div key={item._id || idx} className="w-fit">
                  <div className="flex gap-4 rounded-full p-2 pr-6 items-center shadow-md/30 bg-white">
                    <div className="p-[2px] rounded-full w-[45px] h-[45px] flex items-center justify-center shadow-md/30 bg-gray-50">
                      <img
                        className="w-[25px] h-[25px] object-contain"
                        src={IMAGES[item.icon?.toLowerCase() as keyof typeof IMAGES]}
                        alt={item.title || "icon"}
                        onError={(e) => {
                          e.currentTarget.src = "/fallback-icon.png"; // ← optional fallback
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-[17px] font-semibold text-primary">
                        {item.title}
                      </p>
                      <p className="text-[12px] text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Right section – usually Landlord side */}
        {rightSection && (
          <section
            ref={rightRef}
            className={`w-full lg:w-1/2 relative flex flex-col gap-6 ${inRightView ? "animate__animated animate__slideInRight" : "opacity-0"
              }`}
          >
            <div className="flex flex-col items-start gap-2 max-w-[630px]">
              <h3 className="font-sans text-2xl font-extrabold text-foreground tracking-tight leading-7">
                {rightSection.question}
              </h3>
              <p className="text-[12px] text-gray-600">{rightSection.ans}</p>
            </div>

            <div className="flex flex-col gap-4">
              {rightSection.subInfo?.map((item: any, idx: number) => (
                <div key={item._id || idx} className="w-fit">
                  <div className="flex gap-4 rounded-full p-2 pr-6 items-center shadow-md/30 bg-white">
                    <div className="p-[2px] rounded-full w-[45px] h-[45px] flex items-center justify-center shadow-md/30 bg-gray-50">
                      <img
                        className="w-[25px] h-[25px] object-contain"
                        src={IMAGES[item.icon?.toLowerCase() as keyof typeof IMAGES]}
                        alt={item.title || "icon"}
                        onError={(e) => {
                          e.currentTarget.src = "/fallback-icon.png"; // ← optional
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-[17px] font-semibold text-primary">
                        {item.title}
                      </p>
                      <p className="text-[12px] text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ServicesSection;


// import React from "react";
// import { Button } from "../../../../../ui/button";
// import { IMAGES } from "../../../../../../assets/index";
// import { useInView } from "react-intersection-observer";
// import { useQuery } from "@tanstack/react-query";
// import { getWhatWeDo } from "../../../../../../actions/cms/cmsPageApis";

// const data = {
//   message: "Data fetched successfully",
//   result: [
//     {
//       id: 1,
//       slug: "", //optional
//       section: [
//         {
//           sectionType: "left", // left or right enum
//           question: "As a Tenants want to Post your property criteria?",
//           ans: "We’re your partners in finding the perfect space to call home, grow your business, or invest in your future. Whether you're buying, selling, renting, or exploring investment opportunities, we bring clarity to every step of the process.",
//           subInfo: [
//             {
//               title: "1. Post Your Property Criteria",
//               desc: "Explore rented property you need writing the criteria or description.",
//               icon: "property_criteria",
//             },
//             {
//               title: "2. Search Properties",
//               desc: "Explore rented property you need writing the criteria or description.",
//               icon: "search_properties",
//             },
//             {
//               title: "3. Save Favorite Properties",
//               desc: "Explore rented property you need writing the criteria or description.",
//               icon: "save_favourite",
//             },
//             {
//               title: "4. Contact With Property Owner",
//               desc: "Explore rented property you need writing the criteria or description.",
//               icon: "property_owner",
//             },
//           ],
//         },
//         {
//           sectionType: "right", // left or right enum
//           question: "As a Landlord want a Tenant your property?",
//           ans: "We’re your partners in finding the perfect space to call home, grow your business, or invest in your future. Whether you're buying, selling, renting, or exploring investment opportunities, we bring clarity to every step of the process.",
//           subInfo: [
//             {
//               title: "1. Post Your Property Criteria",
//               desc: "Explore rented property you need writing the criteria or description.",
//               icon: "property_criteria",
//             },
//             {
//               title: "2. Search Properties",
//               desc: "Explore rented property you need writing the criteria or description.",
//               icon: "search_properties",
//             },
//             {
//               title: "3. Save Favorite Properties",
//               desc: "Explore rented property you need writing the criteria or description.",
//               icon: "save_favourite",
//             },
//             {
//               title: "4. Contact With Property Owner",
//               desc: "Explore rented property you need writing the criteria or description.",
//               icon: "property_owner",
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

// const ServicesSection = () => {
//   const [rightRef, inRightView] = useInView({
//     triggerOnce: true, // Trigger animation only once
//     threshold: 0.3, // Trigger when 10% of the image is visible
//   });
//   const [leftRef, inLeftView] = useInView({
//     triggerOnce: true, // Trigger animation only once
//     threshold: 0.3, // Trigger when 10% of the image is visible
//   });

//   console.log(data, "<--what we do ?");

//   return (
//     <div className="px-15 py-10">
//       <h4 className="font-sans font-semibold text-primary text-sm tracking-[1.44px] leading-[1.2] whitespace-nowrap  mb-2">
//         WHAT WE DO
//       </h4>
//       <div className="w-full flex gap-6 " id="discover">
//         <section
//           ref={rightRef}
//           className={`w-full relative flex flex-col gap-6 ${inRightView ? "animate__animated animate__slideInRight " : ""}`}
//         >
//           <div className="flex flex-col w-full lg:w-[630px] items-start gap-2">
//             <h3 className="font-sanstext-2xl font-extrabold text-foreground text-xl tracking-[0] leading-7">
//               As a Tenants want to Post your property criteria?
//             </h3>
//             <p className="text-[12px]">
//               We’re your partners in finding the perfect space to call home,
//               grow your business, or invest in your future. Whether you're
//               buying, selling, renting, or exploring investment opportunities,
//               we bring clarity to every step of the process.
//             </p>
//           </div>
//           <div className="flex flex-col gap-4">
//             <div className="w-[fit-content]">
//               <div className="flex gap-4 rounded-full p-2 pr-6 items-center shadow-md/30">
//                 <div className="p-[2px] rounded-full w-[45px] h-[45px] flex items-center justify-center shadow-md/30">
//                   <img
//                     className="w-[25px] h-[25px]"
//                     src={IMAGES.property_criteria}
//                     alt=""
//                   />
//                 </div>
//                 <div className="">
//                   <p className="text-[17px] font-semibold text-primary">
//                     1. Post Your Property Criteria
//                   </p>
//                   <p className="text-[12px]">
//                     Explore rented property you need writing the criteria or
//                     description.
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="w-[fit-content]">
//               <div className="flex gap-4 rounded-full p-2 pr-6 items-center shadow-md/30">
//                 <div className="p-[2px] rounded-full w-[45px] h-[45px] flex items-center justify-center shadow-md/30">
//                   <img
//                     className="w-[25px] h-[25px]"
//                     src={IMAGES.search_properties}
//                     alt=""
//                   />
//                 </div>
//                 <div className="">
//                   <p className="text-[17px] font-semibold text-primary">
//                     2. Search Properties
//                   </p>
//                   <p className="text-[12px]">
//                     Explore rented property you need writing the criteria or
//                     description.
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="w-[fit-content]">
//               <div className="flex gap-4 rounded-full p-2 pr-6 items-center shadow-md/30">
//                 <div className="p-[2px] rounded-full w-[45px] h-[45px] flex items-center justify-center shadow-md/30">
//                   <img
//                     className="w-[25px] h-[25px]"
//                     src={IMAGES.save_favourite}
//                     alt=""
//                   />
//                 </div>
//                 <div className="">
//                   <p className="text-[17px] font-semibold text-primary">
//                     3. Save Favorite Properties
//                   </p>
//                   <p className="text-[12px]">
//                     Explore rented property you need writing the criteria or
//                     description.
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="w-[fit-content]">
//               <div className="flex gap-4 rounded-full p-2 pr-6 items-center shadow-md/30">
//                 <div className="p-[2px] rounded-full w-[45px] h-[45px] flex items-center justify-center shadow-md/30">
//                   <img
//                     className="w-[25px] h-[25px]"
//                     src={IMAGES.property_owner}
//                     alt=""
//                   />
//                 </div>
//                 <div className="">
//                   <p className="text-[17px] font-semibold text-primary">
//                     4. Contact With Property Owner
//                   </p>
//                   <p className="text-[12px]">
//                     Explore rented property you need writing the criteria or
//                     description.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section
//           ref={leftRef}
//           className={`w-full h-auto relative flex flex-col gap-6 ${inLeftView ? "animate__animated animate__slideInLeft " : ""}`}
//         >
//           <div className="flex flex-col w-full lg:w-[630px] items-start gap-2">
//             <h3 className="font-sans font-semibold text-foreground text-xl tracking-[0] leading-7">
//               As a Landlord want a Tenant your property?
//             </h3>
//             <p className="text-[12px]">
//               We’re your partners in finding the perfect space to call home,
//               grow your business, or invest in your future. Whether you're
//               buying, selling, renting, or exploring investment opportunities,
//             </p>
//           </div>
//           <div className="flex flex-col gap-4">
//             <div className="w-[fit-content]">
//               <div className="flex gap-4 rounded-full p-2 pr-6 items-center shadow-md/30">
//                 <div className="p-[2px] rounded-full w-[45px] h-[45px] flex items-center justify-center shadow-md/30">
//                   <img
//                     className="w-[25px] h-[25px]"
//                     src={IMAGES.property_criteria}
//                     alt=""
//                   />
//                 </div>
//                 <div className="">
//                   <p className="text-[17px] font-semibold text-primary">
//                     1. Post your Property
//                   </p>
//                   <p className="text-[12px]">
//                     Explore rented property you need writing the criteria or
//                     description.
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="w-[fit-content]">
//               <div className="flex gap-4 rounded-full p-2 pr-6 items-center shadow-md/30">
//                 <div className="p-[2px] rounded-full w-[45px] h-[45px] flex items-center justify-center shadow-md/30">
//                   <img
//                     className="w-[25px] h-[25px]"
//                     src={IMAGES.search_tenents}
//                     alt=""
//                   />
//                 </div>
//                 <div className="">
//                   <p className="text-[17px] font-semibold text-primary">
//                     2. Screen Tenants
//                   </p>
//                   <p className="text-[12px]">
//                     Explore rented property you need writing the criteria or
//                     description.
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="w-[fit-content]">
//               <div className="flex gap-4 rounded-full p-2 pr-6 items-center shadow-md/30">
//                 <div className="p-[2px] rounded-full w-[45px] h-[45px] flex items-center justify-center shadow-md/30">
//                   <img
//                     className="w-[25px] h-[25px]"
//                     src={IMAGES.rent_faster}
//                     alt=""
//                   />
//                 </div>
//                 <div className="">
//                   <p className="text-[17px] font-semibold text-primary">
//                     3. Rent Faster
//                   </p>
//                   <p className="text-[12px]">
//                     Explore rented property you need writing the criteria or
//                     description.
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="w-[fit-content]">
//               <div className="flex gap-4 rounded-full p-2 pr-6 items-center shadow-sm">
//                 <div className="p-[2px] rounded-full w-[45px] h-[45px] flex items-center justify-center shadow-md/30">
//                   <img
//                     className="w-[25px] h-[25px]"
//                     src={IMAGES.property_owner}
//                     alt=""
//                   />
//                 </div>
//                 <div className="">
//                   <p className="text-[17px] font-semibold text-primary">
//                     4. Handover The Key For Rent
//                   </p>
//                   <p className="text-[12px]">
//                     Explore rented property you need writing the criteria or
//                     description.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>

//     </div>
//   );
// };
// export default ServicesSection;
