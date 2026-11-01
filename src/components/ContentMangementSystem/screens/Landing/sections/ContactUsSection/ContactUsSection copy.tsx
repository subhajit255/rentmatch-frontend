// import React from "react";
// import { Button } from "../../../../../ui/button";
// import { Input } from "../../../../../ui/input";
// import { Label } from "../../../../../ui/label";
// import { Textarea } from "../../../../../ui/textarea";
// import { IMAGES } from "../../../../../../assets/index";
// import { useInView } from 'react-intersection-observer';
// import { dropALine } from "../../../../../../actions/cms/cmsPageApis";

// const ContactUsSection = () => {
//   const [leftRef, inLeftView] = useInView({
// 		triggerOnce: true, // Trigger animation only once
// 		threshold: 0.3, // Trigger when 10% of the image is visible
// 	});
//   const [rightRef, inRightView] = useInView({
// 		triggerOnce: true, // Trigger animation only once
// 		threshold: 0.3, // Trigger when 10% of the image is visible
// 	});
//   const formFields = [
//     {
//       id: "name",
//       label: "Your name",
//       placeholder: "Your name",
//       type: "input",
//     },
//     {
//       id: "email",
//       label: "Email address",
//       placeholder: "Email address",
//       type: "input",
//     },
//     {
//       id: "phone",
//       label: "Phone Numbers",
//       placeholder: "Phone Numbers:",
//       type: "input",
//     },
//     {
//       id: "subject",
//       label: "Subject",
//       placeholder: "Enter Keyword",
//       type: "input",
//     },
//   ];

//   return (
//     <section className="w-full relative" id="contact">
//       <div className="flex sm:flex-col lg:flex-row items-center justify-center gap-8 px-4 py-8 max-w-7xl mx-auto">
//         <div className={`sm:w-full lg:w-[637px] sm:h-[300px] md:h-[562px] relative sm:order-2 lg:order-1 overflow-hidden ${inLeftView ? 'animate__animated animate__slideInLeft' : ''}`} ref={leftRef}>
//           <div className="relative h-full sm:scale-50 md:scale-75 lg:scale-100 origin-center">

//             <img
//               className="absolute w-full h-full left-[21px]"
//               alt="Group"
//               src={IMAGES.drop_us}
//             />
//           </div>
//         </div>

//         <div className={`flex flex-col sm:w-full lg:w-[840px] items-center justify-center gap-5 rounded-[20px] sm:order-1 lg:order-2 ${inRightView ? 'animate__animated animate__slideInRight' : ''}`} ref={rightRef}>
//           <header className="flex flex-col items-start gap-3 w-full">
//             <h2 className="w-fit font-sans font-extrabold text-foreground sm:text-2xl md:text-3xl tracking-[0] sm:leading-tight md:leading-[42px]">
//               Drop Us A Line
//             </h2>

//             <p className="w-full font-body-body-02 font-[number:var(--body-body-02-font-weight)] text-muted-foreground sm:text-sm md:text-[length:var(--body-body-02-font-size)] tracking-[var(--body-body-02-letter-spacing)] sm:leading-relaxed md:leading-[var(--body-body-02-line-height)] [font-style:var(--body-body-02-font-style)]">
//               Feel free to connect with us through our online channels for
//               updates, news, and more.
//             </p>
//           </header>

//           <form className="gap-5 w-full flex flex-col items-start">
//             <div className="flex items-center sm:gap-4 md:gap-[30px] w-full flex-col sm:flex-row">
//               {formFields.slice(0, 2).map((field) => (
//                 <div
//                   key={field.id}
//                   className="flex flex-col items-start gap-2 flex-1 w-full"
//                 >
//                   <Label
//                     htmlFor={field.id}
//                     className="w-fit font-sans font-semibold text-foreground text-sm tracking-[0] leading-[19.6px]"
//                   >
//                     {field.label}
//                   </Label>

//                   <Input
//                     id={field.id}
//                     placeholder={field.placeholder}
//                     className="sm:h-12 md:h-[60px] rounded-xl sm:px-4 md:px-[18px] sm:py-3 md:py-4 w-full bg-background border border-solid border-sidebar-ring font-caption-caption-01 font-[number:var(--caption-caption-01-font-weight)] text-muted-foreground sm:text-sm md:text-[length:var(--caption-caption-01-font-size)] tracking-[var(--caption-caption-01-letter-spacing)] leading-[var(--caption-caption-01-line-height)] [font-style:var(--caption-caption-01-font-style)]"
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="flex items-center sm:gap-4 md:gap-[30px] w-full flex-col sm:flex-row">
//               {formFields.slice(2, 4).map((field) => (
//                 <div
//                   key={field.id}
//                   className="flex flex-col items-start gap-2 flex-1 w-full"
//                 >
//                   <Label
//                     htmlFor={field.id}
//                     className="w-fit font-sans font-semibold text-foreground text-sm tracking-[0] leading-[19.6px]"
//                   >
//                     {field.label}
//                   </Label>

