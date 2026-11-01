import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Send } from "lucide-react";
import { Button } from "../../../../../ui/button";
import { Input } from "../../../../../ui/input";
import { Label } from "../../../../../ui/label";
import { Textarea } from "../../../../../ui/textarea";
import { IMAGES } from "../../../../../../assets/index";
import { useInView } from "react-intersection-observer";
import { dropALine } from "../../../../../../actions/cms/cmsPageApis";
import { toast } from "../../../../../../custom-hooks/use-toast";

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

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
}

const ContactUsSection = () => {
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
    <section className="w-full relative py-12 md:py-16 bg-[#f6f9fc]" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Centered Section Header above Left and Right Columns */}
        <header className="text-center max-w-2xl mx-auto mb-8 md:mb-10 flex flex-col items-center gap-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b2b4a] tracking-tight leading-tight">
            We're here <span className="text-[#2d7aff]">to help</span>
          </h2>
          <p className="text-sm sm:text-base text-[#4a5a6e] font-medium leading-relaxed">
            Have a question about renting, listing a property, or using RentMatch?
            Send us a message and our team will get back to you.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-[28px] p-6 sm:p-10 lg:p-12 shadow-[0_12px_40px_rgba(0,20,40,0.06)] border border-[#edf2f9]">

          {/* Left Column: Contact Info & Illustration Background */}
          <div
            ref={leftRef}
            className={`lg:col-span-5 flex flex-col justify-between gap-6 relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-[#f7faff] to-[#edf4ff] border border-[#e6eefa] min-h-[300px] ${inLeftView ? "animate__animated animate__slideInLeft" : ""}`}
          >
            {/* Background Illustration Image */}
            <img
              src={IMAGES.drop_us}
              alt="Contact illustration background"
              className="absolute -bottom-4 -right-4 w-[240px] md:w-[280px] opacity-30 pointer-events-none object-contain select-none z-0"
            />

            <div className="relative z-10 flex flex-col gap-2">
              <h3 className="text-xl font-bold text-[#0b2b4a]">
                Get In Touch
              </h3>
              <p className="text-xs sm:text-sm text-[#4a5a6e] font-medium leading-relaxed">
                Our team is always ready to assist you with any questions or support.
              </p>
            </div>

            <div className="relative z-10 flex flex-col gap-4">
              {/* Compact Prefer Email Info Card */}
              <div className="inline-flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-xl p-2.5 px-3.5 border border-[#e2e9f2] shadow-sm max-w-fit">
                <div className="w-9 h-9 rounded-full bg-[#e1edff] text-[#2d7aff] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#5f6f84]">
                    Prefer email?
                  </div>
                  <a
                    href="mailto:info@rentmatch.au"
                    className="text-xs sm:text-sm font-bold text-[#0b2b4a] hover:text-[#2d7aff] transition-colors"
                  >
                    info@rentmatch.au
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div
            ref={rightRef}
            className={`lg:col-span-7 flex flex-col justify-center gap-6 ${inRightView ? "animate__animated animate__slideInRight" : ""
              }`}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-5"
            >
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name" className="text-xs font-bold text-[#1f3a5f] tracking-wide uppercase">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    {...register("name")}
                    className="h-12 rounded-xl border-[#e2e9f2] bg-[#fafcff] focus:bg-white text-sm font-medium"
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs font-semibold">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-[#1f3a5f] tracking-wide uppercase">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    {...register("email")}
                    className="h-12 rounded-xl border-[#e2e9f2] bg-[#fafcff] focus:bg-white text-sm font-medium"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs font-semibold">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Phone & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone" className="text-xs font-bold text-[#1f3a5f] tracking-wide uppercase">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    placeholder="Your phone number"
                    {...register("phone")}
                    className="h-12 rounded-xl border-[#e2e9f2] bg-[#fafcff] focus:bg-white text-sm font-medium"
                    disabled={isSubmitting}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs font-semibold">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="subject" className="text-xs font-bold text-[#1f3a5f] tracking-wide uppercase">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Subject / Topic"
                    {...register("subject")}
                    className="h-12 rounded-xl border-[#e2e9f2] bg-[#fafcff] focus:bg-white text-sm font-medium"
                    disabled={isSubmitting}
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-xs font-semibold">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description" className="text-xs font-bold text-[#1f3a5f] tracking-wide uppercase">
                  Message
                </Label>
                <Textarea
                  id="description"
                  placeholder="Type your message here..."
                  {...register("description")}
                  className="min-h-[140px] rounded-xl border-[#e2e9f2] bg-[#fafcff] focus:bg-white text-sm font-medium resize-none"
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs font-semibold">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex items-center pt-2">
                <Button
                  type="submit"
                  disabled={mutation.isPending || isSubmitting}
                  className="bg-[#2d7aff] hover:bg-[#1a5fd9] text-white px-8 h-12 rounded-full font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {mutation.isPending || isSubmitting
                      ? "Sending..."
                      : "Send Message"}
                  </span>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactUsSection;
