import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Home,
  Building2,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, SigninSchemaType } from "../../schemas/auth";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginMember } from "../../actions/auth";
import { toast } from "../../custom-hooks/use-toast";
import { logInSchema } from "../../types/authTypes";
import { useAuth } from "../../context/AuthContext";
import NavbarSection from "../ContentMangementSystem/screens/Landing/sections/NavbarSection/NavbarSection";
import FooterSection from "../ContentMangementSystem/screens/Landing/sections/FooterSection/FooterSection";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginContext } = useAuth();
  const queryClient = useQueryClient();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isAdminPortal, setIsAdminPortal] = useState<boolean>(false);

  const {
    register: loginPayload,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SigninSchemaType>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      role: "TENANT",
      user_id: "",
      password: "",
    },
  });

  const selectedRole = watch("role");

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginMember,
    onSuccess: (data) => {
      loginContext(
        data?.result?.loginInstance || { role: data?.result?.role } || {},
        data?.result?.token || "",
        data?.result?.rolePermission?.access || []
      );
      queryClient.clear();
      toast({
        title: "Success",
        description: data?.message || "Successfully logged in",
        variant: "success",
      });
      const userInstance = data?.result?.loginInstance || {};
      const isSubscribe = Boolean(userInstance?.is_subscribe);
      const userRole = userInstance?.role || data?.result?.role || selectedRole;
      const isOwnerRole = userRole === "LANDLORD" || userRole === "PROPERTY MANAGER";

      if (location.state?.from === "/checkout" && location.state?.plan_details) {
        navigate("/checkout", {
          state: {
            plan_id: location.state?.plan_id,
            plan_details: location.state?.plan_details,
          },
        });
      } else if (location.state?.from) {
        navigate(location.state.from);
      } else if (isOwnerRole && !isSubscribe) {
        navigate("/pricing-and-plans");
      } else {
        navigate("/dashboard");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Login failed",
        variant: "error",
      });
    },
  });

  const onSubmit = (data: SigninSchemaType) => {
    login({ ...data } as logInSchema);
  };

  useEffect(() => {
    if (location.pathname === "/admin/login") {
      setIsAdminPortal(true);
      setValue("role", "ADMIN");
    } else if (location.pathname === "/super-admin/login") {
      setIsAdminPortal(true);
      setValue("role", "SUPER ADMIN");
    } else {
      setIsAdminPortal(false);
    }
  }, [location, setValue]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#EFF4FB] font-sans">
      <NavbarSection />

      {/* Main Login Content */}
      <main className="w-full max-w-[1140px] mx-auto px-4 py-8 sm:py-12 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Login Card */}
          <div className="lg:col-span-6 w-full">
            <div className="bg-white rounded-[28px] p-8 sm:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-slate-100">
              <h1 className="text-3xl font-extrabold text-[#1E3A8A] tracking-tight mb-2">
                Welcome back
              </h1>
              <p className="text-sm text-slate-500 mb-6">
                Log in to see your matches, invitations and messages.
              </p>

              {isAdminPortal && (
                <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-2.5 text-xs font-extrabold text-[#1E3A8A]">
                  <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" />
                  <span>
                    {selectedRole === "SUPER ADMIN"
                      ? "SUPER ADMINISTRATOR PORTAL"
                      : "ADMINISTRATOR PORTAL"}
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...loginPayload("user_id")}
                    placeholder="you@example.com"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                  />
                  {errors.user_id && (
                    <p className="text-xs text-red-500 font-medium mt-1">
                      {errors.user_id.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...loginPayload("password")}
                      placeholder="Your password"
                      className="w-full h-12 px-4 pr-11 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 font-medium mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Forgot password link */}
                <div className="pt-1">
                  <a
                    href="/email-verification/forgot-pass"
                    className="text-xs font-semibold text-[#1E40AF] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-12 mt-4 rounded-full bg-[#1E40AF] hover:bg-[#1e3a8a] text-white font-bold text-sm tracking-wide shadow-sm hover:shadow transition-all flex items-center justify-center cursor-pointer disabled:opacity-70"
                >
                  {isPending ? "Logging in..." : "Log in"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: New to RentMatch? */}
          <div className="lg:col-span-6 w-full pt-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A] tracking-tight mb-1.5">
              New to RentMatch?
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Choose the path that fits you.
            </p>

            <div className="flex flex-col gap-3.5">
              {/* Option 1: Renter */}
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("signup_role", "TENANT");
                  navigate("/registration");
                }}
                className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#E8F8EE] flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#15803D]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#1E3A8A] transition-colors">
                      I am a renter
                    </h3>
                    <p className="text-xs text-slate-500">
                      Create one private rental brief
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </button>

              {/* Option 2: Landlord */}
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("signup_role", "LANDLORD");
                  navigate("/registration");
                }}
                className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#EEF4FF] flex items-center justify-center shrink-0">
                    <Home className="w-5 h-5 text-[#1E40AF]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#1E3A8A] transition-colors">
                      I am a private landlord
                    </h3>
                    <p className="text-xs text-slate-500">
                      List a property and find matches
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </button>

              {/* Option 3: Real Estate Professional */}
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("signup_role", "PROPERTY MANAGER");
                  navigate("/registration");
                }}
                className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#EEF4FF] flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-[#1E40AF]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#1E3A8A] transition-colors">
                      I am a real estate professional
                    </h3>
                    <p className="text-xs text-slate-500">
                      Request an Agency Account
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mt-5">
              Real estate professionals use the web portal only. Mobile sign-in for professional accounts shows a web portal message.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Section below */}
      <FooterSection />
    </div>
  );
};

export default Login;
