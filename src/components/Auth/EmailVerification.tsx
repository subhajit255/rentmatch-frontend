import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"; // Import useNavigate for navigation
import { IMAGES } from "../../assets/index";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import Icon from "../icons/icon";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "../../custom-hooks/use-toast";
import { verifyMember } from "../../actions/auth";
import { memberType } from "@/src/types/memberTypes";
import { getOtpSchema } from "@/src/types/authTypes";
import { Eye, EyeOff, Mail, Clock, Edit2, Loader2, ArrowRight, User, Home, Briefcase, ShieldCheck } from "lucide-react";
import { changePasswordSchema, forgotEmailSchema, forgotOtpSchema } from "../../schemas/auth";
import { FormError } from "../errors";
import NavbarSection from "../ContentMangementSystem/screens/Landing/sections/NavbarSection/NavbarSection";
import FooterSection from "../ContentMangementSystem/screens/Landing/sections/FooterSection/FooterSection";

interface EmailVerificationProps {
  onChange?: (value: string) => void;
}

const defaultErrors = { email: "", otp: "", role: "", password: "", confirmPassword: "" }

// helpers
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}.${secs < 10 ? "0" : ""}${secs}`; // Format as MM.SS
};

const defaultTime = 120

const EmailVerification: React.FC<EmailVerificationProps> = ({ onChange }) => {
  const { page } = useParams()
  const inputsRef = useRef<Array<any>>([]);
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [timeLeft, setTimeLeft] = useState<number>(defaultTime); // 5 minutes = 300 seconds
  const [otpVisible, setOtpVisible] = useState<boolean>(false); // To control OTP input visibility
  const [buttonText, setButtonText] = useState<string>("Get OTP"); // Button text state
  // const [otpDisabled, setOtpDisabled] = useState<boolean>(true); // To control OTP input field disabled state
  const navigate = useNavigate(); // Initialize navigate for redirection
  const [getOtpPayload, setGetOtpPayload] = useState<getOtpSchema>({ role: "TENANT", email: "", type: "email", otp: "" })
  const [otpSection, setOtpSection] = useState<string>('')
  const [showPasswordSection, setShowPasswordSection] = useState<Boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPasswordPayload, setForgotPasswordPayload] = useState({ password: "", confirmPassword: "" })
  const [errors, setErrors] = useState(defaultErrors);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    const signupRole = localStorage.getItem("signup_role");
    if (signupRole) {
      setGetOtpPayload((prev) => ({ ...prev, role: signupRole as any }));
      localStorage.removeItem("signup_role");
    }
    return () => setTimeLeft(defaultTime);
  }, []);

  const { mutate: getOtp, isPending } = useMutation({
    mutationFn: verifyMember,
    onSuccess: (data) => {
      if (getOtpPayload?.type === "email") {
        setGetOtpPayload(prev => ({ ...prev, type: "otp" }))
        // restart the countdown from the moment the OTP is actually sent
        setTimeLeft(defaultTime);
        setCanResend(false);
        setOtpVisible(true); // Show OTP input
        setButtonText("Verify OTP"); // Change button text to "Verify OTP"
        // setOtpDisabled(false); // Enable OTP input fields
        setOtpSection(`Your OTP is ${data?.result?.otp}`)
        toast({
          title: "Success",
          description: data?.message || 'OTP has sent',
          variant: "success",
        })
      }

      if (getOtpPayload?.type === "resendotp") {
        console.log(data, "<---data for re-send otp")
        setGetOtpPayload(prev => ({ ...prev, type: "otp" }))
        setTimeLeft(defaultTime);
        setCanResend(false);
        setOtpVisible(true); // Show OTP input
        setButtonText("Verify OTP"); // Change button text to "Verify OTP"
        // setOtpDisabled(false); // Enable OTP input fields
        setOtpSection(`Your OTP is ${data?.return?.otp}`)
        toast({
          title: "Success",
          description: data?.message || 'Resend OTP has sent',
          variant: "success",
        })
      }
      // console.log("getOtpPayload?.type ::: ", getOtpPayload?.type);

      if (getOtpPayload?.type === "otp") {
        // console.log("data :: ", data)
        localStorage.setItem("userInfo", JSON?.stringify(getOtpPayload))
        toast({
          title: "Success",
          description: data?.message || 'OTP verified successfully',
          variant: "success",
        })
        if (page === "forgot-pass") {
          setGetOtpPayload(prev => ({ ...prev, type: "password" }))
          setShowPasswordSection(true);
          return;
        }
        navigate("/registration");
      }
      if (getOtpPayload?.type === "password") {
        // console.log("data : ", data?.message, data);
        toast({
          title: "Success",
          description: data?.message || 'Password changed successfully',
          variant: "success",
        })
        navigate("/login");
      }
    },
    onError: (error: any) => {
      // setServerError(error.response?.err?.detail || 'Login failed');
      console.log("error ::: ", error?.response?.data?.message);

      toast({
        title: "Error",
        description: error?.response?.data?.message || 'Verification failed',
        variant: "error",
      });
    },
  });

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    if (timeLeft == 0) {
      setCanResend(true)
    }

    // Cleanup the interval on component unmount
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleGetOtp = () => {
    const validation = forgotEmailSchema.safeParse(getOtpPayload)
    if (!validation.success) {
      // console.log("validation ::: ", validation, validation.error.issues);

      const fieldErrors: Record<string, string> = {};

      validation.error.issues?.forEach((err) => {
        const field = err.path[0];
        fieldErrors[field as string] = err.message;
      });

      setErrors(prev => ({
        ...prev,
        email: fieldErrors.email ?? "",
      }));
      return;
    }
    setErrors(defaultErrors)
    if (page === "forgot-pass") {
      // console.log("Biradarrrrrrrrrrrrrrrr");

      let payload = {
        ...getOtpPayload,
        type: "forgotpassword"
      }


      getOtp(payload)
      return
    }
    getOtp(getOtpPayload)

  };

  const handleChange = (e: any) => {
    // console.log("[e?.target?.name] : e.target.value", { [e?.target?.name]: e.target.value });
    setErrors(prev => ({ ...prev, [e?.target?.name]: "" }))

    setGetOtpPayload(prev => ({ ...prev, [e?.target?.name]: e.target.value }));

  }

  const handleChangeOtp = (e: any, index: number) => {
    setErrors(prev => ({ ...prev, otp: "" }))
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return; // allow only one digit number

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // console.log("value : ", value);

    // Move to next input if not last and value entered
    if (value && index < newOtp?.length - 1) {
      inputsRef.current[index + 1].focus();
    }

    onChange?.(newOtp.join(""));
  }

  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = () => {
    // all 4 OTP digits must be entered before verifying
    if (getOtpPayload?.type === "otp" && !/^\d{4}$/.test(otp?.join('') || "")) {
      setErrors(prev => ({ ...prev, otp: "Please enter 4 digit of OTP" }))
      return;
    }
    if (page === "forgot-pass") {
      // console.log("Biradarrrrrrrrrrrrrrrr", getOtpPayload);
      let payload = { ...getOtpPayload }
      // console.log("getOtpPayload?.type ::: ", getOtpPayload?.type);

      if (getOtpPayload?.type === "password") {
        // console.log("--------------------------------------------");

        const { otp: otpl, ...rest } = payload;
        payload = {
          ...rest,
          ...forgotPasswordPayload
        }
        const validation = changePasswordSchema.safeParse(payload)
        if (!validation.success) {
          validation.error.issues.forEach((err) => {
            const field = err.path[0];
            setErrors(prev => ({ ...prev, [field]: err.message }))
          })
          return;
        }
      }
      if (getOtpPayload?.type === "otp") {
        payload = { ...payload, otp: otp?.join('') || "" }
        const validation = forgotOtpSchema.safeParse(payload)
        if (!validation.success) {
          validation.error.issues.forEach((err) => {
            const field = err.path[0];
            setErrors(prev => ({ ...prev, [field]: err.message }))
          })
          return;
        }
      }

      // console.log("forgotPasswordPayload ::: ", payload);

      getOtp(payload)
      return
    }
    getOtp({ ...getOtpPayload, otp: otp?.join('') })
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    // setOtp(Array(4).fill(""));
    setTimeLeft(defaultTime);
    setCanResend(false);
    setGetOtpPayload(prev => ({ ...prev, type: "resendotp" }))

    const resendPayload = {
      ...getOtpPayload,
      type: "resendotp",
      otp: ""
    };

    getOtp(resendPayload);          // trigger mutation with resend type
  };

  const roles = [
    { value: "TENANT", label: "Tenant", description: "Find the perfect rental property match", icon: Home },
    { value: "LANDLORD", label: "Landlord", description: "List properties and match with tenants", icon: User },
    { value: "PROPERTY MANAGER", label: "Real Estate Professional", description: "Request an agency account and manage properties", icon: Briefcase },
    // admins can only reset their password here (backend picks the admin model by role)
    ...(page === "forgot-pass"
      ? [
        { value: "ADMIN", label: "Admin", description: "Reset your admin account password", icon: ShieldCheck },
        { value: "SUPER ADMIN", label: "Super Admin", description: "Reset your super admin account password", icon: ShieldCheck },
      ]
      : []),
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#EFF4FB] font-sans">
      <NavbarSection />

      <main className="w-full max-w-2xl mx-auto px-4 pt-4 sm:pt-6 pb-12 flex-1">
        <div className="text-center mb-5">
          <span className="inline-block px-3 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase bg-[#E8F8EE] text-[#0F7A4A] mb-1.5">
            RentMatch Account
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A] tracking-tight mb-1">
            {page === "forgot-pass" ? "Forgot Your Password?" : "Create an Account"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {page === "forgot-pass"
              ? "Confirm your email and set a new password to regain access to your account."
              : "Verify your email to get started with Australia's smarter rental matching platform."}
          </p>
        </div>

        <Card className="overflow-hidden shadow-lg shadow-slate-200/50 bg-white border border-slate-100 rounded-[1.75rem]">
          <CardContent className="p-5 sm:p-7 md:p-8">
            <div className="w-full mx-auto space-y-5">
              {/* Role Selection Grid */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="role"
                  className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                  I Will Join As
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {roles.map((item) => {
                    const isSelected = getOtpPayload.role === item.value;
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.value}
                        onClick={() => {
                          setErrors((prev) => ({ ...prev, role: "" }));
                          setGetOtpPayload((prev) => ({ ...prev, role: item.value as any }));
                        }}
                        className={`cursor-pointer p-3.5 sm:p-4 rounded-xl border-2 transition-all duration-200 flex flex-col gap-2 hover:shadow-sm ${isSelected
                            ? "border-[#1E40AF] bg-[#EEF4FF]/50 shadow-xs"
                            : "border-slate-100 bg-white hover:border-slate-200"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`p-1.5 rounded-lg ${isSelected ? "bg-[#EEF4FF] text-[#1E40AF]" : "bg-slate-50 text-slate-500"}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${isSelected ? "border-[#1E40AF] bg-[#1E40AF]" : "border-slate-300"
                              }`}
                          >
                            {isSelected && <div className="w-1 h-1 rounded-full bg-white" />}
                          </div>
                        </div>
                        <div>
                          <span className={`font-bold text-xs sm:text-sm block mb-0.5 transition-colors ${isSelected ? "text-[#1E40AF]" : "text-slate-800"}`}>
                            {item.label}
                          </span>
                          <p className="text-[11px] text-slate-500 leading-snug">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors?.role && <FormError message={errors.role} className="mt-0" />}
              </div>

              {/* Email Input Section */}
              <div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Email ID <span className="text-destructive">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm transition-all">
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={getOtpPayload?.email}
                      onChange={handleChange}
                      className={`h-12 text-base pl-11 rounded-xl border border-slate-200 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-1 transition-all ${otpVisible ? "bg-slate-50 text-slate-500 cursor-not-allowed border-slate-100" : ""
                        }`}
                      placeholder="Enter your email address"
                      disabled={otpVisible}
                    />
                    <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                {errors?.email && <FormError message={errors.email} />}
              </div>

              {/* OTP Fields Section */}
              {otpVisible && (
                <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5 md:p-6 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
                        Verification Code
                      </span>
                      <p className="text-sm text-slate-600">
                        {otpSection || "We sent a 4-digit code to your email"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-slate-900 break-all">{getOtpPayload?.email}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setTimeLeft(defaultTime);
                            setOtpVisible(false);
                            setButtonText('Get OTP');
                            setGetOtpPayload(prev => ({ ...prev, type: "email" }))
                          }}
                          className="p-1 rounded-md hover:bg-slate-200/60 text-slate-500 transition-colors"
                          title="Edit email"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="flex gap-2">
                        {otp.map((value: string, index: number) => (
                          <div key={index} className="relative">
                            <Input
                              id={`otp-${index}`}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={1}
                              className="w-12 h-12 text-center text-xl font-bold border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                              value={value}
                              onChange={(e) => handleChangeOtp(e, index)}
                              onKeyDown={(e) => handleKeyDown(e, index)}
                              ref={(el) => { inputsRef.current[index] = el; }}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Expires in:</span>
                        <span className={`font-semibold ${timeLeft < 30 ? "text-rose-500 animate-pulse" : "text-primary"}`}>
                          {formatTime(timeLeft)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {errors?.otp && <FormError message={errors?.otp} />}
                </div>
              )}

              {/* Resend Action */}
              {otpVisible && (
                <div className="text-center text-sm text-slate-500">
                  {timeLeft > 0 ? (
                    <p>
                      Didn't receive the code? Resend in <span className="font-semibold text-slate-700">{formatTime(timeLeft)}</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors"
                      disabled={isPending}
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              )}

              {/* Password Section (Forgot Password route flow only) */}
              {showPasswordSection && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6 mt-6">
                  <div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="password"
                        className="text-sm font-semibold text-slate-700"
                      >
                        {page === "forgot-pass" ? "New Password" : "Password"} <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={forgotPasswordPayload?.password}
                          onChange={(e) =>
                            setForgotPasswordPayload(prev => ({ ...prev, [e?.target?.name]: e?.target?.value }))
                          }
                          className="h-12 text-base pr-11 rounded-xl border border-slate-200 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-1"
                          placeholder="Min 8 characters"
                        />
                        <button
                          type="button"
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          onClick={() => setShowPassword(prev => !prev)}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    {errors?.password && <FormError message={errors?.password} />}
                  </div>

                  <div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="confirmPassword"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Confirm Password <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          id="confirmpassword"
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={forgotPasswordPayload?.confirmPassword}
                          onChange={(e) =>
                            setForgotPasswordPayload(prev => ({ ...prev, [e?.target?.name]: e?.target?.value }))
                          }
                          className="h-12 text-base pr-11 rounded-xl border border-slate-200 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-1"
                          placeholder="Repeat password"
                        />
                        <button
                          type="button"
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          onClick={() => setShowConfirmPassword(prev => !prev)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    {errors?.confirmPassword && <FormError message={errors?.confirmPassword} />}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-center pt-2">
                <Button
                  onClick={
                    buttonText === "Get OTP"
                      ? handleGetOtp
                      : handleVerifyOtp
                  }
                  disabled={isPending}
                  className="w-full sm:w-auto min-w-[200px] h-12 md:h-14 px-8 rounded-full font-bold text-base md:text-lg bg-primary hover:bg-primary/95 text-white transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{buttonText}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <FooterSection />
    </div>
  );
};

export default EmailVerification;