//                   <Input
//                     id={field.id}
//                     placeholder={field.placeholder}
//                     className="sm:h-12 md:h-[60px] rounded-xl sm:px-4 md:px-[18px] sm:py-3 md:py-4 w-full bg-background border border-solid border-sidebar-ring font-caption-caption-01 font-[number:var(--caption-caption-01-font-weight)] text-muted-foreground sm:text-sm md:text-[length:var(--caption-caption-01-font-size)] tracking-[var(--caption-caption-01-letter-spacing)] leading-[var(--caption-caption-01-line-height)] [font-style:var(--caption-caption-01-font-style)]"
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="flex flex-col items-start gap-2 w-full">
//               <Label
//                 htmlFor="message"
//                 className="w-fit font-sans font-semibold text-foreground text-sm tracking-[0] leading-[19.6px]"
//               >
//                 Your Message
//               </Label>

//               <Textarea
//                 id="message"
//                 placeholder="Your Message"
//                 className="sm:h-24 md:h-[130px] rounded-2xl sm:px-4 md:px-[18px] sm:py-3 md:py-4 w-full bg-background border border-solid border-sidebar-ring font-caption-caption-01 font-[number:var(--caption-caption-01-font-weight)] text-muted-foreground sm:text-sm md:text-[length:var(--caption-caption-01-font-size)] tracking-[var(--caption-caption-01-letter-spacing)] leading-[var(--caption-caption-01-line-height)] [font-style:var(--caption-caption-01-font-style)] resize-none"
//               />
//             </div>
//           </form>

//           <Button className="sm:w-full md:w-[305px] sm:h-12 md:h-[62px] px-5 py-[11px] bg-primary rounded-full hover:bg-muted">
//             <span className="font-sans font-semibold text-background text-base text-center tracking-[0] leading-[normal]">
//               Send Message
//             </span>
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// };
// export default ContactUsSection;

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../../../../ui/button";
import { Input } from "../../../../../ui/input";
import { Label } from "../../../../../ui/label";
import { Textarea } from "../../../../../ui/textarea";
import { IMAGES } from "../../../../../../assets/index";
import { useInView } from "react-intersection-observer";
import { dropALine } from "../../../../../../actions/cms/cmsPageApis";
import { toast, useToast } from "../../../../../../custom-hooks/use-toast";

// ── Schema ────────────────────────────────────────────────
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
  phone: z
    .string()
    .min(7, "Phone number is too short")
    .max(15, "Phone number is too long")
    .regex(/^[0-9+\-\s()]*$/, "Invalid phone number format"),
  subject: z.string().min(3, "Subject is required").max(150),
  description: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000),
});

type FormValues = z.infer<typeof formSchema>;

// You can define this in a shared types file if needed
interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
}

const ContactUsSection = () => {
  // const { toasts } = useToast()

  const [leftRef, inLeftView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [rightRef, inRightView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ContactPayload) => dropALine(data),
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "We'll get back to you soon.",
        variant: "success",
      });
      reset();
    },
    onError: (error: any) => {
      console.error("Form submission error:", error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: error?.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <section className="w-full relative" id="contact">
      <div className="flex sm:flex-col lg:flex-row items-center justify-center gap-8 px-4 py-8 max-w-7xl mx-auto">
        {/* Left - Image */}
        <div
          className={`sm:w-full lg:w-[637px] sm:h-[300px] md:h-[562px] relative sm:order-2 lg:order-1 overflow-hidden ${
            inLeftView ? "animate__animated animate__slideInLeft" : ""
          }`}
          ref={leftRef}
        >
          <div className="relative h-full sm:scale-50 md:scale-75 lg:scale-100 origin-center">
            <img
              className="absolute w-full h-full left-[21px]"
              alt="Contact illustration"
              src={IMAGES.drop_us}
            />
          </div>
        </div>

        {/* Right - Form */}
        <div
          className={`flex flex-col sm:w-full lg:w-[840px] items-center justify-center gap-5 rounded-[20px] sm:order-1 lg:order-2 ${
            inRightView ? "animate__animated animate__slideInRight" : ""
          }`}
          ref={rightRef}
        >
          <header className="flex flex-col items-start gap-3 w-full">
            <h2 className="w-fit font-sans font-extrabold text-foreground sm:text-2xl md:text-3xl tracking-[0] sm:leading-tight md:leading-[42px]">
              Drop Us A Line
            </h2>
            <p className="w-full font-body text-muted-foreground sm:text-sm md:text-base">
              Feel free to connect with us through our online channels for
              updates, news, and more.
            </p>
          </header>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-5"
          >
            {/* Row 1 */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-[30px] w-full">
              <div className="flex-1 flex flex-col gap-2">
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  {...register("name")}
                  className="h-12 md:h-[60px] rounded-xl"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  {...register("email")}
                  className="h-12 md:h-[60px] rounded-xl"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-[30px] w-full">
              <div className="flex-1 flex flex-col gap-2">
                <Label htmlFor="phone">Phone Numbers</Label>
                <Input
                  id="phone"
                  placeholder="Phone Numbers"
                  {...register("phone")}
                  className="h-12 md:h-[60px] rounded-xl"
                  disabled={isSubmitting}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter Keyword"
                  {...register("subject")}
                  className="h-12 md:h-[60px] rounded-xl"
                  disabled={isSubmitting}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="description">Your Message</Label>
              <Textarea
                id="description"
                placeholder="Your Message"
                {...register("description")}
                className="min-h-[130px] rounded-2xl resize-none"
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending || isSubmitting}
              className="sm:w-full md:w-[305px] md:h-[62px] rounded-full"
            >
              {mutation.isPending || isSubmitting
                ? "Sending..."
                : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUsSection;
